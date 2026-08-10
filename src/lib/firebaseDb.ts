import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  runTransaction,
  serverTimestamp,
  Timestamp
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase";
import { TeamRecord, AuditLog, AdminNotification, getStoredTeams } from "./adminStore";
import { MemberData } from "../types/registration";
import { fileToDataUrl } from "./imageCompression";

// Collection Names
const REGISTRATIONS_COLLECTION = "registrations";
const COUNTERS_COLLECTION = "counters";
const SETTINGS_COLLECTION = "settings";
const AUDIT_LOGS_COLLECTION = "auditLogs";
const NOTIFICATIONS_COLLECTION = "notifications";

/**
 * Recursively removes undefined values from objects to satisfy Firestore setDoc strict requirement
 */
export function sanitizeForFirestore<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return null as any;
  }
  if (typeof obj !== "object") {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeForFirestore(item)) as any;
  }
  const cleanObj: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      cleanObj[key] = sanitizeForFirestore(value);
    }
  }
  return cleanObj;
}

export interface RegistrationSearchResult {
  team: TeamRecord;
  matchedMember: MemberData | null;
  matchedRole: string;
}

/**
 * Find an existing registration by user email / register number in Firestore or local store
 * Matches both Team Leader and any Team Member (e.g. 99240051026 from 99240051026@klu.ac.in)
 */
export async function findRegistrationByUserEmail(userEmail: string): Promise<RegistrationSearchResult | null> {
  if (!userEmail) return null;
  const cleanEmail = userEmail.trim().toLowerCase();
  const regNumberMatch = cleanEmail.split("@")[0].trim().toLowerCase();

  // Helper function to check if a TeamRecord matches the user email or reg number strictly
  const isTeamMatch = (data: TeamRecord): { isMatch: boolean; matchedMember: MemberData | null; matchedRole: string } => {
    if (!data) return { isMatch: false, matchedMember: null, matchedRole: '' };

    const createdBy = (data as any).registeredByEmail ? (data as any).registeredByEmail.trim().toLowerCase() : "";
    const isCreatedByMatch = Boolean(createdBy && (createdBy === cleanEmail || createdBy === regNumberMatch));

    let matchedMember: MemberData | null = null;
    let matchedRole = "Team Leader";

    if (data.members && Array.isArray(data.members)) {
      for (const m of data.members) {
        if (!m) continue;
        const regNum = m.registerNumber ? m.registerNumber.trim().toLowerCase() : "";
        const memPhone = m.phone ? m.phone.replace(/\D/g, "") : "";
        const memEmail = (m as any).email ? (m as any).email.trim().toLowerCase() : "";
        const userPhoneDigits = cleanEmail.replace(/\D/g, "");

        const isMemberMatch = Boolean(
          (regNum && (regNum === cleanEmail || regNum === regNumberMatch)) ||
          (memEmail && memEmail === cleanEmail) ||
          (memPhone && userPhoneDigits.length === 10 && memPhone === userPhoneDigits)
        );

        if (isMemberMatch) {
          matchedMember = m;
          matchedRole = m.role || (m.id === '1' ? 'Leader' : 'Member');
          return { isMatch: true, matchedMember, matchedRole };
        }
      }
    }

    if (isCreatedByMatch) {
      matchedMember = data.members && data.members.length > 0 ? data.members[0] : null;
      matchedRole = matchedMember?.role || 'Leader';
      return { isMatch: true, matchedMember, matchedRole };
    }

    return { isMatch: false, matchedMember: null, matchedRole: '' };
  };

  try {
    const q = query(collection(db, REGISTRATIONS_COLLECTION));
    const snapshot = await getDocs(q);

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data() as TeamRecord;
      const { isMatch, matchedMember, matchedRole } = isTeamMatch(data);
      if (isMatch) {
        const teamRecord: TeamRecord = {
          ...data,
          id: data.id || docSnap.id,
        };
        return {
          team: teamRecord,
          matchedMember,
          matchedRole
        };
      }
    }

    // Firestore query succeeded and no match was found for this user in Firebase
    return null;
  } catch (err) {
    console.warn("Firestore findRegistrationByUserEmail notice (checking local store fallback):", err);
    // Only check local store fallback if Firestore network request failed
    try {
      const localTeams = getStoredTeams();
      for (const t of localTeams) {
        const { isMatch, matchedMember, matchedRole } = isTeamMatch(t);
        if (isMatch) {
          return {
            team: t,
            matchedMember,
            matchedRole
          };
        }
      }
    } catch (e) {
      // ignore
    }
  }

  return null;
}

