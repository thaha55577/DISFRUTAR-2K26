import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, ShieldAlert } from 'lucide-react';
import { ModalPortal } from '../ui/ModalPortal';

interface QuickRejectModalProps {
  teamName: string;
  onClose: () => void;
  onConfirmReject: (reason: string) => void;
}

const REJECT_REASONS = [
  'Duplicate Transaction ID',
  'Incorrect Payment Amount (Minimum fee required)',
  'Invalid Screenshot (Unclear receipt or wrong image)',
  'Payment Not Received in Bank Account',
  'Other Reason'
];

export const QuickRejectModal: React.FC<QuickRejectModalProps> = ({
  teamName,
  onClose,
  onConfirmReject
}) => {
  const [selectedReason, setSelectedReason] = useState(REJECT_REASONS[0]);
  const [customText, setCustomText] = useState('');

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalReason = selectedReason === 'Other Reason' 
      ? (customText.trim() || 'Payment details verification failed.')
      : selectedReason;
    onConfirmReject(finalReason);
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
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-lg max-h-[90vh] bg-[#07091C]/95 border border-red-500/40 rounded-[28px] p-5 sm:p-7 shadow-[0_32px_80px_rgba(239,68,68,0.25)] relative space-y-5 text-white backdrop-blur-2xl overflow-y-auto my-auto gpu-accelerate"
          >
            {/* Top Ambient Crimson Glow Line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-[1.5px] bg-gradient-to-r from-transparent via-red-500/80 to-transparent blur-[0.5px]" />
            
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 text-white/50 hover:text-white p-2 rounded-full bg-white/5 hover:bg-white/10 transition-all cursor-pointer z-10 min-w-[40px] min-h-[40px] flex items-center justify-center"
              title="Close Modal (Esc)"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Telemetry Header */}
            <div className="flex items-center gap-3.5 pr-8 border-b border-white/10 pb-4">
              <div className="w-11 h-11 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-400 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-red-400 uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 inline-block mb-1">
                  Admin Disqualification Protocol
                </span>
                <h3 className="text-lg sm:text-xl font-bold font-space text-white tracking-wide">
                  Reject Payment Verification
                </h3>
                <p className="text-xs font-mono text-white/60">
                  Target Team: <span className="text-white font-bold">{teamName}</span>
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-[10px] font-mono font-bold text-white/70 uppercase tracking-widest pl-1">
                  Select Rejection Reason *
                </label>
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {REJECT_REASONS.map((reason) => {
                    const isSelected = selectedReason === reason;
                    return (
                      <label
                        key={reason}
                        className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-red-500/15 border-red-500/60 text-white shadow-[0_0_16px_rgba(239,68,68,0.25)]'
                            : 'bg-white/[0.03] border-white/10 text-white/70 hover:border-white/20 hover:bg-white/[0.05]'
                        }`}
                      >
                        <input
                          type="radio"
                          name="rejectReason"
                          value={reason}
                          checked={isSelected}
                          onChange={() => setSelectedReason(reason)}
                          className="accent-red-500 w-4 h-4 cursor-pointer shrink-0"
                        />
                        <span className="text-xs font-sans font-medium leading-tight">{reason}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {selectedReason === 'Other Reason' && (
                <div className="space-y-1.5 animate-fade-in">
                  <label className="block text-[10px] font-mono font-bold text-white/70 uppercase tracking-widest pl-1">
                    Specify Custom Reason *
                  </label>
                  <textarea
                    required
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="Describe why this payment was rejected..."
                    rows={3}
                    className="w-full p-3.5 rounded-xl bg-white/[0.04] border border-white/15 focus:border-red-500 focus:ring-1 focus:ring-red-500/30 text-xs text-white placeholder-white/25 outline-none font-sans leading-relaxed"
                  />
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:flex-1 h-[46px] rounded-full border border-white/15 text-white/70 hover:text-white font-space text-xs font-bold hover:bg-white/5 cursor-pointer transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:flex-1 h-[46px] rounded-full bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-space text-xs font-bold flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(239,68,68,0.4)] cursor-pointer transition-all active:scale-[0.98]"
                >
                  <Send className="w-4 h-4" />
                  <span>Confirm Rejection</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </AnimatePresence>
    </ModalPortal>
  );
};
