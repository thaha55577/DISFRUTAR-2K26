export type ResidenceType = 'Day Scholar' | 'Hosteller';

export interface MemberData {
  id: string;
  role: 'Leader' | 'Member 1' | 'Member 2' | 'Member 3' | 'Member 4 (Optional)' | 'Member 3 (Optional)';
  isOptional?: boolean;
  name: string;
  registerNumber: string;
  phone: string;
  year: string;
  department: string;
  section: string;
  residenceType: ResidenceType;
  hostelName?: string;
  roomNumber?: string;
  wardenName?: string;
  wardenPhone?: string;
}

export interface TeamRegistrationState {
  teamName: string;
  members: MemberData[];
  payment: {
    transactionId: string;
    screenshotFile: File | null;
    screenshotPreview: string | null;
    paymentAppUsed?: string;
    submittedAt?: string;
  };
  registrationId?: string;
  paymentStatus?: 'pending' | 'approved' | 'rejected';
  rejectReason?: string;
}

export type RegistrationStep = 
  | 'login'
  | 'team_details'
  | 'review'
  | 'checkout_payment'
  | 'submitted'
  | 'whatsapp';