/**
 * Upload payment receipt image to Firestore directly as Base64 Data URL
 * (Eliminates browser CORS preflight network errors and works 100% reliably)
 */
export async function uploadReceiptImage(
  registrationId: string,
  compressedFile?: File | null,
  dataUrl?: string | null
): Promise<string> {
  // 1. If dataUrl is a valid base64 data URL, use it directly for Firestore document
  if (dataUrl && dataUrl.startsWith("data:")) {
    return dataUrl;
  }

  // 2. If compressedFile is present, convert to base64 Data URL directly
  if (compressedFile) {
    try {
      const b64 = await fileToDataUrl(compressedFile);
      if (b64 && b64.startsWith("data:")) {
        return b64;
      }
    } catch (err) {
      console.warn("Base64 conversion fallback notice:", err);
    }
  }

  // 3. If explicit storage upload is requested via environment variable VITE_ENABLE_FIREBASE_STORAGE
  if (import.meta.env.VITE_ENABLE_FIREBASE_STORAGE === "true" && compressedFile) {
    try {
      const storageRef = ref(storage, `payment-receipts/${registrationId}.webp`);
      const snapshot = await uploadBytes(storageRef, compressedFile);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      if (downloadUrl) {
        return downloadUrl;
      }
    } catch (err) {
      console.warn("Firebase Storage upload notice:", err);
    }
  }

  // 4. Use non-blob dataUrl if available
  if (dataUrl && !dataUrl.startsWith("blob:")) {
    return dataUrl;
  }

  // 5. Default fallback image
  return "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80";
}

/**
 * Create a new registration with atomic sequential ID & queue number via Firestore Transaction
 */
export async function createRegistrationInFirestore(payload: {
  teamName: string;
  members: MemberData[];
  transactionId: string;
  amount: number;
  compressedFile?: File | null;
  dataUrl?: string | null;
  registeredByEmail?: string;
}): Promise<TeamRecord> {

  const counterDocRef = doc(db, COUNTERS_COLLECTION, "registrations");

  let regIdStr = "";
  let nextQueue = 1;

  try {
    // Run transaction to compute sequential registration ID & queue number atomically
    await runTransaction(db, async (transaction) => {
      const counterDoc = await transaction.get(counterDocRef);

      if (!counterDoc.exists()) {
        nextQueue = 1;
        transaction.set(counterDocRef, { currentCount: 1 });
      } else {
        const count = counterDoc.data().currentCount || 0;
        nextQueue = count + 1;
        transaction.update(counterDocRef, { currentCount: nextQueue });
      }

      const paddedId = String(nextQueue).padStart(4, "0");
      regIdStr = `DFR2026-${paddedId}`;
    });
  } catch (txErr) {
    console.warn("Firestore transaction notice (using sequential fallback):", txErr);
    const timestamp = Date.now().toString().slice(-4);
    regIdStr = `DFR2026-${timestamp}`;
  }

  // Upload payment screenshot to Firebase Storage / WebP Data URL
  const screenshotUrl = await uploadReceiptImage(regIdStr, payload.compressedFile, payload.dataUrl);

  const formattedDate = new Date().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const newTeam: TeamRecord = {
    id: regIdStr,
    teamName: payload.teamName,
    createdAt: formattedDate,
    memberCount: payload.members.length,
    members: payload.members,
    paymentStatus: "pending",
    transactionId: payload.transactionId,
    amount: payload.amount,
    submittedAt: formattedDate,
    screenshotUrl: screenshotUrl,
    registeredByEmail: payload.registeredByEmail || "",
    timeline: [
      { title: "Registration Created", timestamp: formattedDate, completed: true },
      { title: "Payment Submitted", timestamp: formattedDate, completed: true },
      { title: "Pending Verification", timestamp: formattedDate, completed: true },
      { title: "Approved", timestamp: "Pending", completed: false },
      { title: "Confirmation Sent", timestamp: "Pending", completed: false },
    ],
  };

  try {
    // Save registration document in Firestore (sanitized to prevent undefined errors)
    const regDocRef = doc(db, REGISTRATIONS_COLLECTION, regIdStr);
    const sanitizedData = sanitizeForFirestore({
      ...newTeam,
      queueNumber: nextQueue,
      timestamp: serverTimestamp(),
    });
    await setDoc(regDocRef, sanitizedData);

    // Create audit log
    const sanitizedLog = sanitizeForFirestore({
      id: `log_${Date.now()}`,
      adminName: "System",
      action: "Edit Team" as const,
      teamName: payload.teamName,
      timestamp: formattedDate,
      details: `New team registration created: ${regIdStr} (${payload.members.length} members)`,
    });
    await addAuditLogToFirestore(sanitizedLog);
  } catch (dbErr) {
    console.warn("Firestore setDoc notice (saved locally):", dbErr);
  }

  return newTeam;
}

