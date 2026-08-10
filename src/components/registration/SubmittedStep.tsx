import React from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  Download, 
  MessageCircle, 
  Users, 
  Crown, 
  UserCheck, 
  Info, 
  ArrowRight,
  Sparkles,
  Phone,
  Building2,
  GraduationCap
} from 'lucide-react';
import { TeamRegistrationState } from '../../types/registration';
import { downloadReceipt } from '../../utils/generateReceipt';

interface SubmittedStepProps {
  state: TeamRegistrationState;
  onNext: () => void;
}

const SubmittedStepComponent: React.FC<SubmittedStepProps> = ({
  state,
  onNext,
}) => {
  const activeMembers = (state?.members || []).filter(m => m && Boolean((m.name || '').trim()));

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 gpu-accelerate">
      
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="bg-[#07091C]/85 border border-[#536BFF]/40 rounded-[28px] p-6 sm:p-10 backdrop-blur-[24px] shadow-[0_32px_80px_rgba(83,107,255,0.2)] text-center space-y-6 relative overflow-hidden gpu-accelerate registration-card"
      >
        {/* Glow accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1.5px] bg-gradient-to-r from-transparent via-[#536BFF]/80 to-transparent blur-[0.5px]" />
        
        {/* Main Success Badge Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 220 }}
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto border-2 bg-emerald-500/15 border-emerald-500/40 text-emerald-400 shadow-[0_0_40px_rgba(52,211,153,0.3)] gpu-accelerate"
        >
          <CheckCircle2 className="w-10 h-10" />
        </motion.div>

        {/* Title & Status Badge */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Team Already Registered</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-space text-white tracking-wide">
            {state?.teamName || 'Registered Team'}
          </h2>
        </div>

        {/* Status Callout Card */}
        <div className="p-4 sm:p-6 rounded-[22px] bg-[#536BFF]/10 border border-[#536BFF]/30 text-left space-y-3 max-w-lg mx-auto shadow-[0_0_30px_rgba(83,107,255,0.15)]">
          <div className="flex items-center gap-2.5 font-mono font-bold uppercase text-[#8DA2FF] text-xs tracking-wider border-b border-[#536BFF]/20 pb-2.5">
            <Info className="w-4 h-4 text-[#8DA2FF] shrink-0" />
            <span>Registration Confirmed — We Will Notify You</span>
          </div>

          <p className="text-xs sm:text-sm text-white/85 leading-relaxed font-sans">
            Your team registration is fully logged in our system. We will notify you with further updates regarding event schedules, desk assignments, and event guidelines.
          </p>

          <div className="flex items-center gap-2 text-xs text-white/70 pt-1 font-sans">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Have queries? Join our official WhatsApp group for instant support and announcements.</span>
          </div>
        </div>

        {/* Registered Team Roster Details */}
        <div className="p-4 sm:p-6 rounded-[22px] bg-white/[0.02] border border-white/10 text-left space-y-4 max-w-lg mx-auto">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#8DA2FF]" />
              <span className="text-xs font-mono font-bold text-[#8DA2FF] uppercase tracking-wider">Registered Team Roster</span>
            </div>
            <span className="text-[11px] font-mono text-white/70 bg-white/5 px-3 py-0.5 rounded-full border border-white/10 font-semibold">
              {activeMembers.length} Members
            </span>
          </div>

          <div className="space-y-3">
            {activeMembers.map((m, idx) => {
              const isLeader = idx === 0 || m.role === 'Leader';
              return (
                <div key={m.id || idx} className="p-3.5 rounded-xl bg-white/[0.03] border border-white/8 space-y-2 hover:border-white/15 transition-all">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md font-mono text-[11px] font-bold ${
                        isLeader 
                          ? 'bg-[#536BFF]/20 text-[#8DA2FF] border border-[#536BFF]/40' 
                          : 'bg-white/10 text-white/80 border border-white/15'
                      }`}>
                        {isLeader ? <Crown className="w-3 h-3 text-[#8DA2FF]" /> : <UserCheck className="w-3 h-3 text-white/60" />}
                        <span>{m.role || (isLeader ? 'Leader' : `Member ${idx}`)}</span>
                      </span>
                      <span className="text-sm font-bold text-white font-space">{m.name || 'Member'}</span>
                    </div>

                    {/* Registration Number Highlighted */}
                    <span className="font-mono text-xs font-bold text-[#8DA2FF] bg-[#536BFF]/10 px-2.5 py-0.5 rounded-lg border border-[#536BFF]/20">
                      Reg No: {m.registerNumber || 'N/A'}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/60 font-mono pt-1 border-t border-white/5">
                    {m.department && (
                      <span className="flex items-center gap-1 text-white/70">
                        <Building2 className="w-3 h-3 text-white/40" />
                        {m.department} {m.section ? `(${m.section})` : ''}
                      </span>
                    )}

                    {m.year && (
                      <span className="flex items-center gap-1 text-white/70">
                        <GraduationCap className="w-3 h-3 text-white/40" />
                        {m.year} Year
                      </span>
                    )}

                    {m.phone && (
                      <span className="flex items-center gap-1 text-white/70">
                        <Phone className="w-3 h-3 text-white/40" />
                        {m.phone}
                      </span>
                    )}

                    {m.residenceType && (
                      <span className="text-[10px] text-white/50 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                        {m.residenceType}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => downloadReceipt(state)}
            className="w-full sm:w-auto h-[46px] px-6 rounded-full border border-white/14 bg-white/5 text-white font-space text-xs font-semibold flex items-center justify-center gap-2 hover:bg-white/10 hover:border-white/25 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#8DA2FF]" />
            <span>Download Receipt</span>
          </button>

          <button
            type="button"
            onClick={onNext}
            className="w-full sm:w-auto h-[48px] px-8 rounded-full bg-gradient-to-r from-[#536BFF] to-[#4256F6] text-white font-space font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-white/20 shadow-[0_0_24px_rgba(83,107,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Join Official WhatsApp Group</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </motion.div>

    </div>
  );
};

export const SubmittedStep = React.memo(SubmittedStepComponent);

