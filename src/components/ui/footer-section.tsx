'use client';
import React, { useState } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { 
  Instagram, 
  Linkedin, 
  Github, 
  Mail, 
  Globe, 
  MessageCircle, 
  ExternalLink,
  ChevronUp,
  Sparkles
} from 'lucide-react';

interface FooterLink {
	title: string;
	href: string;
	icon?: React.ComponentType<{ className?: string }>;
	isExternal?: boolean;
	badge?: string;
	onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

interface FooterSection {
	label: string;
	links: FooterLink[];
}

export function Footer() {
	const [whatsappNotice, setWhatsappNotice] = useState(false);

	const handleWhatsappClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
		e.preventDefault();
		setWhatsappNotice(true);
		setTimeout(() => {
			setWhatsappNotice(false);
		}, 4000);
	};

	const footerLinks: FooterSection[] = [
		{
			label: 'Event Navigation',
			links: [
				{ 
					title: 'Home', 
					href: '#', 
					onClick: (e) => {
						e.preventDefault();
						window.scrollTo({ top: 0, behavior: 'smooth' });
					}
				},
				{ 
					title: 'About Event', 
					href: '#about',
					onClick: (e) => {
						e.preventDefault();
						const elem = document.getElementById('about');
						if (elem) {
							const y = elem.getBoundingClientRect().top + window.pageYOffset - 85;
							window.scrollTo({ top: y, behavior: 'smooth' });
						}
					}
				},
				{ 
					title: 'Our Prizes', 
					href: '#prizes',
					onClick: (e) => {
						e.preventDefault();
						const elem = document.getElementById('prizes') || document.getElementById('prize');
						if (elem) {
							const y = elem.getBoundingClientRect().top + window.pageYOffset - 85;
							window.scrollTo({ top: y, behavior: 'smooth' });
						}
					}
				},
				{ 
					title: 'FAQ Support', 
					href: '#faq',
					onClick: (e) => {
						e.preventDefault();
						const elem = document.getElementById('faq');
						if (elem) {
							const y = elem.getBoundingClientRect().top + window.pageYOffset - 85;
							window.scrollTo({ top: y, behavior: 'smooth' });
						}
					}
				},
				{ 
					title: 'Contact Us', 
					href: '#contact',
					onClick: (e) => {
						e.preventDefault();
						const elem = document.getElementById('contact');
						if (elem) {
							const y = elem.getBoundingClientRect().top + window.pageYOffset - 85;
							window.scrollTo({ top: y, behavior: 'smooth' });
						}
					}
				},
			],
		},
		{
			label: 'Our Chapter',
			links: [
				{ title: 'ACM Official Site', href: 'https://kare.acm.org/', icon: Globe, isExternal: true },
				{ title: 'KARE Institution', href: 'https://www.kalasalingam.ac.in', icon: ExternalLink, isExternal: true },
			],
		},
		{
			label: 'Contact & Support',
			links: [
				{ title: 'kareacm@klu.ac.in', href: 'mailto:kareacm@klu.ac.in', icon: Mail, isExternal: true },
				{ 
					title: 'WhatsApp Group', 
					href: 'https://chat.whatsapp.com/CT6etElQq8g1rNMuLMAVEq?s=cl&p=i&ilr=0', 
					icon: MessageCircle, 
					isExternal: true,
					badge: 'JOIN'
				},
			],
		},
		{
			label: 'Social Presence',
			links: [
				{ title: 'LinkedIn Space', href: 'https://www.linkedin.com/company/acmkare/', icon: Linkedin, isExternal: true },
				{ title: 'GitHub Repo', href: 'https://github.com/KAREACM', icon: Github, isExternal: true },
				{ title: 'Instagram Feed', href: 'https://www.instagram.com/acm_kare', icon: Instagram, isExternal: true },
			],
		},
	];

