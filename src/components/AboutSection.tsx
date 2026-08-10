import React, { useEffect, useRef } from 'react';
import { Rocket, Users, Lightbulb, ShieldCheck, Code2, PhoneCall, Award } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const AboutSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const leftImageRef = useRef<HTMLDivElement>(null);
  const howItWorksLineRef = useRef<HTMLDivElement>(null);
  const stepNodesRef = useRef<HTMLDivElement>(null);
  const trustGalleryRef = useRef<HTMLDivElement>(null);
  const rocketCountRef = useRef<HTMLSpanElement>(null);
  const satCountRef = useRef<HTMLSpanElement>(null);
  const rocketIconRef = useRef<HTMLDivElement>(null);
  const usersIconRef = useRef<HTMLDivElement>(null);

  const descText =
    "DISFRUTAR 2K26 is a Bootcamp & 32-Hour Hackathon organized by KARE ACM Student Chapter (Chapter ID: 170084), Department of Computer Science and Engineering, School of Computing at Kalasalingam Academy of Research and Education. Featuring hands-on Generative AI & Agentic AI courses with industry experts, offering 2 EE credits, ₹15,000 cash prizes, and internship opportunities for top performers.";

  useEffect(() => {
    const isMobile = window.innerWidth <= 768;

    const ctx = gsap.context(() => {
      // 1. Header Reveal Timeline (GPU Accelerated)
      const headerTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: isMobile ? 'top 90%' : 'top 85%',
          fastScrollEnd: true,
          preventOverlaps: true,
          toggleActions: 'play none none none',
        },
      });

      // Label Line & Text
      headerTl
        .fromTo(
          labelRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out', force3D: true }
        )
        // Heading Word Slide Up
        .fromTo(
          headingRef.current?.querySelectorAll('.heading-word') || [],
          { y: '100%', opacity: 0 },
          {
            y: '0%',
            opacity: 1,
            duration: 0.5,
            stagger: isMobile ? 0.04 : 0.08,
            ease: 'power3.out',
            force3D: true,
          },
          '-=0.2'
        )
        // Description Word Stagger Reveal (Apple-style word mask)
        .fromTo(
          descRef.current?.querySelectorAll('.desc-word') || [],
          { y: '110%', opacity: 0 },
          {
            y: '0%',
            opacity: 1,
            duration: 0.4,
            stagger: isMobile ? 0.004 : 0.008,
            ease: 'power3.out',
            force3D: true,
          },
          '-=0.3'
        );

      // 2. Timeline Row Animation (Single Consolidated Pass)
      if (timelineRef.current) {
        const items = timelineRef.current.querySelectorAll('.timeline-item');
        const lines = timelineRef.current.querySelectorAll('.timeline-separator');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: timelineRef.current,
            start: isMobile ? 'top 90%' : 'top 85%',
            fastScrollEnd: true,
            preventOverlaps: true,
          },
        });

        tl.fromTo(
          items,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: isMobile ? 0.05 : 0.08,
            ease: 'power3.out',
            force3D: true,
          }
        ).fromTo(
          lines,
          { opacity: 0, scaleY: 0 },
          {
            opacity: 1,
            scaleY: 1,
            duration: 0.5,
            stagger: isMobile ? 0.04 : 0.06,
            ease: 'power2.out',
            force3D: true,
          },
          '-=0.3'
        );
      }

      // 3. Cards Entrance Animation
      if (cardsRef.current) {
        const cards = cardsRef.current.children;
        gsap.fromTo(
          cards,
          { opacity: 0, y: 24, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: isMobile ? 0.06 : 0.1,
            ease: 'power3.out',
            force3D: true,
            scrollTrigger: {
              trigger: cardsRef.current,
              start: isMobile ? 'top 88%' : 'top 82%',
              fastScrollEnd: true,
              preventOverlaps: true,
            },
          }
        );
      }

      // 4. Left Image Reveal (GPU Scale/Opacity acceleration)
      if (leftImageRef.current) {
        gsap.fromTo(
          leftImageRef.current,
          { opacity: 0, scale: 0.96 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: 'power3.out',
            force3D: true,
            scrollTrigger: {
              trigger: leftImageRef.current,
              start: isMobile ? 'top 88%' : 'top 80%',
              fastScrollEnd: true,
              preventOverlaps: true,
            },
          }
        );
      }

      // 5. How It Works Vertical Line & Steps Animation (Single Master Timeline)
      if (howItWorksLineRef.current && stepNodesRef.current) {
        const badges = stepNodesRef.current.querySelectorAll('.step-badge');
        const titles = stepNodesRef.current.querySelectorAll('.step-title');
        const descs = stepNodesRef.current.querySelectorAll('.step-desc');

        const stepsTl = gsap.timeline({
          scrollTrigger: {
            trigger: stepNodesRef.current,
            start: isMobile ? 'top 88%' : 'top 82%',
            fastScrollEnd: true,
            preventOverlaps: true,
          },
        });

        stepsTl
          .fromTo(
            howItWorksLineRef.current,
            { scaleY: 0 },
            { scaleY: 1, duration: 0.6, ease: 'power3.out', force3D: true }
          )
          .fromTo(
            badges,
            { scale: 0.6, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.4, stagger: isMobile ? 0.05 : 0.08, ease: 'back.out(1.5)', force3D: true },
            '-=0.4'
          )
          .fromTo(
            titles,
            { x: 12, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.4, stagger: isMobile ? 0.05 : 0.08, ease: 'power3.out', force3D: true },
            '-=0.3'
          )
          .fromTo(
            descs,
            { opacity: 0, y: 6 },
            { opacity: 1, y: 0, duration: 0.4, stagger: isMobile ? 0.05 : 0.08, ease: 'power3.out', force3D: true },
            '-=0.3'
          );
      }

      // 6. Right Card Gallery Reveal
      if (trustGalleryRef.current) {
        const thumbnails = trustGalleryRef.current.children;
        gsap.fromTo(
          thumbnails,
          { opacity: 0, scale: 0.95, y: 10 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.5,
            stagger: isMobile ? 0.04 : 0.06,
            ease: 'power3.out',
            force3D: true,
            scrollTrigger: {
              trigger: trustGalleryRef.current,
              start: isMobile ? 'top 90%' : 'top 85%',
              fastScrollEnd: true,
              preventOverlaps: true,
            },
          }
        );
      }

      // 7. Stats Count-Up & Icon Rotation (Throttled DOM layout reflows)
      const statsObj = { count1: 0, count2: 0 };
      let lastCount1 = -1;
      let lastCount2 = -1;

      gsap.to(statsObj, {
        count1: 50,
        count2: 100,
        duration: 1.4,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: cardsRef.current,
          start: isMobile ? 'top 85%' : 'top 75%',
          fastScrollEnd: true,
          preventOverlaps: true,
        },
        onUpdate: () => {
          const val1 = Math.floor(statsObj.count1);
          const val2 = Math.floor(statsObj.count2);
          if (val1 !== lastCount1 && rocketCountRef.current) {
            lastCount1 = val1;
            rocketCountRef.current.textContent = `${val1}+`;
          }
          if (val2 !== lastCount2 && satCountRef.current) {
            lastCount2 = val2;
            satCountRef.current.textContent = `${val2}%`;
          }
        },
      });

      if (rocketIconRef.current && usersIconRef.current) {
        gsap.fromTo(
          [rocketIconRef.current, usersIconRef.current],
          { rotate: -12, scale: 0.8 },
          {
            rotate: 0,
            scale: 1,
            duration: 0.6,
            ease: 'back.out(1.5)',
            stagger: 0.1,
            force3D: true,
            scrollTrigger: {
              trigger: cardsRef.current,
              start: isMobile ? 'top 85%' : 'top 75%',
              fastScrollEnd: true,
              preventOverlaps: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const timelineEvents = [
    {
      number: '15',
      month: 'AUGUST',
      title: 'Day 1: Bootcamp (Online)',
      description: 'Topic: Introduction to Agentic AI. Hands-on Generative AI with industry experts.',
    },
    {
      number: '28',
      month: 'AUGUST',
      title: 'Day 2: Bootcamp (Online)',
      description: 'Topic: Advanced Agentic. Deep-dive into AI agent frameworks and concepts.',
    },
    {
      number: '4 – 5',
      month: 'SEPTEMBER',
      title: '32-Hour Hackathon (Offline)',
      description: 'Venue: 9th Block Seminar Hall. Build solutions to win ₹15,000 cash prizes & internships.',
    },
    {
      number: '₹350',
      month: '',
      title: 'Registration & Perks',
      description: '₹350 per participant (Team: 3 or 4). Earn 2 EE credits & internship opportunities.',
    },
  ];

  const courseTopics = [
    {
      title: 'Day 1: Intro to Agentic AI',
      description: 'Foundations of intelligent agents, autonomous loops, and Generative AI workflows.',
    },
    {
      title: 'Day 2: Advanced Agentic',
      description: 'Multi-agent orchestration, tool usage, and complex AI solution design.',
    },
    {
      title: 'Industry Experts Bootcamp',
      description: 'Hands-on Generative AI training powered by experienced industry professionals.',
    },
    {
      title: '32-Hour Offline Hackathon',
      description: 'Held at 9th Block Seminar Hall with ₹15,000 cash prizes & internship offers.',
    },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full bg-[#040612] text-white py-[90px] lg:py-[115px] px-5 sm:px-10 lg:px-[80px] font-space overflow-hidden border-t border-b border-[#182544]/60 select-none"
    >
      {/* Dynamic Animated Ambient Mesh Background (GPU Composited Layer) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" style={{ transform: 'translateZ(0)' }}>
        {/* Luminous Top Central Glow Core */}
        <div 
          className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[550px] rounded-full blur-[70px] opacity-70 animate-mesh-3"
          style={{
            background: 'radial-gradient(circle, rgba(83, 107, 255, 0.28) 0%, rgba(66, 86, 246, 0.18) 45%, rgba(5, 8, 20, 0) 80%)',
            transform: 'translateZ(0)',
            willChange: 'transform',
          }}
        />

        {/* Floating Orb 1 - Vibrant Electric Blue (Left) */}
        <div 
          className="absolute top-[15%] left-[-10%] w-[650px] h-[650px] rounded-full blur-[80px] opacity-60 animate-mesh-1"
          style={{
            background: 'radial-gradient(circle, rgba(79, 126, 255, 0.25) 0%, rgba(66, 86, 246, 0.14) 50%, transparent 75%)',
            transform: 'translateZ(0)',
            willChange: 'transform',
          }}
        />

        {/* Floating Orb 2 - Deep Indigo Cyan Glow (Right) */}
        <div 
          className="absolute bottom-[10%] right-[-10%] w-[700px] h-[700px] rounded-full blur-[80px] opacity-55 animate-mesh-2"
          style={{
            background: 'radial-gradient(circle, rgba(96, 136, 255, 0.22) 0%, rgba(56, 72, 224, 0.16) 55%, transparent 80%)',
            transform: 'translateZ(0)',
            willChange: 'transform',
          }}
        />

        {/* Ambient Ethereal Light Beam Sweep */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[600px] rounded-[100%] blur-[90px] opacity-30 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(83,107,255,0.2) 0%, rgba(79,126,255,0.15) 50%, rgba(66,86,246,0.05) 100%)',
            transform: 'translateZ(0)',
          }}
        />

        {/* Subtle Diagonal Grid Overlay for Tech Texture */}
        <div 
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `linear-gradient(to right, #4F7EFF 1px, transparent 1px), linear-gradient(to bottom, #4F7EFF 1px, transparent 1px)`,
            backgroundSize: '48px 48px'
          }}
        />
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-[52px] lg:mb-[64px]">
          {/* Small Decorative Label */}
          <div
            ref={labelRef}
            className="flex items-center justify-center gap-3.5 mb-3"
          >
            <div className="w-[30px] sm:w-[60px] h-[1px] bg-[#4F7EFF]/40" />
            <span className="text-[11px] sm:text-[12px] font-semibold tracking-[0.4em] text-[#A6C0FF] uppercase">
              ABOUT DISFRUTAR 2K26
            </span>
            <div className="w-[30px] sm:w-[60px] h-[1px] bg-[#4F7EFF]/40" />
          </div>

          {/* Main Heading with Masked Slide-up Words */}
          <h2
            ref={headingRef}
            className="text-[40px] sm:text-[50px] lg:text-[56px] font-extrabold text-white tracking-tight leading-[1.08] mb-4 overflow-hidden flex gap-3 justify-center"
          >
            <span className="inline-block overflow-hidden py-1">
              <span className="heading-word inline-block">About</span>
            </span>
            <span className="inline-block overflow-hidden py-1">
              <span className="heading-word inline-block">Us</span>
            </span>
          </h2>

          {/* Subtitle Paragraph - Word-by-Word Reveal */}
          <p
            ref={descRef}
            className="text-[16px] sm:text-[18px] lg:text-[19px] font-normal text-[#C5D5F8] leading-[1.65] max-w-[700px] mx-auto flex flex-wrap justify-center gap-x-1.5 gap-y-0.5"
          >
            {descText.split(' ').map((word, index) => (
              <span
                key={index}
                className="inline-block overflow-hidden py-0.5"
              >
                <span className="desc-word inline-block">{word}</span>
              </span>
            ))}
          </p>
        </div>

        {/* Timeline Row (4 Equal Columns with 40px gap & separators) */}
        <div
          ref={timelineRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-[40px] mb-[56px] lg:mb-[64px] relative"
        >
          {timelineEvents.map((item, idx) => (
            <div
              key={idx}
              className="timeline-item relative flex flex-col justify-start pr-2 py-1"
            >
              {/* Big Number & Month */}
              <div className="flex items-baseline gap-2 mb-2 select-none">
                <span 
                  className="text-[38px] sm:text-[44px] lg:text-[48px] font-extrabold text-[#4F7EFF] leading-none tracking-tight"
                  style={{ textShadow: '0 0 14px rgba(79,126,255,0.45)' }}
                >
                  {item.number}
                </span>
                {item.month && (
                  <span className="text-[12px] lg:text-[13px] font-bold tracking-[0.18em] text-[#4F7EFF] uppercase">
                    {item.month}
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="text-[18px] lg:text-[20px] font-semibold text-white mb-1 tracking-tight">
                {item.title}
              </h3>

              {/* Subtitle Description */}
              <p className="text-[13px] lg:text-[14px] text-[#A2B6DE] font-normal leading-relaxed">
                {item.description}
              </p>

              {/* Vertical Separator between cards */}
              {idx < timelineEvents.length - 1 && (
                <div className="timeline-separator hidden lg:block absolute -right-[20px] top-1/2 -translate-y-1/2 w-[1px] h-[85px] bg-white/10 origin-center" />
              )}
            </div>
          ))}
        </div>

        {/* 3 Cards Section Grid (Compact 480px height, 28px padding) */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-[28px] items-stretch"
        >
          {/* LEFT CARD: Photo + Bottom Stats Panel */}
          <div className="about-card group relative bg-[#07091C]/65 border border-white/10 rounded-[24px] backdrop-blur-[16px] overflow-hidden shadow-[0_16px_60px_rgba(0,0,0,0.35)] flex flex-col justify-between transition-all duration-300 hover:-translate-y-[4px] hover:bg-[#07091C]/92 hover:border-[#536BFF]/50 hover:shadow-[0_12px_40px_rgba(83,107,255,0.22)] lg:h-[480px]">
            {/* Top Inner Highlight Line matching FAQ Active State */}
            <div
              className="absolute top-0 left-0 right-0 h-[1.5px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30"
              style={{
                background:
                  'linear-gradient(90deg, transparent 0%, rgba(83,107,255,0.95) 50%, transparent 100%)',
              }}
            />

            {/* Top Photo */}
            <div className="p-3 flex-1 flex flex-col overflow-hidden">
              <div
                ref={leftImageRef}
                className="relative w-full h-full min-h-[220px] rounded-[18px] overflow-hidden border border-white/10 shadow-sm"
              >
                <img
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80"
                  alt="DISFRUTAR Hackathon Auditorium"
                  decoding="async"
                  loading="eager"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07091C]/80 via-transparent to-transparent opacity-60 pointer-events-none" />
              </div>
            </div>

            {/* Bottom Stats Panel (110px Height) */}
            <div className="h-[110px] grid grid-cols-2 border-t border-white/10 bg-[#050716] shrink-0">
              {/* Stat 1 */}
              <div className="flex items-center justify-center gap-3 px-3 border-r border-white/10">
                <div
                  ref={rocketIconRef}
                  className="w-[44px] h-[44px] rounded-full bg-[#4F7EFF]/15 border border-[#4F7EFF]/40 flex items-center justify-center text-[#4F7EFF] shrink-0 shadow-[0_0_18px_rgba(79,126,255,0.35)] group-hover:bg-[#536BFF] group-hover:text-white group-hover:border-[#536BFF] group-hover:shadow-[0_0_18px_rgba(83,107,255,0.6)] transition-all duration-300"
                >
                  <Rocket className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="flex flex-col">
                  <span
                    ref={rocketCountRef}
                    className="text-[30px] lg:text-[34px] font-extrabold text-white leading-none tracking-tight"
                  >
                    50+
                  </span>
                  <span className="text-[12px] text-[#A2B6DE] font-medium mt-1">
                    Projects Built
                  </span>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="flex items-center justify-center gap-3 px-3">
                <div
                  ref={usersIconRef}
                  className="w-[44px] h-[44px] rounded-full bg-[#4F7EFF]/15 border border-[#4F7EFF]/40 flex items-center justify-center text-[#4F7EFF] shrink-0 shadow-[0_0_18px_rgba(79,126,255,0.35)] group-hover:bg-[#536BFF] group-hover:text-white group-hover:border-[#536BFF] group-hover:shadow-[0_0_18px_rgba(83,107,255,0.6)] transition-all duration-300"
                >
                  <Users className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="flex flex-col">
                  <span
                    ref={satCountRef}
                    className="text-[30px] lg:text-[34px] font-extrabold text-white leading-none tracking-tight"
                  >
                    100%
                  </span>
                  <span className="text-[11px] lg:text-[12px] text-[#A2B6DE] font-medium mt-1 leading-tight">
                    Participant Satisfaction
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* CENTER CARD: Course details */}
          <div className="about-card group relative bg-[#07091C]/65 border border-white/10 rounded-[24px] p-6 lg:p-[30px] backdrop-blur-[16px] shadow-[0_16px_60px_rgba(0,0,0,0.35)] flex flex-col justify-between transition-all duration-300 hover:-translate-y-[4px] hover:bg-[#07091C]/92 hover:border-[#536BFF]/50 hover:shadow-[0_12px_40px_rgba(83,107,255,0.22)] lg:h-[480px] overflow-hidden">
            {/* Top Inner Highlight Line matching FAQ Active State */}
            <div
              className="absolute top-0 left-0 right-0 h-[1.5px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30"
              style={{
                background:
                  'linear-gradient(90deg, transparent 0%, rgba(83,107,255,0.95) 50%, transparent 100%)',
              }}
            />

            {/* Card Header */}
            <div className="flex items-center gap-3.5 mb-4 relative z-10">
              <div className="w-[46px] h-[46px] rounded-full bg-[#4F7EFF]/15 border border-[#4F7EFF]/40 flex items-center justify-center text-[#4F7EFF] shrink-0 shadow-[0_0_18px_rgba(79,126,255,0.35)] group-hover:bg-[#536BFF] group-hover:text-white group-hover:border-[#536BFF] group-hover:shadow-[0_0_18px_rgba(83,107,255,0.6)] transition-all duration-300">
                <Code2 className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <h3 className="text-[20px] lg:text-[22px] font-bold text-white tracking-tight leading-tight">
                  Agentic AI & GenAI
                </h3>
                <p className="text-[11px] font-mono text-[#8DA2FF] font-semibold uppercase tracking-wider">
                  Bootcamp & Hackathon
                </p>
              </div>
            </div>

            {/* Course Description / Topics */}
            <div className="relative flex-1 flex flex-col justify-between my-1 z-10">
              <div className="flex flex-col justify-between h-full py-0.5 space-y-3">
                {courseTopics.map((topic, idx) => (
                  <div
                    key={idx}
                    className="relative flex items-start gap-3 z-10"
                  >
                    {/* Bullet indicator */}
                    <div className="w-[20px] h-[20px] rounded-full bg-[#4F7EFF]/20 text-[#8DA2FF] font-bold text-[10px] flex items-center justify-center shrink-0 border border-[#4F7EFF]/35 mt-0.5">
                      ✓
                    </div>

                    {/* Topic Content */}
                    <div className="flex flex-col">
                      <h4 className="text-[14px] lg:text-[15px] font-semibold text-white tracking-tight leading-none mb-1">
                        {topic.title}
                      </h4>
                      <p className="text-[11px] lg:text-[12px] text-[#A2B6DE] font-normal leading-relaxed">
                        {topic.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT CARD: Clarifications & Contacts */}
          <div className="about-card group relative bg-[#07091C]/65 border border-white/10 rounded-[24px] p-6 lg:p-[30px] backdrop-blur-[16px] shadow-[0_16px_60px_rgba(0,0,0,0.35)] flex flex-col justify-between transition-all duration-300 hover:-translate-y-[4px] hover:bg-[#07091C]/92 hover:border-[#536BFF]/50 hover:shadow-[0_12px_40px_rgba(83,107,255,0.22)] lg:h-[480px] overflow-hidden">
            {/* Top Inner Highlight Line matching FAQ Active State */}
            <div
              className="absolute top-0 left-0 right-0 h-[1.5px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30"
              style={{
                background:
                  'linear-gradient(90deg, transparent 0%, rgba(83,107,255,0.95) 50%, transparent 100%)',
              }}
            />

            <div className="relative z-10 space-y-4">
              {/* Header */}
              <div className="flex items-center gap-3.5 mb-3">
                <div className="w-[46px] h-[46px] rounded-full bg-[#4F7EFF]/15 border border-[#4F7EFF]/40 flex items-center justify-center text-[#4F7EFF] shrink-0 shadow-[0_0_18px_rgba(79,126,255,0.35)] group-hover:bg-[#536BFF] group-hover:text-white group-hover:border-[#536BFF] group-hover:shadow-[0_0_18px_rgba(83,107,255,0.6)] transition-all duration-300">
                  <PhoneCall className="w-5 h-5 stroke-[2]" />
                </div>
                <h3 className="text-[20px] lg:text-[22px] font-bold text-white tracking-tight">
                  Clarifications
                </h3>
              </div>

              {/* Fee & Credits strip */}
              <div className="grid grid-cols-2 gap-2 bg-[#536BFF]/10 p-3 rounded-xl border border-[#536BFF]/20 text-xs font-mono">
                <div>
                  <span className="text-white/40 text-[9px] uppercase block">Reg Fee</span>
                  <span className="text-white font-bold">₹350 / member</span>
                </div>
                <div>
                  <span className="text-white/40 text-[9px] uppercase block">Credits</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" /> 2 EE Credits
                  </span>
                </div>
              </div>
            </div>

            {/* Coordinator Directory */}
            <div className="space-y-2 mt-auto relative z-10">
              <span className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest block mb-1">
                Contact Directory
              </span>
              
              <div className="space-y-2">
                <a 
                  href="tel:+917893340788" 
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-[#536BFF]/40 hover:bg-[#536BFF]/5 transition-all text-xs font-mono"
                >
                  <div className="flex flex-col">
                    <span className="text-white font-semibold">S. Thaha</span>
                    <span className="text-white/40 text-[10px]">Student Coordinator</span>
                  </div>
                  <span className="text-[#8DA2FF] font-semibold">+91 7893340788</span>
                </a>

                <a 
                  href="tel:+919573861418" 
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-[#536BFF]/40 hover:bg-[#536BFF]/5 transition-all text-xs font-mono"
                >
                  <div className="flex flex-col">
                    <span className="text-white font-semibold">G. Umesh Chandra</span>
                    <span className="text-white/40 text-[10px]">Student Coordinator</span>
                  </div>
                  <span className="text-[#8DA2FF] font-semibold">+91 9573861418</span>
                </a>

                <div 
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-[#536BFF]/40 hover:bg-[#536BFF]/5 transition-all text-xs font-mono"
                >
                  <div className="flex flex-col">
                    <span className="text-white font-semibold">Dr. P. Chinnasamy</span>
                    <span className="text-white/40 text-[9px] truncate max-w-[140px]">Faculty Sponsor (ACM/KARE)</span>
                  </div>
                  <span className="text-[#8DA2FF] font-semibold">ASP / CSE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


