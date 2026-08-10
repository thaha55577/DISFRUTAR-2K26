import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, Edit3, User, Hash, Phone, Building2 } from 'lucide-react';
import { TeamRecord } from '../../lib/adminStore';
import { MemberData } from '../../types/registration';
import { ModalPortal } from '../ui/ModalPortal';

interface TeamEditModalProps {
  team: TeamRecord;
  onClose: () => void;
  onSave: (updatedTeam: TeamRecord) => void;
}

export const TeamEditModal: React.FC<TeamEditModalProps> = ({ team, onClose, onSave }) => {
  const [teamName, setTeamName] = useState(team.teamName);
  const [transactionId, setTransactionId] = useState(team.transactionId);
  const [amount, setAmount] = useState(team.amount);
  const [paymentStatus, setPaymentStatus] = useState(team.paymentStatus);
  const [members, setMembers] = useState<MemberData[]>(JSON.parse(JSON.stringify(team.members)));

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleMemberChange = (idx: number, field: keyof MemberData, val: any) => {
    const updated = [...members];
    updated[idx] = { ...updated[idx], [field]: val };
    setMembers(updated);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedTeam: TeamRecord = {
      ...team,
      teamName: teamName.trim() || team.teamName,
      transactionId: transactionId.trim() || team.transactionId,
      amount: Number(amount) || team.amount,
      paymentStatus: paymentStatus,
      memberCount: members.length,
      members: members
    };
    onSave(updatedTeam);
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
          className="w-full max-w-3xl max-h-[90vh] bg-[#07091C]/95 border border-[#536BFF]/40 rounded-[28px] p-5 sm:p-8 shadow-[0_32px_80px_rgba(83,107,255,0.25)] relative space-y-6 overflow-y-auto my-auto text-white backdrop-blur-2xl gpu-accelerate"
        >
          {/* Top Ambient Cyan Glow Line */}
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

          {/* Header */}
          <div className="flex items-center gap-3.5 border-b border-white/10 pb-4 pr-8">
            <div className="w-11 h-11 rounded-2xl bg-[#536BFF]/20 border border-[#536BFF]/40 text-[#8DA2FF] flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(83,107,255,0.3)]">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-[#8DA2FF] uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#536BFF]/10 border border-[#536BFF]/20 inline-block mb-1">
                DISFRUTAR Administrative Control
              </span>
              <h3 className="text-xl font-bold font-space text-white">Edit Team Registration</h3>
              <p className="text-xs font-mono text-white/50">Team ID: <span className="text-white font-bold">{team.id}</span></p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            {/* General Team Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white/[0.02] p-4 sm:p-5 rounded-2xl border border-white/10">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono font-bold text-white/60 uppercase tracking-wider pl-1">Team Name</label>
                <input
                  type="text"
                  required
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full h-[44px] px-3.5 rounded-xl bg-white/[0.05] border border-white/15 focus:border-[#536BFF] focus:ring-1 focus:ring-[#536BFF]/30 text-xs text-white outline-none font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono font-bold text-white/60 uppercase tracking-wider pl-1">Transaction ID</label>
                <input
                  type="text"
                  required
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full h-[44px] px-3.5 rounded-xl bg-white/[0.05] border border-white/15 focus:border-[#536BFF] focus:ring-1 focus:ring-[#536BFF]/30 text-xs text-white outline-none font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono font-bold text-white/60 uppercase tracking-wider pl-1">Payment Status</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value as any)}
                  className="w-full h-[44px] px-3 rounded-xl bg-[#07091C] border border-white/15 text-xs text-white outline-none focus:border-[#536BFF] cursor-pointer font-mono"
                >
                  <option value="pending">Pending ⏳</option>
                  <option value="approved">Approved ✓</option>
                  <option value="rejected">Rejected ✗</option>
                </select>
              </div>
            </div>

            {/* Members List */}
            <div className="space-y-4">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#8DA2FF] flex items-center justify-between border-b border-white/10 pb-2">
                <span>Team Members Roster ({members.length})</span>
                <span className="text-[10px] text-white/40 font-normal">Editable Data Fields</span>
              </h4>

              {members.map((m, idx) => (
                <div key={m.id || idx} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 hover:border-white/20 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#8DA2FF] uppercase px-2.5 py-0.5 rounded-full bg-[#536BFF]/15 border border-[#536BFF]/30">
                      {m.role}
                    </span>
                    <span className="text-[10px] font-mono text-white/50 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                      {m.residenceType}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono text-white/50 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={m.name}
                        onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                        className="w-full h-[40px] px-3 rounded-lg bg-white/[0.05] border border-white/10 text-xs text-white outline-none focus:border-[#536BFF]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-white/50 mb-1">Reg Number</label>
                      <input
                        type="text"
                        value={m.registerNumber}
                        onChange={(e) => handleMemberChange(idx, 'registerNumber', e.target.value)}
                        className="w-full h-[40px] px-3 rounded-lg bg-white/[0.05] border border-white/10 text-xs text-white outline-none focus:border-[#536BFF] uppercase"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-white/50 mb-1">Mobile Phone</label>
                      <input
                        type="text"
                        value={m.phone}
                        onChange={(e) => handleMemberChange(idx, 'phone', e.target.value)}
                        className="w-full h-[40px] px-3 rounded-lg bg-white/[0.05] border border-white/10 text-xs text-white outline-none focus:border-[#536BFF]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono text-white/50 mb-1">Academic Year</label>
                      <input
                        type="text"
                        value={m.year}
                        onChange={(e) => handleMemberChange(idx, 'year', e.target.value)}
                        className="w-full h-[40px] px-3 rounded-lg bg-white/[0.05] border border-white/10 text-xs text-white outline-none focus:border-[#536BFF]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-white/50 mb-1">Department</label>
                      <input
                        type="text"
                        value={m.department}
                        onChange={(e) => handleMemberChange(idx, 'department', e.target.value)}
                        className="w-full h-[40px] px-3 rounded-lg bg-white/[0.05] border border-white/10 text-xs text-white outline-none focus:border-[#536BFF]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-white/50 mb-1">Section</label>
                      <input
                        type="text"
                        value={m.section || ''}
                        onChange={(e) => handleMemberChange(idx, 'section', e.target.value)}
                        placeholder="24S01"
                        className="w-full h-[40px] px-3 rounded-lg bg-white/[0.05] border border-white/10 text-xs text-white uppercase outline-none focus:border-[#536BFF]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto h-[46px] px-6 rounded-full border border-white/20 text-white/70 hover:text-white font-space text-xs font-bold hover:bg-white/5 cursor-pointer transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto h-[46px] px-8 rounded-full bg-gradient-to-r from-[#536BFF] to-[#3B50DF] hover:from-[#4256F6] hover:to-[#3143c7] text-white font-space text-xs font-bold flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(83,107,255,0.4)] cursor-pointer transition-all active:scale-[0.98]"
              >
                <Save className="w-4 h-4" />
                <span>Save Registration Changes</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  </ModalPortal>
);
};