	return (
		<footer id="contact" className="relative w-full border-t border-[#18233C]/60 bg-[#040612] px-6 py-12 lg:py-16 overflow-hidden select-none">
			{/* Radial Background matching the Register Button Theme (Glowing Indigo/Royal Blue) */}
			<div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
				<div 
					className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[150px] opacity-25 blur-[100px]"
					style={{
						background: 'radial-gradient(circle, rgba(83, 107, 255, 0.4) 0%, rgba(66, 86, 246, 0.2) 50%, transparent 85%)'
					}}
				/>
				{/* Top border glowing highlight bar */}
				<div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-[#536BFF]/80 to-transparent shadow-[0_0_12px_rgba(83,107,255,0.6)]" />
			</div>

			<div className="relative z-10 max-w-6xl mx-auto flex flex-col gap-12">
				
				{/* Main Grid: Logo Block + Columns */}
				<div className="grid w-full gap-10 xl:grid-cols-3 xl:gap-8">
					
					{/* Left Column: Logo & Mission Statement */}
					<AnimatedContainer className="space-y-6 flex flex-col items-center xl:items-start text-center xl:text-left">
						<div className="flex items-center gap-3 justify-center xl:justify-start group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
							<img 
								src="/acm_logo.png" 
								alt="KARE ACM Student Chapter Logo" 
								className="h-12 w-auto object-contain transition-transform duration-500 group-hover:scale-105" 
								referrerPolicy="no-referrer" 
							/>
							<div className="flex flex-col text-left">
								<span className="text-[15px] font-space font-bold tracking-[0.14em] text-white">
									DISFRUTAR <span className="text-[#8DA2FF]">2K26</span>
								</span>
								<span className="text-[9px] text-[#4F7EFF] font-space font-semibold tracking-[0.16em] mt-0.5">
									KARE ACM STUDENT CHAPTER
								</span>
							</div>
						</div>
						
						<p className="text-[#F4F7FF]/60 text-[14px] leading-relaxed max-w-sm font-sans">
							Empowering computing students with real-world exposure, interactive AI masterclasses, and professional collaborative network. Join us to build, hack, and redefine artificial intelligence.
						</p>

						{/* Direct WhatsApp Group Button */}
						<a 
							href="https://chat.whatsapp.com/CT6etElQq8g1rNMuLMAVEq?s=cl&p=i&ilr=0"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#25D366]/15 border border-[#25D366]/40 shadow-[0_0_16px_rgba(37,211,102,0.25)] text-[#25D366] text-xs font-semibold font-space hover:bg-[#25D366] hover:text-white transition-all duration-300 cursor-pointer"
						>
							<MessageCircle className="w-4 h-4" />
							<span>Join Official WhatsApp Group</span>
						</a>
					</AnimatedContainer>

					{/* Right Column: Links Grid */}
					<div className="grid grid-cols-2 gap-8 md:grid-cols-4 xl:col-span-2">
						{footerLinks.map((section, index) => (
							<AnimatedContainer key={section.label} delay={0.1 + index * 0.08} className="flex flex-col items-center md:items-start text-center md:text-left">
								<div>
									<h3 className="text-[11px] font-space font-bold uppercase tracking-[0.18em] text-white/50 mb-4">
										{section.label}
									</h3>
									<ul className="space-y-3">
										{section.links.map((link) => (
											<li key={link.title} className="flex items-center justify-center md:justify-start">
												<a
													href={link.href}
													onClick={link.onClick}
													target={link.isExternal ? "_blank" : undefined}
													rel={link.isExternal ? "noopener noreferrer" : undefined}
													className="group/link text-[13px] text-[#F4F7FF]/70 hover:text-white inline-flex items-center transition-colors duration-200"
												>
													{link.icon && <link.icon className="me-2 size-3.5 text-[#4F7EFF] group-hover/link:text-white transition-colors duration-200" />}
													<span className="font-sans font-medium">{link.title}</span>
													
													{link.badge && (
														<span className="ms-2 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white bg-[#536BFF] rounded-full shadow-[0_0_8px_rgba(83,107,255,0.5)]">
															{link.badge}
														</span>
													)}
												</a>
											</li>
										))}
									</ul>
								</div>
							</AnimatedContainer>
						))}
					</div>

				</div>

				{/* Divider line */}
				<div className="h-px w-full bg-white/5" />

				{/* Bottom section: Copyrights & Credits */}
				<div className="flex flex-col md:flex-row items-center justify-between gap-6 text-[#F4F7FF]/40 text-xs font-space">
					<p className="text-center md:text-left">
						© {new Date().getFullYear()} KARE ACM Student Chapter. All rights reserved.
					</p>
					
					<div className="flex items-center gap-6">
						<button 
							onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
							className="group inline-flex items-center gap-1.5 hover:text-white transition-colors duration-200 cursor-pointer text-[#F4F7FF]/50"
						>
							<span>Back to Top</span>
							<ChevronUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
						</button>
					</div>
				</div>

			</div>
		</footer>
	);
}

type ViewAnimationProps = {
	key?: string | number | null;
	delay?: number;
	className?: ComponentProps<typeof motion.div>['className'];
	children: ReactNode;
};

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return <div className={className}>{children}</div>;
	}

	return (
		<motion.div
			initial={{ filter: 'blur(4px)', translateY: 8, opacity: 0 }}
			whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
			viewport={{ once: true, margin: "-40px" }}
			transition={{ delay, duration: 0.6, ease: 'easeOut' }}
			className={className}
		>
			{children}
		</motion.div>
	);
}