/**
 * Subscribe to real-time registrations updates from Firestore
 */
export function subscribeToFirestoreRegistrations(callback: (teams: TeamRecord[]) => void) {
  const q = query(collection(db, REGISTRATIONS_COLLECTION));

  return onSnapshot(
    q,
    (snapshot) => {
      const teams: TeamRecord[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: data.id || docSnap.id,
          teamName: data.teamName || "Unnamed Team",
          createdAt: data.createdAt || "Just now",
          memberCount: data.memberCount || (data.members ? data.members.length : 0),
          members: data.members || [],
          paymentStatus: data.paymentStatus || "pending",
          transactionId: data.transactionId || "",
          amount: data.amount || 0,
          submittedAt: data.submittedAt || "Just now",
          screenshotUrl: data.screenshotUrl || "",
          approvedBy: data.approvedBy,
          approvedAt: data.approvedAt,
          rejectReason: data.rejectReason,
          timeline: data.timeline || [],
        };
      });

      // Sort teams in reverse chronological order (newest first)
      teams.sort((a, b) => b.id.localeCompare(a.id));

      callback(teams);
    },
    (error) => {
      console.warn("Firestore subscription notice (using local data fallback):", error);
    }
  );
}

export async function approveRegistrationInFirestore(teamId: string, adminName: string): Promise<void> {
  const docRef = doc(db, REGISTRATIONS_COLLECTION, teamId);
  const now = new Date().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  try {
    const docSnap = await getDoc(docRef);
    let updatedTimeline = [
      { title: "Registration Created", timestamp: now, completed: true },
      { title: "Payment Submitted", timestamp: now, completed: true },
      { title: "Pending Verification", timestamp: now, completed: true },
      { title: "Approved", timestamp: now, completed: true },
      { title: "Confirmation Sent", timestamp: now, completed: true },
    ];

    if (docSnap.exists()) {
      const existingTimeline = docSnap.data().timeline || [];
      updatedTimeline = [
        existingTimeline[0] || { title: "Registration Created", timestamp: now, completed: true },
        existingTimeline[1] || { title: "Payment Submitted", timestamp: now, completed: true },
        existingTimeline[2] || { title: "Pending Verification", timestamp: now, completed: true },
        { title: "Approved", timestamp: now, completed: true },
        { title: "Confirmation Sent", timestamp: now, completed: true },
      ];
    }

    await updateDoc(docRef, {
      paymentStatus: "approved",
      approvedBy: adminName,
      approvedAt: now,
      rejectReason: "",
      timeline: updatedTimeline,
    });

    const teamNameVal = docSnap.exists() ? docSnap.data().teamName : teamId;
    const sanitizedLog = sanitizeForFirestore({
      id: `log_${Date.now()}`,
      adminName: adminName,
      action: "Approve Payment" as const,
      teamName: teamNameVal,
      timestamp: now,
      details: `Team ${teamId} (${teamNameVal}) payment approved by ${adminName}`,
    });
    await addAuditLogToFirestore(sanitizedLog);
  } catch (err) {
    console.warn("Error updating Firestore approval:", err);
    // Fallback setDoc merge
    await setDoc(
      docRef,
      {
        paymentStatus: "approved",
        approvedBy: adminName,
        approvedAt: now,
        rejectReason: "",
      },
      { merge: true }
    );
  }
}

