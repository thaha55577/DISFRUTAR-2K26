import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, History, Shield, CheckCircle2, XCircle, Edit3, Trash2 } from 'lucide-react';
import { AuditLog } from '../../lib/adminStore';
import { ModalPortal } from '../ui/ModalPortal';

interface AuditLogModalProps {
  logs: AuditLog[];
  onClose: () => void;
}

export const AuditLogModal: React.FC<AuditLogModalProps> = ({ logs, onClose }) => {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

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
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-2xl max-h-[85vh] bg-[#07091C]/95 border border-[#536BFF]/40 rounded-[28px] p-5 sm:p-8 shadow-[0_32px_80px_rgba(83,107,255,0.25)] relative space-y-6 overflow-y-auto my-auto text-white backdrop-blur-2xl gpu-accelerate"
        >
          {/* Top Ambient Cyan Glow Line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-[1.5px] bg-gradient-to-r from-transparent via-[#536BFF]/80 to-transparent blur-[0.5px]" />

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/50 hover:text-white p-2 rounded-full bg-white/5 hover:bg-white/10 transition-all cursor-pointer z-10 min-w-[40px] min-h-[40px] flex items-center justify-center"
            title="Close Log View (Esc)"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Telemetry Header */}
          <div className="flex items-center gap-3.5 border-b border-white/10 pb-4 pr-8">
            <div className="w-11 h-11 rounded-2xl bg-[#536BFF]/20 border border-[#536BFF]/40 text-[#8DA2FF] flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(83,107,255,0.3)]">
              <History className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-[#8DA2FF] uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#536BFF]/10 border border-[#536BFF]/20 inline-block mb-1">
                DISFRUTAR-OS Telemetry Trail
              </span>
              <h3 className="text-xl font-bold font-space text-white">Admin Audit Log</h3>
              <p className="text-xs font-mono text-white/50">Recorded Administrative Actions & Verification History</p>
            </div>
          </div>

          {/* Audit Log Entries List */}
          <div className="space-y-3">
            {logs.length === 0 ? (
              <div className="text-center py-12 p-6 rounded-2xl bg-white/[0.02] border border-dashed border-white/10 space-y-2">
                <Shield className="w-8 h-8 text-white/20 mx-auto" />
                <div className="text-xs font-mono text-white/40 uppercase tracking-wider">
                  No recorded administrative actions yet.
                </div>
              </div>
            ) : (
              logs.map((log) => {
                const isApprove = log.action.includes('Approve');
                const isReject = log.action.includes('Reject');
                const isDelete = log.action.includes('Delete');

                return (
                  <div 
                    key={log.id} 
                    className={`p-4 rounded-2xl border flex items-start gap-3.5 transition-all ${
                      isApprove ? 'bg-emerald-500/[0.04] border-emerald-500/20 hover:border-emerald-500/40' :
                      isReject ? 'bg-red-500/[0.04] border-red-500/20 hover:border-red-500/40' :
                      isDelete ? 'bg-rose-500/[0.04] border-rose-500/20 hover:border-rose-500/40' :
                      'bg-white/[0.03] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      isApprove ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      isReject ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      isDelete ? 'bg-rose-600/20 text-rose-400 border border-rose-600/30' :
                      'bg-[#536BFF]/20 text-[#8DA2FF] border border-[#536BFF]/30'
                    }`}>
                      {isApprove ? <CheckCircle2 className="w-4 h-4" /> :
                       isReject ? <XCircle className="w-4 h-4" /> :
                       isDelete ? <Trash2 className="w-4 h-4" /> :
                       <Edit3 className="w-4 h-4" />}
                    </div>

                    <div className="flex-1 space-y-1.5 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-bold font-mono text-white tracking-wide">
                          {log.action} • <span className="text-[#8DA2FF]">{log.teamName}</span>
                        </span>
                        <span className="text-[10px] font-mono text-white/40 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                          {log.timestamp}
                        </span>
                      </div>

                      <div className="text-xs font-mono text-white/70 leading-relaxed break-words">
                        {log.details || 'Action executed successfully.'}
                      </div>

                      <div className="text-[10px] font-mono text-[#8DA2FF] flex items-center gap-1.5 pt-0.5">
                        <span>Executor:</span>
                        <span className="font-bold text-white/90 bg-[#536BFF]/15 px-2 py-0.5 rounded-md border border-[#536BFF]/25">
                          {log.adminName}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  </ModalPortal>
);
};
