import React from 'react';
import { 
  ChevronDown, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Building2, 
  Home, 
  Phone, 
  School,
  Hash
} from 'lucide-react';
import { MemberData, ResidenceType } from '../../types/registration';
import { CustomSelect } from '../ui/CustomSelect';

interface MemberCardProps {
  member: MemberData;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onChange: (updatedMember: MemberData) => void;
}

const DEPARTMENTS = [
  'CSE', 'IT', 'AI & DS', 'AI & ML', 'ECE', 'EEE', 'Mechanical', 'Civil', 'Biotechnology', 'BCA / MCA', 'Other'
];

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'PG / Other'];

interface FieldLabelProps {
  htmlFor?: string;
  label: string;
  required?: boolean;
  isFilled: boolean;
  isTouched?: boolean;
}

const FieldLabel: React.FC<FieldLabelProps> = ({ 
  htmlFor, 
  label, 
  required = false, 
  isFilled, 
  isTouched = false 
}) => {
  const showPending = required && isTouched && !isFilled;
  return (
    <div className="flex items-center justify-between pl-2 pr-1">
      <label htmlFor={htmlFor} className="block text-[11px] font-mono font-bold uppercase tracking-wider text-white/60">
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
  );
};

const MemberCardComponent: React.FC<MemberCardProps> = ({
  member,
  isExpanded,
  onToggleExpand,
  onChange,
}) => {
  const safeResidence = member.residenceType || 'Day Scholar';
  const cleanPhone = (member.phone || '').replace(/\D/g, '').slice(-10);
  const cleanWardenPhone = (member.wardenPhone || '').replace(/\D/g, '').slice(-10);

  // Check completion
  const isBasicFilled = 
    Boolean((member.name || '').trim()) &&
    Boolean((member.registerNumber || '').trim()) &&
    cleanPhone.length === 10 &&
    Boolean((member.year || '').trim()) &&
    Boolean((member.department || '').trim()) &&
    Boolean((member.section || '').trim());

  const isHostelFilled = 
    safeResidence === 'Day Scholar' ||
    (Boolean((member.hostelName || '').trim()) &&
     Boolean((member.roomNumber || '').trim()) &&
     Boolean((member.wardenName || '').trim()) &&
     cleanWardenPhone.length === 10);

  const isComplete = isBasicFilled && isHostelFilled;

  // Track if this member card has been interacted with or is required
  const isTouchedOrRequired = !member.isOptional || Boolean(
    (member.name || '').trim() || 
    (member.registerNumber || '').trim() || 
    cleanPhone
  );

  // Calculate specific missing fields for visual feedback
  const missingFields: string[] = [];
  if (isTouchedOrRequired) {
    if (!(member.name || '').trim()) missingFields.push('Full Name');
    if (!(member.registerNumber || '').trim()) missingFields.push('Register No');
    if (cleanPhone.length !== 10) missingFields.push('Mobile No');
    if (!(member.section || '').trim()) missingFields.push('Section');
    if (!(member.year || '').trim()) missingFields.push('Year');
    if (!(member.department || '').trim()) missingFields.push('Department');
    if (safeResidence === 'Hosteller') {
      if (!(member.hostelName || '').trim()) missingFields.push('Hostel Name');
      if (!(member.roomNumber || '').trim()) missingFields.push('Room No');
      if (!(member.wardenName || '').trim()) missingFields.push('Warden Name');
      if (cleanWardenPhone.length !== 10) missingFields.push('Warden Phone');
    }
  }

  const isEmptyOptional = Boolean(
    member.isOptional && 
    (member.name || '').trim() === '' && 
    (member.registerNumber || '').trim() === '' &&
    cleanPhone === ''
  );

  const handleInputChange = (field: keyof MemberData, value: any) => {
    onChange({
      ...member,
      [field]: value
    });
  };

  // Clean role display to prevent duplicate "(Optional)" strings in title
  const displayRole = member.role ? member.role.replace(/\s*\([^)]*\)/g, '').trim() : '';

  return (
    <div className={`member-card-container rounded-[18px] border transition-all duration-200 gpu-accelerate ${
      isExpanded 
        ? 'border-[#536BFF]/60 bg-[#07091C]/95 shadow-[0_8px_32px_rgba(83,107,255,0.15)] overflow-visible relative z-30' 
        : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05] relative z-10'
    }`}>
      
      {/* Header Bar */}
      <button
        type="button"
        onClick={onToggleExpand}
        className="w-full px-4 sm:px-5 py-3.5 sm:py-4 flex items-center justify-between text-left cursor-pointer transition-colors"
      >
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1 pr-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-space font-bold text-xs shrink-0 ${
            isComplete 
              ? 'bg-[#536BFF]/20 text-[#8DA2FF] border border-[#536BFF]/40' 
              : isEmptyOptional 
              ? 'bg-white/5 text-white/40 border border-white/10'
              : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
          }`}>
            <User className="w-4 h-4" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-space font-bold text-sm text-white truncate">
                {displayRole}
              </span>
              {member.isOptional && (
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/10 text-white/50 border border-white/10 shrink-0">
                  Optional
                </span>
              )}
            </div>

            <p className="text-xs text-white/50 font-sans mt-0.5 min-w-0">
              {member.name ? (
                <span className="text-white/80 font-medium block truncate max-w-[130px] min-[380px]:max-w-[170px] sm:max-w-[280px]">
                  {member.name} {member.registerNumber ? `(${member.registerNumber})` : ''}
                </span>
              ) : (
                <span className="italic block truncate">Click to enter member details</span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Status Badge */}
          {isComplete ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] sm:text-[11px] font-mono font-semibold shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Done</span>
            </span>
          ) : isEmptyOptional ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/40 text-[10px] sm:text-[11px] font-mono shrink-0">
              <span>Optional</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] sm:text-[11px] font-mono font-semibold shrink-0">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">{missingFields.length > 0 ? `Pending: ${missingFields[0]} Missing` : 'Pending'}</span>
              <span className="sm:hidden">Pending</span>
            </span>
          )}

          <div
            className={`transform transition-transform duration-200 text-white/40 shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
          >
            <ChevronDown className="w-5 h-5" />
          </div>
        </div>
      </button>

      {/* Accordion Content via Hardware-Accelerated CSS Grid Transition */}
      <div className={`registration-accordion-grid ${isExpanded ? 'is-expanded border-t border-white/10' : ''}`}>
        <div className="accordion-content-inner">
          <div className="p-5 sm:p-6 space-y-4">
            
            {/* Row 1: Name & Register Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 scroll-mt-28">
                <FieldLabel 
                  htmlFor={`member-${member.id}-name`}
                  label="Full Name"
                  required={!member.isOptional}
                  isFilled={Boolean((member.name || '').trim())}
                  isTouched={isTouchedOrRequired}
                />
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                  <input
                    id={`member-${member.id}-name`}
                    type="text"
                    value={member.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g. Sai Kumar"
                    className={`registration-input w-full h-[44px] pl-11 pr-4 rounded-full bg-white/[0.04] border ${
                      !member.name?.trim() && isTouchedOrRequired
                        ? 'border-amber-500/60 focus:border-amber-400'
                        : member.name?.trim()
                        ? 'border-emerald-500/40 focus:border-emerald-400'
                        : 'border-white/12 hover:border-white/20 focus:border-[#536BFF]'
                    } focus:ring-1 focus:ring-[#536BFF]/30 text-sm text-white placeholder-white/25 outline-none font-sans`}
                  />
                </div>
              </div>

              <div className="space-y-1.5 scroll-mt-28">
                <FieldLabel 
                  htmlFor={`member-${member.id}-registerNumber`}
                  label="Register Number"
                  required={!member.isOptional}
                  isFilled={Boolean((member.registerNumber || '').trim())}
                  isTouched={isTouchedOrRequired}
                />
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                  <input
                    id={`member-${member.id}-registerNumber`}
                    type="text"
                    value={member.registerNumber || ''}
                    onChange={(e) => handleInputChange('registerNumber', e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 99240041356"
                    className={`registration-input w-full h-[44px] pl-11 pr-4 rounded-full bg-white/[0.04] border ${
                      !member.registerNumber?.trim() && isTouchedOrRequired
                        ? 'border-amber-500/60 focus:border-amber-400'
                        : member.registerNumber?.trim()
                        ? 'border-emerald-500/40 focus:border-emerald-400'
                        : 'border-white/12 hover:border-white/20 focus:border-[#536BFF]'
                    } focus:ring-1 focus:ring-[#536BFF]/30 text-sm text-white placeholder-white/25 outline-none font-sans uppercase`}
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Mobile Number & Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 scroll-mt-28">
                <FieldLabel 
                  htmlFor={`member-${member.id}-phone`}
                  label="Mobile Number"
                  required={!member.isOptional}
                  isFilled={cleanPhone.length === 10}
                  isTouched={isTouchedOrRequired}
                />
                <div className="relative flex items-center">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none z-10" />
                  <div className="absolute left-9 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-[#8DA2FF] bg-[#536BFF]/20 border border-[#536BFF]/40 px-2 py-0.5 rounded pointer-events-none z-10">
                    +91
                  </div>
                  <input
                    id={`member-${member.id}-phone`}
                    type="tel"
                    maxLength={10}
                    value={cleanPhone}
                    onChange={(e) => handleInputChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="Enter 10-digit number"
                    className={`registration-input w-full h-[44px] pl-[84px] pr-4 rounded-full bg-white/[0.04] border ${
                      cleanPhone.length === 0 && isTouchedOrRequired
                        ? 'border-amber-500/60 focus:border-amber-400'
                        : cleanPhone.length > 0 && cleanPhone.length < 10 
                        ? 'border-amber-500/50 focus:border-amber-400' 
                        : cleanPhone.length === 10 
                        ? 'border-emerald-500/40 focus:border-emerald-400'
                        : 'border-white/12 hover:border-white/20 focus:border-[#536BFF]'
                    } focus:ring-1 focus:ring-[#536BFF]/30 text-sm text-white placeholder-white/25 outline-none font-mono tracking-wider`}
                  />
                </div>
                {cleanPhone.length === 0 && isTouchedOrRequired ? (
                  <p className="text-[10px] text-amber-400 font-sans pl-2 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>10-digit mobile number required</span>
                  </p>
                ) : cleanPhone.length > 0 && cleanPhone.length < 10 ? (
                  <p className="text-[10px] text-amber-400 font-sans pl-2 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>Mobile number must be 10 digits ({cleanPhone.length}/10)</span>
                  </p>
                ) : null}
              </div>

              <div className="space-y-1.5 scroll-mt-28">
                <FieldLabel 
                  htmlFor={`member-${member.id}-section`}
                  label="Section"
                  required={!member.isOptional}
                  isFilled={Boolean((member.section || '').trim())}
                  isTouched={isTouchedOrRequired}
                />
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                  <input
                    id={`member-${member.id}-section`}
                    type="text"
                    value={member.section || ''}
                    onChange={(e) => handleInputChange('section', e.target.value.toUpperCase())}
                    placeholder="e.g. 24S01"
                    className={`registration-input w-full h-[44px] pl-11 pr-4 rounded-full bg-white/[0.04] border ${
                      !member.section?.trim() && isTouchedOrRequired
                        ? 'border-amber-500/60 focus:border-amber-400'
                        : member.section?.trim()
                        ? 'border-emerald-500/40 focus:border-emerald-400'
                        : 'border-white/12 hover:border-white/20 focus:border-[#536BFF]'
                    } focus:ring-1 focus:ring-[#536BFF]/30 text-sm text-white placeholder-white/25 outline-none font-sans uppercase`}
                  />
                </div>
              </div>
            </div>

            {/* Row 3: Year & Department */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CustomSelect
                id={`member-${member.id}-year`}
                label="Academic Year"
                required={!member.isOptional}
                isTouched={isTouchedOrRequired}
                value={member.year || ''}
                onChange={(val) => handleInputChange('year', val)}
                options={YEARS}
                placeholder="Choose Academic Year"
                icon={School}
              />

              <CustomSelect
                id={`member-${member.id}-department`}
                label="Department"
                required={!member.isOptional}
                isTouched={isTouchedOrRequired}
                value={member.department || ''}
                onChange={(val) => handleInputChange('department', val)}
                options={DEPARTMENTS}
                placeholder="Choose Department"
                icon={Building2}
              />
            </div>

            {/* Row 4: Residence Type Selector */}
            <div className="space-y-2 pt-1 scroll-mt-28">
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-white/60 pl-2">
                Residence Type *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(['Day Scholar', 'Hosteller'] as ResidenceType[]).map((type) => {
                  const isSelected = member.residenceType === type;
                  const Icon = type === 'Day Scholar' ? Home : Building2;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleInputChange('residenceType', type)}
                      className={`h-[44px] px-4 rounded-full font-space text-xs font-semibold flex items-center justify-center gap-2.5 border transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? type === 'Hosteller'
                            ? 'bg-[#536BFF]/20 border-[#536BFF] text-white shadow-[0_0_16px_rgba(83,107,255,0.35)]'
                            : 'bg-emerald-500/20 border-emerald-500/50 text-white shadow-[0_0_16px_rgba(16,185,129,0.25)]'
                          : 'bg-white/[0.03] border-white/10 text-white/60 hover:bg-white/[0.06] hover:text-white'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                        isSelected 
                          ? type === 'Hosteller' ? 'text-[#8DA2FF]' : 'text-emerald-400'
                          : 'text-white/40'
                      }`} />
                      <span>{type}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Conditional Hostel Fields with GPU Composite CSS Grid Expansion */}
            <div className={`registration-accordion-grid ${member.residenceType === 'Hosteller' ? 'is-expanded pt-2' : ''}`}>
              <div className="accordion-content-inner">
                <div className={`p-4 rounded-[16px] space-y-3 transition-all ${
                  isHostelFilled
                    ? 'bg-[#536BFF]/10 border border-[#536BFF]/30'
                    : 'bg-amber-500/10 border border-amber-500/35 shadow-[0_0_16px_rgba(245,158,11,0.15)]'
                }`}>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#8DA2FF] uppercase tracking-wider">
                      <Building2 className="w-4 h-4 text-[#8DA2FF]" />
                      <span>Hostel Stay Information</span>
                    </div>
                    {!isHostelFilled && (
                      <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/40 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 text-amber-400" />
                        <span>Incomplete Hostel Details</span>
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1 scroll-mt-28">
                      <FieldLabel 
                        htmlFor={`member-${member.id}-hostelName`}
                        label="Hostel Name"
                        required={safeResidence === 'Hosteller'}
                        isFilled={Boolean((member.hostelName || '').trim())}
                        isTouched={safeResidence === 'Hosteller'}
                      />
                      <input
                        id={`member-${member.id}-hostelName`}
                        type="text"
                        value={member.hostelName || ''}
                        onChange={(e) => handleInputChange('hostelName', e.target.value)}
                        placeholder="e.g. Nelson Mandela Hostel"
                        className={`registration-input w-full h-[40px] px-4 rounded-full bg-white/[0.05] border ${
                          !member.hostelName?.trim() && safeResidence === 'Hosteller'
                            ? 'border-amber-500/60 focus:border-amber-400'
                            : member.hostelName?.trim()
                            ? 'border-emerald-500/40 focus:border-emerald-400'
                            : 'border-white/10 focus:border-[#536BFF]'
                        } text-xs text-white placeholder-white/20 outline-none`}
                      />
                    </div>

                    <div className="space-y-1 scroll-mt-28">
                      <FieldLabel 
                        htmlFor={`member-${member.id}-roomNumber`}
                        label="Room Number"
                        required={safeResidence === 'Hosteller'}
                        isFilled={Boolean((member.roomNumber || '').trim())}
                        isTouched={safeResidence === 'Hosteller'}
                      />
                      <input
                        id={`member-${member.id}-roomNumber`}
                        type="text"
                        value={member.roomNumber || ''}
                        onChange={(e) => handleInputChange('roomNumber', e.target.value)}
                        placeholder="e.g. 304"
                        className={`registration-input w-full h-[40px] px-4 rounded-full bg-white/[0.05] border ${
                          !member.roomNumber?.trim() && safeResidence === 'Hosteller'
                            ? 'border-amber-500/60 focus:border-amber-400'
                            : member.roomNumber?.trim()
                            ? 'border-emerald-500/40 focus:border-emerald-400'
                            : 'border-white/10 focus:border-[#536BFF]'
                        } text-xs text-white placeholder-white/20 outline-none`}
                      />
                    </div>

                    <div className="space-y-1 scroll-mt-28">
                      <FieldLabel 
                        htmlFor={`member-${member.id}-wardenName`}
                        label="Warden Name"
                        required={safeResidence === 'Hosteller'}
                        isFilled={Boolean((member.wardenName || '').trim())}
                        isTouched={safeResidence === 'Hosteller'}
                      />
                      <input
                        id={`member-${member.id}-wardenName`}
                        type="text"
                        value={member.wardenName || ''}
                        onChange={(e) => handleInputChange('wardenName', e.target.value)}
                        placeholder="e.g. Dr. Ramesh"
                        className={`registration-input w-full h-[40px] px-4 rounded-full bg-white/[0.05] border ${
                          !member.wardenName?.trim() && safeResidence === 'Hosteller'
                            ? 'border-amber-500/60 focus:border-amber-400'
                            : member.wardenName?.trim()
                            ? 'border-emerald-500/40 focus:border-emerald-400'
                            : 'border-white/10 focus:border-[#536BFF]'
                        } text-xs text-white placeholder-white/20 outline-none`}
                      />
                    </div>

                    <div className="space-y-1 scroll-mt-28">
                      <FieldLabel 
                        htmlFor={`member-${member.id}-wardenPhone`}
                        label="Warden Phone"
                        required={safeResidence === 'Hosteller'}
                        isFilled={cleanWardenPhone.length === 10}
                        isTouched={safeResidence === 'Hosteller'}
                      />
                      <div className="relative flex items-center">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30 pointer-events-none z-10" />
                        <div className="absolute left-8 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-[#8DA2FF] bg-[#536BFF]/20 border border-[#536BFF]/40 px-1.5 py-0.5 rounded pointer-events-none z-10">
                          +91
                        </div>
                        <input
                          id={`member-${member.id}-wardenPhone`}
                          type="tel"
                          maxLength={10}
                          value={cleanWardenPhone}
                          onChange={(e) => handleInputChange('wardenPhone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                          placeholder="Enter 10-digit number"
                          className={`registration-input w-full h-[40px] pl-[72px] pr-4 rounded-full bg-white/[0.05] border ${
                            cleanWardenPhone.length === 0 && safeResidence === 'Hosteller'
                              ? 'border-amber-500/60 focus:border-amber-400'
                              : cleanWardenPhone.length > 0 && cleanWardenPhone.length < 10 
                              ? 'border-amber-500/50 focus:border-amber-400' 
                              : cleanWardenPhone.length === 10 
                              ? 'border-emerald-500/40 focus:border-emerald-400'
                              : 'border-white/10 focus:border-[#536BFF]'
                          } text-xs text-white placeholder-white/20 outline-none font-mono tracking-wider`}
                        />
                      </div>
                      {cleanWardenPhone.length === 0 && safeResidence === 'Hosteller' ? (
                        <p className="text-[10px] text-amber-400 font-sans pl-2 flex items-center gap-1 font-medium">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          <span>10-digit warden phone required</span>
                        </p>
                      ) : cleanWardenPhone.length > 0 && cleanWardenPhone.length < 10 ? (
                        <p className="text-[10px] text-amber-400 font-sans pl-2 flex items-center gap-1 font-medium">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          <span>Warden phone must be 10 digits ({cleanWardenPhone.length}/10)</span>
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};

// Fast React memoization comparison for smooth 60 FPS typing
export const MemberCard = React.memo(MemberCardComponent, (prevProps, nextProps) => {
  if (prevProps.isExpanded !== nextProps.isExpanded) return false;
  if (prevProps.member === nextProps.member) return true;

  const p = prevProps.member;
  const n = nextProps.member;

  return (
    p.id === n.id &&
    p.role === n.role &&
    p.name === n.name &&
    p.registerNumber === n.registerNumber &&
    p.phone === n.phone &&
    p.year === n.year &&
    p.department === n.department &&
    p.section === n.section &&
    p.residenceType === n.residenceType &&
    p.hostelName === n.hostelName &&
    p.roomNumber === n.roomNumber &&
    p.wardenName === n.wardenName &&
    p.wardenPhone === n.wardenPhone &&
    p.isOptional === n.isOptional
  );
});