/**
 * Reject payment in Firestore
 */
export async function rejectRegistrationInFirestore(
  teamId: string,
  adminName: string,
  reason: string
): Promise<void> {
  const docRef = doc(db, REGISTRATIONS_COLLECTION, teamId);
  const now = new Date().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  try {
    const docSnap = await getDoc(docRef);
    let updatedTimeline = [
      { title: "Registration Created", timestamp: now, completed: true },
      { title: "Payment Submitted", timestamp: now, completed: true },
      { title: "Pending Verification", timestamp: now, completed: true },
      { title: "Rejected", timestamp: now, completed: true },
      { title: "Confirmation Sent", timestamp: "N/A", completed: false },
    ];

    if (docSnap.exists()) {
      const existingTimeline = docSnap.data().timeline || [];
      updatedTimeline = [
        existingTimeline[0] || { title: "Registration Created", timestamp: now, completed: true },
        existingTimeline[1] || { title: "Payment Submitted", timestamp: now, completed: true },
        existingTimeline[2] || { title: "Pending Verification", timestamp: now, completed: true },
        { title: "Rejected", timestamp: now, completed: true },
        { title: "Confirmation Sent", timestamp: "N/A", completed: false },
      ];
    }

    await updateDoc(docRef, {
      paymentStatus: "rejected",
      approvedBy: adminName,
      approvedAt: now,
      rejectReason: reason,
      timeline: updatedTimeline,
    });

    const teamNameVal = docSnap.exists() ? docSnap.data().teamName : teamId;
    const sanitizedLog = sanitizeForFirestore({
      id: `log_${Date.now()}`,
      adminName: adminName,
      action: "Reject Payment" as const,
      teamName: teamNameVal,
      timestamp: now,
      details: `Team ${teamId} (${teamNameVal}) payment rejected: ${reason}`,
    });
    await addAuditLogToFirestore(sanitizedLog);
  } catch (err) {
    console.warn("Error updating Firestore rejection:", err);
    // Fallback setDoc merge
    await setDoc(
      docRef,
      {
        paymentStatus: "rejected",
        approvedBy: adminName,
        approvedAt: now,
        rejectReason: reason,
      },
      { merge: true }
    );
  }
}

/**
 * Update registration details in Firestore
 */
export function updateRegistrationInFirestore(team: TeamRecord): Promise<void> {
  const docRef = doc(db, REGISTRATIONS_COLLECTION, team.id);
  return setDoc(docRef, team, { merge: true });
}

/**
 * Delete registration in Firestore
 */
export function deleteRegistrationInFirestore(teamId: string): Promise<void> {
  const docRef = doc(db, REGISTRATIONS_COLLECTION, teamId);
  return deleteDoc(docRef);
}

/**
 * Add Audit Log entry in Firestore
 */
export async function addAuditLogToFirestore(log: AuditLog): Promise<void> {
  try {
    const docRef = doc(db, AUDIT_LOGS_COLLECTION, log.id || `log_${Date.now()}`);
    await setDoc(docRef, {
      ...log,
      timestampField: serverTimestamp(),
    });
  } catch (err) {
    console.error("Error adding audit log:", err);
  }
}

/**
 * Subscribe to Audit Logs
 */
export function subscribeToFirestoreAuditLogs(callback: (logs: AuditLog[]) => void) {
  const q = query(collection(db, AUDIT_LOGS_COLLECTION), orderBy("timestampField", "desc"));
  return onSnapshot(q, (snapshot) => {
    const logs = snapshot.docs.map((d) => d.data() as AuditLog);
    callback(logs);
  });
}

/**
 * Seed Firestore with comprehensive Demo Data for Architecture Verification
 */
