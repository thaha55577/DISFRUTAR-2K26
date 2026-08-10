import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, HelpCircle, Sparkles, MessageSquare, MessageCircle, CheckCircle2, Calendar, Award, Users, Laptop, DollarSign, FileText, Gift } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface FaqItem {
  id: string;
  question: string;
  answer: React.ReactNode;
  icon: React.ReactNode;
}

export const FaqSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const sectionRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const accordionContainerRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Header Elements Sequence Reveal
      const headerTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });

      if (badgeRef.current) {
        headerTl.fromTo(
          badgeRef.current,
          { opacity: 0, y: 22, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out', clearProps: 'transform' }
        );
      }

      if (headingRef.current) {
        headerTl.fromTo(
          headingRef.current,
          { opacity: 0, y: 32 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', clearProps: 'transform' },
          '-=0.3'
        );
      }

      if (subtextRef.current) {
        headerTl.fromTo(
          subtextRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', clearProps: 'transform' },
          '-=0.4'
        );
      }

      // 2. Staggered FAQ Card Entrance
      if (accordionContainerRef.current) {
        const faqCards = accordionContainerRef.current.querySelectorAll('.faq-card-item');

        gsap.fromTo(
          faqCards,
          { opacity: 0, y: 35, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.55,
            stagger: 0.06,
            ease: 'power3.out',
            clearProps: 'transform',
            scrollTrigger: {
              trigger: accordionContainerRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // 3. CTA Banner Reveal
      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { opacity: 0, y: 35, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.65,
            ease: 'power3.out',
            clearProps: 'transform',
            scrollTrigger: {
              trigger: ctaRef.current,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, []);

  const faqItems: FaqItem[] = [
    {
      id: 'faq-1',
      question: 'Who is organizing DISFRUTAR 2K26 and who can participate?',
      icon: <Users className="w-4 h-4 text-[#536BFF]" />,
      answer: (
        <p className="text-white/80 leading-relaxed text-[14px] sm:text-[15px]">
          DISFRUTAR 2K26 is proudly organized by{' '}
          <span className="text-white font-semibold underline decoration-[#536BFF]/60 underline-offset-4">
            KARE ACM Student Chapter (Chapter ID: 170084)
          </span>
          , Department of Computer Science and Engineering, School of Computing at{' '}
          <span className="text-white font-semibold">
            Kalasalingam Academy of Research and Education (KARE)
          </span>
          . Students from all departments and academic years are eligible to participate.
        </p>
      ),
    },
    {
      id: 'faq-2',
      question: 'What is the registration fee and team size?',
      icon: <DollarSign className="w-4 h-4 text-[#536BFF]" />,
      answer: (
        <div className="space-y-2 text-[14px] sm:text-[15px]">
          <p className="text-white/80 leading-relaxed">
            The registration fee is{' '}
            <span className="text-[#8DA2FF] font-bold text-[16px] bg-[#536BFF]/12 px-2.5 py-0.5 rounded border border-[#536BFF]/30">
              ₹350/- per participant
            </span>
            .
          </p>
          <p className="text-white/80 leading-relaxed">
            Teams must consist of{' '}
            <span className="text-white font-semibold bg-white/10 px-2.5 py-0.5 rounded border border-white/12">
              3 or 4 members
            </span>
            .
          </p>
        </div>
      ),
    },
    {
      id: 'faq-3',
      question: 'What is the event schedule and venue?',
      icon: <Calendar className="w-4 h-4 text-[#536BFF]" />,
      answer: (
        <div className="space-y-3 text-[14px] sm:text-[15px]">
          <p className="text-white/80">DISFRUTAR 2K26 includes online bootcamps & an offline 32-hour hackathon:</p>
          <div className="grid gap-2.5 pt-0.5">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/4 border border-white/8">
              <span className="px-2.5 py-1 text-xs font-bold font-space text-[#8DA2FF] bg-[#536BFF]/15 rounded-md border border-[#536BFF]/30 shrink-0">
                15.08.2026 (Online)
              </span>
              <span className="text-white/90 font-medium">Day 1: Topic - Introduction to Agentic AI</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/4 border border-white/8">
              <span className="px-2.5 py-1 text-xs font-bold font-space text-[#8DA2FF] bg-[#536BFF]/15 rounded-md border border-[#536BFF]/30 shrink-0">
                28.08.2026 (Online)
              </span>
              <span className="text-white/90 font-medium">Day 2: Topic - Advanced Agentic</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#536BFF]/10 border border-[#536BFF]/35 shadow-[0_0_16px_rgba(83,107,255,0.15)]">
              <span className="px-2.5 py-1 text-xs font-bold font-space text-white bg-[#536BFF] rounded-md shadow-[0_0_10px_#536BFF] shrink-0">
                04.09.2026 & 05.09.2026
              </span>
              <span className="text-white font-semibold">32-Hour Offline Hackathon @ Venue: 9th Block Seminar Hall</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'faq-4',
      question: 'Will participants receive EE Credits?',
      icon: <Award className="w-4 h-4 text-[#536BFF]" />,
      answer: (
        <div className="space-y-2.5 text-[14px] sm:text-[15px]">
          <p className="text-white/90 font-medium">
            <span className="text-emerald-400 font-bold">Yes.</span> The event strictly offers:
          </p>
          <ul className="space-y-2 pt-0.5">
            <li className="flex items-center gap-2.5 text-white/85">
              <CheckCircle2 className="w-4 h-4 text-[#536BFF] shrink-0" />
              <span><strong className="text-white">2 EE Credits (Experimental Elective Credits)</strong></span>
            </li>
            <li className="flex items-center gap-2.5 text-white/85">
              <CheckCircle2 className="w-4 h-4 text-[#536BFF] shrink-0" />
              <span><strong className="text-white">Participation & Hackathon Certificates</strong></span>
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 'faq-5',
      question: 'What are the cash prizes and internship opportunities?',
      icon: <Gift className="w-4 h-4 text-[#536BFF]" />,
      answer: (
        <div className="space-y-2 text-[14px] sm:text-[15px]">
          <p className="text-white/90 font-medium">
            The 32-Hour Hackathon features a total cash prize pool of <span className="text-emerald-400 font-bold">₹15,000</span>:
          </p>
          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
              <span className="text-[11px] text-white/50 block font-mono">1ST PRIZE</span>
              <span className="text-white font-bold text-[15px]">₹7,000</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
              <span className="text-[11px] text-white/50 block font-mono">2ND PRIZE</span>
              <span className="text-white font-bold text-[15px]">₹5,000</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
              <span className="text-[11px] text-white/50 block font-mono">3RD PRIZE</span>
              <span className="text-white font-bold text-[15px]">₹3,000</span>
            </div>
          </div>
          <p className="text-white/80 pt-1 leading-relaxed">
            Additionally, <span className="text-[#8DA2FF] font-semibold">Internship Opportunities</span> will be offered to top performers.
          </p>
        </div>
      ),
    },
    {
      id: 'faq-6',
      question: 'What topics and courses are included in the Bootcamp?',
      icon: <FileText className="w-4 h-4 text-[#536BFF]" />,
      answer: (
        <p className="text-white/80 leading-relaxed text-[14px] sm:text-[15px]">
          The event offers a <span className="text-white font-semibold">Hands-On Generative AI Bootcamp with Industry Experts</span> featuring <span className="text-[#8DA2FF] font-semibold">Agentic AI Courses</span>. Day 1 covers <span className="text-white">Introduction to Agentic AI</span> and Day 2 covers <span className="text-white">Advanced Agentic</span> AI frameworks.
        </p>
      ),
    },
    {
      id: 'faq-7',
      question: 'Who are the Patrons and Convenors for the event?',
      icon: <Users className="w-4 h-4 text-[#536BFF]" />,
      answer: (
        <div className="space-y-2 text-[13px] sm:text-[14px] text-white/85">
          <p><strong className="text-white">Chief Patrons:</strong> Illayavallal Dr. K. Sridharan (Chancellor), Dr. S. Arivazhagi (Pro Chancellor)</p>
          <p><strong className="text-white">Patrons:</strong> Dr. S. Shasi Anand (Vice President Academic), Er. S. Arjun Kalasalingam (Vice President Administration)</p>
          <p><strong className="text-white">Co-Patrons:</strong> Dr. S. Narayanan (Vice Chancellor), Dr. V. Vasudevan (Registrar)</p>
          <p><strong className="text-white">Convenors:</strong> Dr. P. Deepalakshmi (Dean/SoC), Dr. R. Raja Subramanian (HoD/CSE)</p>
          <p><strong className="text-white">Faculty Sponsor:</strong> Dr. P. Chinnasamy (ACM/KARE, ASP/CSE)</p>
          <p><strong className="text-white">Faculty Coordinators:</strong> Mrs. N. Kirthiga, Mrs. S. Reshni, Mrs. B. Lavanya, Mrs. S. Shanmuga Priya, Mr. C. Sivamurugan (AP/CSE)</p>
          <p><strong className="text-white">Student Coordinators:</strong> S. Thaha, G. Umesh Chandra</p>
        </div>
      ),
    },
    {
      id: 'faq-8',
      question: 'What should teams bring to the hackathon venue?',
      icon: <Laptop className="w-4 h-4 text-[#536BFF]" />,
      answer: (
        <p className="text-white/80 leading-relaxed text-[14px] sm:text-[15px]">
          Teams of 3 or 4 members must bring their laptops and chargers to <span className="text-white font-semibold">Venue: 9th Block Seminar Hall</span> on September 4th & 5th, 2026. Valid KARE student ID cards are required for entry.
        </p>
      ),
    },
  ];

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section
      id="faq"
      ref={sectionRef}
      className="relative w-full bg-[#040612] text-white py-[90px] lg:py-[115px] px-5 sm:px-10 lg:px-[80px] font-space overflow-hidden border-b border-[#182544]/60 select-none contain-paint"
    >
      {/* Top Transition Light Halo receiving flow from Beat section */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] max-w-full h-[320px] pointer-events-none z-0 opacity-80 blur-[70px] sm:blur-[120px] transform-gpu"
        style={{
          background: 'radial-gradient(ellipse at top, rgba(83, 107, 255, 0.35) 0%, rgba(79, 126, 255, 0.12) 60%, transparent 85%)',
          willChange: 'transform',
        }}
      />

      {/* Luminous Background Orbs - Mobile Optimized 60FPS rendering */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 transform-gpu">
        <div
          className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[900px] max-w-[120vw] h-[500px] rounded-full blur-[60px] sm:blur-[140px] opacity-65 animate-mesh-3 max-md:animate-none transform-gpu"
          style={{
            background:
              'radial-gradient(circle, rgba(83, 107, 255, 0.25) 0%, rgba(66, 86, 246, 0.15) 50%, rgba(4, 6, 18, 0) 80%)',
            willChange: 'transform',
          }}
        />
        <div
          className="absolute bottom-[-10%] right-[-5%] w-[650px] max-w-[100vw] h-[650px] rounded-full blur-[60px] sm:blur-[150px] opacity-45 animate-mesh-2 max-md:animate-none transform-gpu"
          style={{
            background:
              'radial-gradient(circle, rgba(79, 126, 255, 0.20) 0%, rgba(56, 72, 224, 0.12) 55%, transparent 80%)',
            willChange: 'transform',
          }}
        />
        <div
          className="absolute top-[-5%] left-[-5%] w-[600px] max-w-[100vw] h-[600px] rounded-full blur-[60px] sm:blur-[140px] opacity-40 animate-mesh-1 max-md:animate-none transform-gpu"
          style={{
            background:
              'radial-gradient(circle, rgba(66, 86, 246, 0.18) 0%, rgba(83, 107, 255, 0.10) 50%, transparent 75%)',
            willChange: 'transform',
          }}
        />
        {/* Subtle Tech Grid Overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, #4F7EFF 1px, transparent 1px), linear-gradient(to bottom, #4F7EFF 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-[880px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-[44px] lg:mb-[58px]">
          {/* Badge */}
          <div
            ref={badgeRef}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#536BFF]/12 border border-[#536BFF]/35 backdrop-blur-md mb-4 shadow-[0_0_16px_rgba(83,107,255,0.25)]"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#536BFF]" />
            <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-white font-space">
              Got Questions?
            </span>
          </div>

          {/* Heading */}
          <h2
            ref={headingRef}
            className="text-[30px] sm:text-[38px] md:text-[46px] font-bold text-white tracking-tight leading-[1.12]"
          >
            Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#8DA2FF] to-[#536BFF]">Questions</span>
          </h2>
          <p
            ref={subtextRef}
            className="mt-3.5 text-[14px] sm:text-[16px] text-white/65 max-w-[620px] font-sans leading-relaxed"
          >
            Everything you need to know before registering for DISFRUTAR 2K26.
          </p>
        </div>

        {/* Accordion List - Optimized 60 FPS CSS Grid animation */}
        <div ref={accordionContainerRef} className="space-y-3 sm:space-y-3.5">
          {faqItems.map((faq, index) => {
            const isOpen = openId === faq.id;

            return (
              <div
                key={faq.id}
                className={`faq-card-item group relative rounded-[18px] transition-[background-color,border-color,box-shadow] duration-250 ease-out border overflow-hidden transform-gpu ${
                  isOpen
                    ? 'bg-[#07091C]/92 border-[#536BFF]/50 shadow-[0_8px_32px_rgba(83,107,255,0.18)]'
                    : 'bg-[#07091C]/55 border-white/10 hover:border-white/22 hover:bg-[#07091C]/78'
                }`}
              >
                {/* Subtle Top Inner Highlight Line when Open */}
                {isOpen && (
                  <div
                    className="absolute top-0 left-0 right-0 h-[1.5px] pointer-events-none z-10"
                    style={{
                      background:
                        'linear-gradient(90deg, transparent 0%, rgba(83,107,255,0.9) 50%, transparent 100%)',
                    }}
                  />
                )}

                {/* Accordion Header Trigger */}
                <button
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer focus:outline-none active:scale-[0.995] transition-transform duration-150"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3.5 sm:gap-4 pr-2">
                    {/* Number Badge */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-250 border ${
                        isOpen
                          ? 'bg-[#536BFF] text-white border-[#536BFF] shadow-[0_0_14px_rgba(83,107,255,0.55)]'
                          : 'bg-white/5 text-white/70 border-white/10 group-hover:bg-white/10 group-hover:text-white group-hover:border-white/20'
                      }`}
                    >
                      <span className="font-space font-bold text-xs">
                        0{index + 1}
                      </span>
                    </div>

                    {/* Question Text */}
                    <span className="text-[15px] sm:text-[17px] font-semibold text-white font-space tracking-tight leading-snug">
                      {faq.question}
                    </span>
                  </div>

                  {/* Expand/Collapse Chevron Indicator */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-[transform,background-color,border-color] duration-250 border transform-gpu ${
                      isOpen
                        ? 'bg-[#536BFF]/20 text-[#8DA2FF] border-[#536BFF]/40 rotate-180'
                        : 'bg-white/5 text-white/50 border-white/10 group-hover:text-white group-hover:border-white/20'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {/* Accordion Content Body - Native Hardware-Accelerated CSS Grid Transition */}
                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                  style={{ willChange: 'grid-template-rows, opacity' }}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 pb-5 pt-1 sm:px-6 sm:pb-6 border-t border-white/8 font-sans">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Still Have Questions CTA Banner */}
        <div
          ref={ctaRef}
          className="mt-12 p-6 sm:p-8 rounded-[24px] bg-gradient-to-r from-[#07091C] via-[#0B0F2A] to-[#07091C] border border-[#25D366]/30 shadow-[0_12px_40px_rgba(0,0,0,0.6)] flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden transform-gpu"
        >
          {/* Subtle Ambient Radial Light */}
          <div
            className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full blur-[60px] pointer-events-none transform-gpu"
            style={{ background: 'rgba(37,211,102,0.22)' }}
          />

          <div className="flex items-center gap-4 text-center sm:text-left z-10">
            <div className="w-12 h-12 rounded-2xl bg-[#25D366]/15 border border-[#25D366]/35 flex items-center justify-center text-[#25D366] shrink-0 shadow-[0_0_16px_rgba(37,211,102,0.3)]">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-space">
                Still have unanswered questions?
              </h3>
              <p className="text-xs sm:text-sm text-white/60 mt-0.5 font-sans">
                Our KARE ACM Student Chapter team is here to assist you anytime.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              window.open('https://chat.whatsapp.com/CT6etElQq8g1rNMuLMAVEq?s=cl&p=i&ilr=0', '_blank');
            }}
            className="group relative px-6 py-3 rounded-full text-white font-semibold text-xs sm:text-sm font-space tracking-wide flex items-center gap-2 cursor-pointer overflow-hidden border border-white/20 transition-transform duration-300 hover:scale-[1.03] active:scale-[0.97] shrink-0 z-10"
            style={{
              background:
                'linear-gradient(180deg, #25D366 0%, #128C7E 100%)',
              boxShadow:
                '0 0 12px rgba(37,211,102,0.45), 0 0 28px rgba(37,211,102,0.30)',
            }}
          >
            <MessageCircle className="w-4 h-4 text-white/90 group-hover:rotate-12 transition-transform" />
            <span>Join WhatsApp Group</span>
          </button>
        </div>
      </div>
    </section>
  );
};
