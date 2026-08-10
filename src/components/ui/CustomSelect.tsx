import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Check } from 'lucide-react';

interface CustomSelectProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
  icon: React.ElementType;
  label?: string;
  required?: boolean;
  isTouched?: boolean;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  id,
  value,
  onChange,
  options,
  placeholder,
  icon: Icon,
  label,
  required = false,
  isTouched = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside or press Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const isFilled = Boolean(value && value.trim());
  const showPending = required && isTouched && !isFilled;

  return (
    <div className={`space-y-1.5 relative transition-all ${isOpen ? 'z-[60]' : 'z-10'}`} ref={containerRef}>
      {label && (
        <div className="flex items-center justify-between pl-2 pr-1">
          <label htmlFor={id} className="block text-[11px] font-mono font-bold uppercase tracking-wider text-white/60">
            {label} {required ? '*' : ''}
          </label>
          {isFilled ? (
            <span className="text-[10px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
              ✓ Done
            </span>
          ) : showPending ? (
            <span className="text-[10px] font-mono text-amber-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Pending
            </span>
          ) : null}
        </div>
      )}

      {/* Trigger Button */}
      <div className="relative">
        <button
          id={id}
          type="button"
          onClick={() => setIsOpen(prev => !prev)}
          className={`registration-input w-full h-[44px] pl-11 pr-10 rounded-full bg-white/[0.04] border text-left flex items-center justify-between transition-all duration-200 cursor-pointer ${
            isOpen
              ? 'border-[#536BFF] ring-2 ring-[#536BFF]/30 bg-[#07091C]/95 shadow-[0_0_20px_rgba(83,107,255,0.25)]'
              : isFilled
              ? 'border-emerald-500/40 text-white bg-white/[0.05]'
              : showPending
              ? 'border-amber-500/60 text-white/40'
              : 'border-white/12 hover:border-white/20 text-white/40'
          }`}
        >
          <Icon className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors ${
            isOpen || value ? 'text-[#8DA2FF]' : 'text-white/30'
          }`} />

          <span className={`truncate text-sm font-sans ${value ? 'text-white font-medium' : 'text-white/30'}`}>
            {value ? value : placeholder}
          </span>

          <ChevronDown className={`w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 transition-all duration-200 ${
            isOpen ? 'rotate-180 text-[#8DA2FF]' : 'text-white/40'
          }`} />
        </button>

        {/* Floating Custom Glassmorphism Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.98 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-0 right-0 top-[calc(100%+6px)] z-[100] bg-[#0c1033] border border-[#536BFF]/70 rounded-[20px] p-1.5 shadow-[0_20px_60px_rgba(0,0,0,0.98)] backdrop-blur-2xl max-h-[220px] overflow-y-auto custom-scrollbar gpu-accelerate"
            >
              <div className="space-y-0.5">
                {options.map((opt) => {
                  const isSelected = value === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        onChange(opt);
                        setIsOpen(false);
                      }}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-left text-xs font-sans flex items-center justify-between transition-all duration-150 cursor-pointer ${
                        isSelected
                          ? 'bg-[#536BFF]/30 text-[#a5b6ff] font-semibold border border-[#536BFF]/50 shadow-[0_0_12px_rgba(83,107,255,0.25)]'
                          : 'text-white/90 hover:bg-white/[0.1] hover:text-white font-normal'
                      }`}
                    >
                      <span>{opt}</span>
                      {isSelected && <Check className="w-4 h-4 text-[#8DA2FF] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
