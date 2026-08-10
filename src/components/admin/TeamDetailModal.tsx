import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, ArrowLeft, CheckCircle2, XCircle, AlertCircle, Clock, FileText, 
  Home, Phone, Building2, User, Download, Edit3, Trash2, ZoomIn, ShieldCheck, Calendar, ShieldAlert 
} from 'lucide-react';
import { TeamRecord } from '../../lib/adminStore';
import { openSingleTeamPDF } from '../../lib/exportUtils';
import { ModalPortal } from '../ui/ModalPortal';

interface TeamDetailModalProps {
  team: TeamRecord;
  onClose: () => void;
  onApprove: (teamId: string) => void;
  onReject: (teamId: string, reason: string) => void;
  onEdit: (team: TeamRecord) => void;
  onDelete: (teamId: string) => void;
}

export const TeamDetailModal: React.FC<TeamDetailModalProps> = ({
  team,
  onClose,
  onApprove,
  onReject,
  onEdit,
  onDelete,
}) => {
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [rejectReasonText, setRejectReasonText] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isZoomOpen) setIsZoomOpen(false);
        else if (showDeleteConfirm) setShowDeleteConfirm(false);
        else onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, isZoomOpen, showDeleteConfirm]);

  const isMemberComplete = (m: any) => {
    const basic = Boolean(m.name?.trim()) && Boolean(m.registerNumber?.trim()) && Boolean(m.phone?.trim()) && Boolean(m.year?.trim()) && Boolean(m.department?.trim()) && Boolean(m.section?.trim());
    const hostel = m.residenceType === 'Day Scholar' || 
      (Boolean(m.hostelName?.trim()) && Boolean(m.roomNumber?.trim()) && Boolean(m.wardenName?.trim()) && Boolean(m.wardenPhone?.trim()));
    return basic && hostel;
  };

  const handleDownloadPDF = () => {
    openSingleTeamPDF(team);
  };

  return (
    <ModalPortal>
      <AnimatePresence>
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl font-sans overflow-y-auto"
        >
        <motion.div 
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-5xl max-h-[92vh] bg-[#07091C]/95 border border-[#536BFF]/40 rounded-[28px] p-4 sm:p-8 shadow-[0_32px_80px_rgba(0,0,0,0.9)] relative space-y-6 overflow-y-auto my-auto text-white backdrop-blur-2xl gpu-accelerate"
        >
          {/* Top Ambient Glow Line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-[1.5px] bg-gradient-to-r from-transparent via-[#536BFF]/80 to-transparent blur-[0.5px]" />
          
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/50 hover:text-white p-2 rounded-full bg-white/5 hover:bg-white/10 transition-all cursor-pointer z-10 min-w-[40px] min-h-[40px] flex items-center justify-center"
            title="Close Modal (Esc)"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top bar header navigation */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-5 pr-8">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-full bg-white/5 border border-white/12 text-white/80 hover:text-white hover:bg-white/10 transition-all text-xs font-mono cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleDownloadPDF}
                className="flex-1 sm:flex-none px-4 py-2.5 min-h-[44px] rounded-full bg-white/5 border border-white/12 hover:bg-white/10 text-white text-xs font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#8DA2FF]" />
                <span>Download PDF</span>
              </button>
              <button
                type="button"
                onClick={() => onEdit(team)}
                className="flex-1 sm:flex-none px-4 py-2.5 min-h-[44px] rounded-full bg-[#536BFF]/20 border border-[#536BFF]/40 hover:bg-[#536BFF]/30 text-[#8DA2FF] text-xs font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Team</span>
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2.5 min-h-[44px] rounded-full bg-red-500/15 border border-red-500/30 hover:bg-red-500/25 text-red-400 text-xs font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>

          {/* Team Header Title Card */}
          <div className="bg-gradient-to-r from-[#0d1230] via-[#141b47] to-[#0d1230] p-5 rounded-[22px] border border-[#536BFF]/30 flex flex-wrap items-center justify-between gap-4 shadow-lg">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono text-[#8DA2FF] px-2.5 py-0.5 rounded-full bg-[#536BFF]/20 border border-[#536BFF]/30 font-bold">
                  ID: {team.id}
                </span>
                <span className="text-xs font-mono text-white/50">
                  Created: {team.createdAt}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-space text-white">{team.teamName}</h2>
              <p className="text-xs font-mono text-white/70">
                {team.memberCount} Team Members • Fee: <span className="text-emerald-400 font-bold">₹{team.amount}</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider border ${
                team.paymentStatus === 'approved' 
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40 shadow-[0_0_12px_rgba(52,211,153,0.3)]'
                  : team.paymentStatus === 'rejected'
                  ? 'bg-red-500/15 text-red-400 border-red-500/40 shadow-[0_0_12px_rgba(239,68,68,0.3)]'
                  : 'bg-amber-500/15 text-amber-400 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
              }`}>
                {team.paymentStatus === 'approved' && '✓ Payment Verified'}
                {team.paymentStatus === 'rejected' && '✗ Payment Rejected'}
                {team.paymentStatus === 'pending' && '⏳ Pending Verification'}
              </span>
            </div>
          </div>

          {/* Payment Verification Card */}
          <div className="bg-white/[0.02] border border-white/10 rounded-[22px] p-4 sm:p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
              <h3 className="text-xs sm:text-sm font-bold font-mono text-[#8DA2FF] uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                Payment & UPI Verification
              </h3>
              <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Registration Fee: ₹{team.amount}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 text-xs font-mono">
                <div>
                  <span className="text-white/40 block text-[10px] uppercase font-bold tracking-wider">Transaction ID / UPI Reference</span>
                  <strong className="text-white text-sm sm:text-base font-bold font-space bg-white/5 px-3.5 py-2 rounded-xl border border-white/10 inline-block mt-1 break-all select-all">
                    {team.transactionId}
                  </strong>
                </div>
                
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-white/40 block text-[10px] uppercase">Submission Timestamp</span>
                    <span className="text-white/80 font-bold">{team.submittedAt}</span>
                  </div>
                  {team.approvedBy && (
                    <div>
                      <span className="text-white/40 block text-[10px] uppercase">Verification Status</span>
                      <span className="text-emerald-400 font-bold">{team.approvedBy}</span>
                      <div className="text-[10px] text-white/50">{team.approvedAt}</div>
                    </div>
                  )}
                </div>

                {team.rejectReason && (
                  <div className="p-3.5 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs space-y-1">
                    <span className="font-bold block uppercase text-[10px] text-red-400">Rejection Reason:</span>
                    <div>{team.rejectReason}</div>
                  </div>
                )}

                {/* Action Approval/Rejection buttons */}
                <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center gap-3">
                  {team.paymentStatus !== 'approved' && (
                    <button
                      type="button"
                      onClick={() => onApprove(team.id)}
                      className="w-full sm:flex-1 h-[46px] rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-space text-xs font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer transition-all active:scale-[0.98]"
                    >
                      <CheckCircle2 className="w-4.5 h-4.5" />
                      <span>Approve Payment</span>
                    </button>
                  )}

                  {team.paymentStatus !== 'rejected' && (
                    <button
                      type="button"
                      onClick={() => setShowRejectInput(!showRejectInput)}
                      className="w-full sm:flex-1 h-[46px] rounded-full bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-space text-xs font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.3)] cursor-pointer transition-all active:scale-[0.98]"
                    >
                      <XCircle className="w-4.5 h-4.5" />
                      <span>Reject Payment</span>
                    </button>
                  )}
                </div>

                {showRejectInput && (
                  <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 space-y-3 animate-fade-in">
                    <label className="block text-[10px] font-mono font-bold text-red-300 uppercase tracking-widest">Specify Rejection Reason</label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={rejectReasonText}
                        onChange={(e) => setRejectReasonText(e.target.value)}
                        placeholder="e.g. Invalid Screenshot or Duplicate Txn ID"
                        className="flex-1 h-[42px] px-3.5 rounded-xl bg-black/40 border border-red-500/30 text-xs text-white outline-none focus:border-red-400"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          onReject(team.id, rejectReasonText || 'Payment details verification failed.');
                          setShowRejectInput(false);
                        }}
                        className="h-[42px] px-5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl cursor-pointer shrink-0"
                      >
                        Confirm Reject
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Screenshot Preview Box */}
              <div className="space-y-2 flex flex-col">
                <span className="text-white/50 text-[10px] font-mono uppercase block font-bold tracking-wider">Payment Receipt Screenshot</span>
                <div 
                  onClick={() => setIsZoomOpen(true)}
                  className="relative group rounded-2xl overflow-hidden border border-white/15 bg-black/50 flex-1 min-h-[180px] max-h-[240px] flex items-center justify-center cursor-pointer hover:border-[#536BFF] transition-all shadow-lg"
                >
                  {team.screenshotUrl ? (
                    <img 
                      src={team.screenshotUrl} 
                      alt="UPI Payment Screenshot" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                  ) : (
                    <div className="text-center p-4 text-white/40 text-xs font-mono">No image preview available</div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1.5 transition-opacity text-xs font-mono font-bold text-white backdrop-blur-xs">
                    <ZoomIn className="w-6 h-6 text-[#8DA2FF]" />
                    <span>Click to Expand Receipt</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Member Cards Detailed Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold font-space text-white flex items-center gap-2">
                <User className="w-5 h-5 text-[#8DA2FF]" />
                Team Members ({team.members.length})
              </h3>
              <span className="text-xs font-mono text-white/50">
                Verified Roster Data
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {team.members.map((m, idx) => {
                const complete = isMemberComplete(m);
                return (
                  <div key={m.id || idx} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 relative hover:border-white/20 transition-all">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#536BFF]/20 border border-[#536BFF]/30 text-[#8DA2FF] text-[10px] font-mono font-bold uppercase">
                          {m.role}
                        </span>
                        <h4 className="text-sm font-bold font-space text-white">{m.name || 'Unnamed Member'}</h4>
                      </div>

                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        complete ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      }`}>
                        {complete ? '✓ Completed' : '⚠ Missing Data'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 text-xs font-mono">
                      <div>
                        <span className="text-white/40 text-[10px] block uppercase">Reg Number</span>
                        <strong className="text-white break-all">{m.registerNumber || 'N/A'}</strong>
                      </div>
                      <div>
                        <span className="text-white/40 text-[10px] block uppercase">Mobile Phone</span>
                        <strong className="text-[#8DA2FF] break-all">{m.phone || 'N/A'}</strong>
                      </div>
                      <div>
                        <span className="text-white/40 text-[10px] block uppercase">Year & Dept</span>
                        <strong className="text-white">{m.year} • {m.department}</strong>
                      </div>
                      <div>
                        <span className="text-white/40 text-[10px] block uppercase">Section</span>
                        <strong className="text-emerald-400">{m.section || 'N/A'}</strong>
                      </div>
                    </div>

                    {m.residenceType === 'Hosteller' ? (
                      <div className="p-3 rounded-xl bg-[#536BFF]/10 border border-[#536BFF]/25 space-y-1.5 text-xs font-mono">
                        <div className="text-[10px] text-[#8DA2FF] font-bold uppercase flex items-center gap-1.5">
                          <Home className="w-3.5 h-3.5" />
                          <span>Hostel Stay Info ({m.hostelName || 'N/A'})</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[11px] text-white/80">
                          <div>Room No: <strong className="text-white">{m.roomNumber || 'N/A'}</strong></div>
                          <div>Warden: <strong className="text-white">{m.wardenName || 'N/A'}</strong></div>
                          <div className="col-span-2 text-white/60">Warden Phone: <span className="text-[#8DA2FF]">{m.wardenPhone || 'N/A'}</span></div>
                        </div>
                      </div>
                    ) : (
                      <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[11px] font-mono text-white/60">
                        Residence: <strong className="text-white">Day Scholar</strong>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delete Confirmation Modal Overlay */}
          <AnimatePresence>
            {showDeleteConfirm && (
              <ModalPortal>
                <div 
                  onClick={(e) => { if (e.target === e.currentTarget) setShowDeleteConfirm(false); }}
                  className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
                >
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="max-w-md w-full bg-[#07091C]/95 border border-red-500/50 rounded-[28px] p-6 text-center space-y-5 shadow-[0_32px_80px_rgba(239,68,68,0.35)] relative overflow-hidden backdrop-blur-2xl my-auto max-h-[90vh] overflow-y-auto"
                  >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-[1.5px] bg-gradient-to-r from-transparent via-red-500/80 to-transparent blur-[0.5px]" />
                    <div className="w-14 h-14 rounded-full bg-red-500/15 border-2 border-red-500/40 text-red-400 flex items-center justify-center mx-auto shadow-[0_0_24px_rgba(239,68,68,0.4)] shrink-0">
                      <ShieldAlert className="w-7 h-7" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-xl font-bold font-space text-white">Delete Team Registration?</h3>
                      <p className="text-xs font-mono text-white/70 leading-relaxed">
                        Are you sure you want to permanently purge team <strong className="text-white">{team.teamName}</strong> ({team.id}) from the database? This action is non-reversible.
                      </p>
                    </div>
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(false)}
                        className="flex-1 h-[46px] rounded-full border border-white/20 text-white font-space text-xs font-bold hover:bg-white/5 cursor-pointer transition-all flex items-center justify-center"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowDeleteConfirm(false);
                          onDelete(team.id);
                        }}
                        className="flex-1 h-[46px] rounded-full bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-space text-xs font-bold cursor-pointer shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all active:scale-[0.98] flex items-center justify-center"
                      >
                        Delete Registration
                      </button>
                    </div>
                  </motion.div>
                </div>
              </ModalPortal>
            )}
          </AnimatePresence>

          {/* Full Image Zoom Lightbox Modal */}
          <AnimatePresence>
            {isZoomOpen && (
              <ModalPortal>
                <div 
                  onClick={() => setIsZoomOpen(false)}
                  className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl cursor-zoom-out"
                >
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative max-w-4xl max-h-[90vh] flex flex-col items-center justify-center space-y-3 my-auto"
                  >
                    <button
                      type="button"
                      onClick={() => setIsZoomOpen(false)}
                      className="absolute -top-12 right-0 text-white bg-white/20 hover:bg-white/40 p-2 rounded-full cursor-pointer transition-all min-w-[40px] min-h-[40px] flex items-center justify-center z-10"
                    >
                      <X className="w-6 h-6" />
                    </button>
                    <img 
                      src={team.screenshotUrl} 
                      alt="Payment Receipt Zoom" 
                      className="max-w-full max-h-[80vh] rounded-2xl object-contain border border-white/20 shadow-[0_0_48px_rgba(83,107,255,0.3)]"
                    />
                    <div className="text-center font-mono text-xs text-white/80 bg-black/80 px-4 py-2 rounded-full border border-white/10">
                      Transaction ID: <span className="text-[#8DA2FF] font-bold">{team.transactionId}</span> • Fee Amount: <span className="text-emerald-400 font-bold">₹{team.amount}</span>
                    </div>
                  </motion.div>
                </div>
              </ModalPortal>
            )}
          </AnimatePresence>

        </motion.div>
      </div>
    </AnimatePresence>
  </ModalPortal>
);
};