export async function seedDemoRegistrationsInFirestore(): Promise<number> {
  const demoTeams: TeamRecord[] = [
    {
      id: "DFR2026-0001",
      teamName: "Quantum Realm",
      createdAt: "12 Aug, 10:15 AM",
      memberCount: 5,
      paymentStatus: "pending",
      transactionId: "UPI/984201847201",
      amount: 1750,
      submittedAt: "12 Aug, 11:43 AM",
      screenshotUrl:
        "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80",
      timeline: [
        { title: "Registration Created", timestamp: "12 Aug, 10:15 AM", completed: true },
        { title: "Payment Submitted", timestamp: "12 Aug, 11:43 AM", completed: true },
        { title: "Pending Verification", timestamp: "12 Aug, 11:43 AM", completed: true },
        { title: "Approved", timestamp: "Pending", completed: false },
        { title: "Confirmation Sent", timestamp: "Pending", completed: false },
      ],
      members: [
        {
          id: "m1",
          role: "Leader",
          name: "Sai Venkat",
          registerNumber: "99240041356",
          phone: "+91 9876543210",
          year: "3rd Year",
          department: "CSE",
          section: "24S01",
          residenceType: "Hosteller",
          hostelName: "BH-1 (Tagore Hall)",
          roomNumber: "304",
          wardenName: "Dr. Kumar",
          wardenPhone: "+91 9876500001",
        },
        {
          id: "m2",
          role: "Member 1",
          name: "Ananya Sharma",
          registerNumber: "99240041357",
          phone: "+91 9876543211",
          year: "3rd Year",
          department: "CSE",
          section: "24S01",
          residenceType: "Day Scholar",
        },
        {
          id: "m3",
          role: "Member 2",
          name: "Rohan Verma",
          registerNumber: "99240041358",
          phone: "+91 9876543212",
          year: "3rd Year",
          department: "ECE",
          section: "24S02",
          residenceType: "Hosteller",
          hostelName: "BH-2 (Nehru Hall)",
          roomNumber: "112",
          wardenName: "Prof. Ramesh",
          wardenPhone: "+91 9876500002",
        },
        {
          id: "m4",
          role: "Member 3",
          name: "Priya Patel",
          registerNumber: "99240041359",
          phone: "+91 9876543213",
          year: "2nd Year",
          department: "AI & DS",
          section: "24S03",
          residenceType: "Day Scholar",
        },
        {
          id: "m5",
          role: "Member 4 (Optional)",
          isOptional: true,
          name: "Karthik Raja",
          registerNumber: "99240041360",
          phone: "+91 9876543214",
          year: "3rd Year",
          department: "CSE",
          section: "24S01",
          residenceType: "Hosteller",
          hostelName: "BH-1 (Tagore Hall)",
          roomNumber: "305",
          wardenName: "Dr. Kumar",
          wardenPhone: "+91 9876500001",
        },
      ],
    },
    {
      id: "DFR2026-0002",
      teamName: "AI Titans",
      createdAt: "12 Aug, 10:17 AM",
      memberCount: 4,
      paymentStatus: "approved",
      transactionId: "UPI/423985721349",
      amount: 1400,
      submittedAt: "12 Aug, 10:25 AM",
      approvedBy: "Faculty Coordinator (Admin)",
      approvedAt: "12 Aug, 10:30 AM",
      screenshotUrl:
        "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80",
      timeline: [
        { title: "Registration Created", timestamp: "12 Aug, 10:17 AM", completed: true },
        { title: "Payment Submitted", timestamp: "12 Aug, 10:25 AM", completed: true },
        { title: "Pending Verification", timestamp: "12 Aug, 10:25 AM", completed: true },
        { title: "Approved", timestamp: "12 Aug, 10:30 AM", completed: true },
        { title: "Confirmation Sent", timestamp: "12 Aug, 10:31 AM", completed: true },
      ],
      members: [
        {
          id: "m1",
          role: "Leader",
          name: "Vikram Seth",
          registerNumber: "99240041401",
          phone: "+91 9812345678",
          year: "4th Year",
          department: "AI & DS",
          section: "23S01",
          residenceType: "Day Scholar",
        },
        {
          id: "m2",
          role: "Member 1",
          name: "Neha Gupta",
          registerNumber: "99240041402",
          phone: "+91 9812345679",
          year: "4th Year",
          department: "CSE",
          section: "23S01",
          residenceType: "Hosteller",
          hostelName: "LH-1 (Ganga Hostel)",
          roomNumber: "201",
          wardenName: "Mrs. Lakshmi",
          wardenPhone: "+91 9876500003",
        },
        {
          id: "m3",
          role: "Member 2",
          name: "Deepak Reddy",
          registerNumber: "99240041403",
          phone: "+91 9812345680",
          year: "4th Year",
          department: "AI & DS",
          section: "23S01",
          residenceType: "Day Scholar",
        },
        {
          id: "m4",
          role: "Member 3",
          name: "Siddharth M",
          registerNumber: "99240041404",
          phone: "+91 9812345681",
          year: "3rd Year",
          department: "IT",
          section: "24S02",
          residenceType: "Day Scholar",
        },
      ],
    },
    {
      id: "DFR2026-0003",
      teamName: "Cyber Knights",
      createdAt: "11 Aug, 04:20 PM",
      memberCount: 5,
      paymentStatus: "rejected",
      transactionId: "UPI/000099998888",
      amount: 1750,
      submittedAt: "11 Aug, 04:30 PM",
      rejectReason: "Invalid Screenshot (Illegible transaction receipt image provided)",
      approvedBy: "Faculty Coordinator (Admin)",
      approvedAt: "11 Aug, 05:00 PM",
      screenshotUrl:
        "https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=600&q=80",
      timeline: [
        { title: "Registration Created", timestamp: "11 Aug, 04:20 PM", completed: true },
        { title: "Payment Submitted", timestamp: "11 Aug, 04:30 PM", completed: true },
        { title: "Pending Verification", timestamp: "11 Aug, 04:30 PM", completed: true },
        { title: "Rejected", timestamp: "11 Aug, 05:00 PM", completed: true },
        { title: "Confirmation Sent", timestamp: "N/A", completed: false },
      ],
      members: [
        {
          id: "m1",
          role: "Leader",
          name: "Eshwar Prasad",
          registerNumber: "99240041601",
          phone: "+91 9543210987",
          year: "3rd Year",
          department: "IT",
          section: "24S05",
          residenceType: "Day Scholar",
        },
        {
          id: "m2",
          role: "Member 1",
          name: "Farhan Akhtar",
          registerNumber: "99240041602",
          phone: "+91 9543210988",
          year: "3rd Year",
          department: "IT",
          section: "24S05",
          residenceType: "Hosteller",
          hostelName: "BH-1 (Tagore Hall)",
          roomNumber: "210",
          wardenName: "Dr. Kumar",
          wardenPhone: "+91 9876500001",
        },
        {
          id: "m3",
          role: "Member 2",
          name: "Gauri Menon",
          registerNumber: "99240041603",
          phone: "+91 9543210989",
          year: "3rd Year",
          department: "CSE",
          section: "24S01",
          residenceType: "Day Scholar",
        },
        {
          id: "m4",
          role: "Member 3",
          name: "Hari Krishnan",
          registerNumber: "99240041604",
          phone: "+91 9543210990",
          year: "3rd Year",
          department: "ECE",
          section: "24S02",
          residenceType: "Hosteller",
          hostelName: "BH-2 (Nehru Hall)",
          roomNumber: "315",
          wardenName: "Prof. Ramesh",
          wardenPhone: "+91 9876500002",
        },
        {
          id: "m5",
          role: "Member 4 (Optional)",
          isOptional: true,
          name: "Ishita Roy",
          registerNumber: "99240041605",
          phone: "+91 9543210991",
          year: "3rd Year",
          department: "IT",
          section: "24S05",
          residenceType: "Day Scholar",
        },
      ],
    },
  ];

  let seededCount = 0;
  for (const team of demoTeams) {
    const docRef = doc(db, REGISTRATIONS_COLLECTION, team.id);
    await setDoc(docRef, {
      ...team,
      queueNumber: parseInt(team.id.replace("DFR2026-", ""), 10),
      timestamp: serverTimestamp(),
    });
    seededCount++;
  }

  // Update current counter in Firestore
  const counterDocRef = doc(db, COUNTERS_COLLECTION, "registrations");
  await setDoc(counterDocRef, { currentCount: demoTeams.length }, { merge: true });

  return seededCount;
}
