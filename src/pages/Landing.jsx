import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import Footer from './Footer';
import Navbar from '../components/Navbar';
import {
  FiArrowRight, FiMessageSquare, FiUsers, FiShield,
  FiStar, FiZap, FiLinkedin, FiGithub, FiDollarSign,
  FiCheckCircle, FiLock, FiTrendingUp, FiBookOpen,
} from 'react-icons/fi';

/* ── Fade-in on scroll ── */
const Reveal = ({ children, delay = 0, className = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
};

/* ── Ticker strip ── */
const domains = ['Cybersecurity', 'Full Stack', 'AI / ML', 'Cloud', 'DevOps', 'UI/UX', 'Blockchain', 'Data Science', 'Mobile Dev', 'Embedded Systems'];
const Ticker = () => (
  <div className="overflow-hidden border-y border-black py-3 bg-black">
    <motion.div className="flex gap-12 whitespace-nowrap"
      animate={{ x: ['0%', '-50%'] }}
      transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
    >
      {[...domains, ...domains].map((d, i) => (
        <span key={i} className="text-[11px] font-black uppercase tracking-[0.35em] text-white/40">
          {d} <span className="text-white/15 mx-2">◆</span>
        </span>
      ))}
    </motion.div>
  </div>
);

/* ── Step card ── */
const Step = ({ num, title, desc, delay }) => (
  <Reveal delay={delay}>
    <div className="border border-black/10 p-8 bg-white group hover:bg-black transition-all duration-300 cursor-default">
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black/30 group-hover:text-white/30 mb-4 transition-colors">{num}</p>
      <h3 className="text-xl font-serif font-bold text-black group-hover:text-white mb-3 transition-colors leading-tight">{title}</h3>
      <p className="text-sm text-black/50 group-hover:text-white/50 leading-relaxed transition-colors">{desc}</p>
    </div>
  </Reveal>
);

/* ── Feature row ── */
const Feature = ({ icon: Icon, title, desc, flip, delay }) => (
  <Reveal delay={delay}>
    <div className={`flex flex-col ${flip ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 md:gap-16 items-center border-b border-black/8 pb-16`}>
      <div className="flex-1">
        <div className="w-12 h-12 border-2 border-black flex items-center justify-center mb-5">
          <Icon size={20} />
        </div>
        <h3 className="text-2xl md:text-3xl font-serif font-bold text-black mb-4 leading-tight">{title}</h3>
        <p className="text-base text-black/55 leading-relaxed">{desc}</p>
      </div>
      <div className="flex-1 flex justify-center">
        <div className="w-full max-w-xs border border-black/10 p-6 bg-black/[0.02]">
          <Icon size={64} className="text-black/8 mx-auto" />
        </div>
      </div>
    </div>
  </Reveal>
);

/* ── Pricing card ── */
const PriceCard = ({ label, price, points, highlight, delay }) => (
  <Reveal delay={delay}>
    <div className={`border-2 p-8 flex flex-col h-full transition-all duration-200 ${
      highlight ? 'border-black bg-black text-white' : 'border-black/15 bg-white text-black hover:border-black'
    }`}>
      <p className={`text-[9px] font-black uppercase tracking-[0.4em] mb-4 ${highlight ? 'text-white/50' : 'text-black/40'}`}>{label}</p>
      <p className={`text-4xl font-serif font-bold mb-1 ${highlight ? 'text-white' : 'text-black'}`}>
        {price}
        {price !== 'Free' && <span className={`text-sm font-normal ml-1 ${highlight ? 'text-white/50' : 'text-black/40'}`}>/session</span>}
      </p>
      <div className="mt-6 space-y-3 flex-1">
        {points.map((p, i) => (
          <div key={i} className="flex items-start gap-3">
            <FiCheckCircle size={13} className={`mt-0.5 flex-shrink-0 ${highlight ? 'text-white/60' : 'text-black/50'}`} />
            <span className={`text-sm ${highlight ? 'text-white/70' : 'text-black/60'}`}>{p}</span>
          </div>
        ))}
      </div>
      {highlight && (
        <p className="mt-8 text-[9px] font-black uppercase tracking-[0.35em] text-white/40">Most popular</p>
      )}
    </div>
  </Reveal>
);

/* ── Stat ── */
const Stat = ({ value, label }) => (
  <div className="text-center">
    <p className="text-4xl md:text-5xl font-serif font-bold text-black">{value}</p>
    <p className="text-[10px] uppercase tracking-[0.35em] font-black text-black/35 mt-1">{label}</p>
  </div>
);

/* ══════════════════════════════════════ MAIN ══════════════════════════════════════ */
const Landing = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);

  return (
    <div className="min-h-screen bg-white text-black" style={{ fontFamily: "'Georgia', serif" }}>

      {/* ── NOISE TEXTURE overlay ── */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.025]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat', backgroundSize: '128px',
      }} />

      {/* ══ HERO ══ */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col border-b border-black/10 overflow-hidden">
        {/* Grid lines */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }} />

        {/* Nav strip */}
        <Navbar />

        {/* Hero content */}
        <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-24">
          <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left side - Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-black/10">
                <img
                  src="/Hero_Image.png"
                  alt="College students collaborating and learning together"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/10" />
              </div>
              
              {/* Floating badges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="absolute -top-4 -right-4 bg-black text-white px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.35em]"
              >
                Domain-based search + chat
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="absolute -bottom-4 -left-4 bg-white border-2 border-black text-black px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.35em]"
              >
                Make Matching
              </motion.div>
            </motion.div>

            {/* Right side - Text content */}
            <div className="text-center lg:text-left">
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 border border-black/15 text-[10px] font-black uppercase tracking-[0.4em] text-black/50 mb-10">
                  <FiLock size={10} /> College-Exclusive Platform
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="text-5xl sm:text-6xl md:text-7xl font-serif font-bold leading-[0.92] tracking-tight text-black"
              >
                Connect.<br />
                <span className="relative inline-block">
                  <span className="relative z-10">Grow.</span>
                  <span className="absolute bottom-2 left-0 w-full h-3 bg-black/8 -z-0" />
                </span>{' '}
                Earn.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-10 text-base md:text-lg text-black/50 max-w-xl lg:max-w-none leading-relaxed"
                style={{ fontFamily: 'sans-serif', fontWeight: 400 }}
              >
                Linkaura is the college-exclusive platform where juniors find their seniors in the same domain -- and seniors earn by sharing what they know.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-10 flex flex-col sm:flex-row lg:justify-start items-center gap-4"
              >
                <button onClick={() => navigate('/signup')}
                  className="group flex items-center gap-3 px-8 py-4 bg-black text-white text-[11px] font-black uppercase tracking-widest hover:bg-black/85 transition-all">
                  Get Started Free
                  <FiArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button onClick={() => navigate('/about')}
                  className="px-8 py-4 border-2 border-black/15 text-[11px] font-black uppercase tracking-widest text-black/60 hover:border-black hover:text-black transition-all">
                  Learn More
                </button>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                className="mt-6 text-[10px] font-black uppercase tracking-[0.35em] text-black/25"
                style={{ fontFamily: 'sans-serif' }}
              >
                Accessible only with your college email
              </motion.p>
            </div>
          </div>
        </div>

        {/* Scrolling domain ticker */}
        <div className="relative z-10">
          <Ticker />
        </div>
      </section>

      {/* ══ WHAT IS LINKAURA ══ */}
      <section className="border-b border-black/8 py-24 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black/30 mb-4" style={{ fontFamily: 'sans-serif' }}>The Platform</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-black leading-tight max-w-3xl mb-8">
              Your senior is already where you want to be.
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-base text-black/50 max-w-2xl leading-relaxed mb-16" style={{ fontFamily: 'sans-serif' }}>
              Linkaura bridges the gap between B.Tech freshers and senior students within the same college. Whether you're exploring cybersecurity, AI, cloud, or full stack — find a 2nd, 3rd, or 4th year who's already walked that path. Chat directly, access their LinkedIn and GitHub, and book a one-on-one consultation for guided mentorship.
            </p>
          </Reveal>

          {/* 3-column callout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/8">
            {[
              { icon: FiUsers, title: 'Same College, Same Domain', desc: 'Discover seniors from your own institution who are specialised in the exact domain you want to grow in.' },
              { icon: FiMessageSquare, title: 'Direct Chat', desc: 'Message any senior directly on the platform. No cold emails, no awkward DMs — just genuine peer-to-peer conversations.' },
              { icon: FiDollarSign, title: 'Earn via Consultation', desc: 'Seniors set a consultation fee (starting ₹99) for 1-on-1 calls. Get paid for the expertise you\'ve already built.' },
            ].map(({ icon: Icon, title, desc }, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="bg-white p-8 h-full group hover:bg-black transition-all duration-300">
                  <div className="w-10 h-10 border-2 border-black group-hover:border-white flex items-center justify-center mb-5 transition-colors">
                    <Icon size={16} className="group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-serif font-bold text-black group-hover:text-white mb-3 transition-colors">{title}</h3>
                  <p className="text-sm text-black/50 group-hover:text-white/50 leading-relaxed transition-colors" style={{ fontFamily: 'sans-serif' }}>{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section className="border-b border-black/8 py-24 px-6 md:px-12 bg-black/[0.018]">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black/30 mb-4" style={{ fontFamily: 'sans-serif' }}>How It Works</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-black mb-16 leading-tight">Simple. Focused. Effective.</h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-black/8">
            <Step num="01" title="Sign up with college email" desc="Access is gated to your institution's email. Your campus, your community." delay={0.0} />
            <Step num="02" title="Set your domain" desc="Pick your area — cybersecurity, AI, full stack, cloud, and 15+ more. Find seniors who match exactly." delay={0.1} />
            <Step num="03" title="Connect & chat" desc="Browse senior profiles with LinkedIn, GitHub and domain tags. Send a message, start a conversation." delay={0.2} />
            <Step num="04" title="Book a 1-on-1 call" desc="Book a consultation with seniors who've enabled it. Get real guidance, not generic advice." delay={0.3} />
          </div>
        </div>
      </section>

      {/* ══ FOR JUNIORS ══ */}
      <section className="border-b border-black/8 py-24 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black/30 mb-4" style={{ fontFamily: 'sans-serif' }}>For Juniors</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-black mb-4 leading-tight max-w-2xl">
              Stop Googling. Start Talking to Someone Who's Been There.
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-base text-black/50 max-w-xl leading-relaxed mb-14" style={{ fontFamily: 'sans-serif' }}>
              As a fresher or 2nd year, navigating which domain to pursue, which projects matter, and how to land an internship is overwhelming. Your seniors in the same college already cracked it — now they're one message away.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { icon: FiBookOpen, title: 'Domain Clarity', desc: 'Not sure whether to pick cybersecurity or DevOps? Chat with seniors already working in both.' },
              { icon: FiGithub, title: 'See Real Portfolios', desc: "Every senior's GitHub is right there. Learn from actual projects your college seniors built." },
              { icon: FiLinkedin, title: 'LinkedIn Access', desc: 'View their LinkedIn before you chat. Know who you\'re talking to.' },
              { icon: FiZap, title: 'Quick Consultations', desc: 'Book a 30-minute call for ₹99. Get specific answers to specific problems — no fluff.' },
            ].map(({ icon: Icon, title, desc }, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <div className="border border-black/10 p-6 flex gap-5 hover:border-black transition-all group">
                  <div className="w-9 h-9 border border-black/15 group-hover:border-black flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors">
                    <Icon size={14} />
                  </div>
                  <div>
                    <h4 className="text-base font-serif font-bold text-black mb-1">{title}</h4>
                    <p className="text-sm text-black/50 leading-relaxed" style={{ fontFamily: 'sans-serif' }}>{desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FOR SENIORS ══ */}
      <section className="border-b border-black/8 py-6 px-4 md:px-6 bg-white">
      <div className="rounded-3xl overflow-hidden bg-black text-white px-6 md:px-12 py-24">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-4" style={{ fontFamily: 'sans-serif' }}>For Seniors</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4 leading-tight max-w-2xl">
              Your Knowledge Has Value. Start Charging for It.
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-base text-white/50 max-w-xl leading-relaxed mb-14" style={{ fontFamily: 'sans-serif' }}>
              You've spent years figuring out your domain — from choosing the right resources to landing internships and building projects. Juniors need exactly what you know. Enable consultation on your profile, set your fee, and turn your expertise into income.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/8">
            {[
              { icon: FiDollarSign, title: 'Set Your Fee', desc: 'Choose your own consultation price. The platform suggests ₹99 as a starting point — you decide what your time is worth.' },
              { icon: FiTrendingUp, title: 'Build a Reputation', desc: 'Your profile shows your domain, GitHub, and LinkedIn. Be discovered by juniors who are genuinely interested in what you do.' },
              { icon: FiShield, title: 'Full Control', desc: 'Toggle consultation on or off anytime. Set available days and time slots. No spam, no unsolicited calls.' },
            ].map(({ icon: Icon, title, desc }, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="bg-black border border-white/8 p-8 group hover:bg-white hover:text-black transition-all duration-300">
                  <div className="w-10 h-10 border border-white/20 group-hover:border-black flex items-center justify-center mb-5 transition-colors">
                    <Icon size={16} className="text-white group-hover:text-black transition-colors" />
                  </div>
                  <h3 className="text-lg font-serif font-bold text-white group-hover:text-black mb-3 transition-colors">{title}</h3>
                  <p className="text-sm text-white/45 group-hover:text-black/55 leading-relaxed transition-colors" style={{ fontFamily: 'sans-serif' }}>{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
      </section>

      {/* ══ PRICING ══ */}
      <section className="border-b border-black/8 py-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black/30 mb-4" style={{ fontFamily: 'sans-serif' }}>Consultation Pricing</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-black mb-4 leading-tight">
              Expert guidance. Student-friendly prices.
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="text-base text-black/45 max-w-lg mb-16 leading-relaxed" style={{ fontFamily: 'sans-serif' }}>
              Seniors decide their own rates. Here's what typical 1-on-1 consultations look like on Linkaura.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/8">
            <PriceCard
              label="Quick Chat"
              price="₹99"
              delay={0.0}
              points={['30-minute call', 'Domain introduction', 'Resource recommendations', 'Q&A session']}
            />
            <PriceCard
              label="Deep Dive"
              price="₹199"
              highlight
              delay={0.1}
              points={['60-minute call', 'Roadmap planning', 'Project / portfolio review', 'Career path guidance', 'Follow-up via chat']}
            />
            <PriceCard
              label="Resume & Interview"
              price="₹299"
              delay={0.2}
              points={['90-minute session', 'Full resume review', 'Mock interview round', 'Internship tips', 'LinkedIn profile audit']}
            />
          </div>
          <Reveal delay={0.3}>
            <p className="text-center text-[10px] font-black uppercase tracking-[0.35em] text-black/25 mt-6" style={{ fontFamily: 'sans-serif' }}>
              Prices are set by seniors · Platform takes 0% cut during beta
            </p>
          </Reveal>
        </div>
      </section>

      {/* ══ WHY COLLEGE-EXCLUSIVE ══ */}
      <section className="border-b border-black/8 py-24 px-6 md:px-12 bg-black/[0.018]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-16 items-start">
          <div className="flex-1">
            <Reveal>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black/30 mb-4" style={{ fontFamily: 'sans-serif' }}>Why Gated Access</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-4xl font-serif font-bold text-black leading-tight mb-6">
                Only your college email gets you in. That's the point.
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-base text-black/50 leading-relaxed" style={{ fontFamily: 'sans-serif' }}>
                Random mentors on the internet don't know your curriculum, your professors, your campus culture, or the specific companies that recruit from your college. Your seniors do. By restricting access to institutional emails, Linkaura ensures every connection is relevant, verified, and within your actual academic ecosystem.
              </p>
            </Reveal>
          </div>
          <div className="flex-1 space-y-4">
            {[
              { icon: FiLock, text: 'Login with your official college email — no exceptions.' },
              { icon: FiShield, text: 'Every user is a verified student of your institution.' },
              { icon: FiUsers, text: 'No outsiders, no noise — just your campus community.' },
              { icon: FiStar, text: 'Relevant advice from seniors who sat in your exact seat.' },
            ].map(({ icon: Icon, text }, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <div className="flex items-start gap-4 border border-black/8 p-5 bg-white">
                  <div className="w-8 h-8 bg-black flex items-center justify-center flex-shrink-0">
                    <Icon size={13} className="text-white" />
                  </div>
                  <p className="text-sm text-black/60 leading-relaxed pt-1" style={{ fontFamily: 'sans-serif' }}>{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="py-32 px-6 text-center border-b border-black/8">
        <Reveal>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black/25 mb-6" style={{ fontFamily: 'sans-serif' }}>Ready?</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="text-5xl md:text-7xl font-serif font-bold text-black leading-tight mb-8">
            Your senior is<br />waiting for you.
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="text-base text-black/45 max-w-md mx-auto mb-12 leading-relaxed" style={{ fontFamily: 'sans-serif' }}>
            Join thousands of students already connecting, learning, and earning on Linkaura.
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => navigate('/signup')}
              className="group flex items-center gap-3 px-10 py-5 bg-black text-white text-[11px] font-black uppercase tracking-widest hover:bg-black/85 transition-all">
              Join with College Email
              <FiArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={() => navigate('/profiles')}
              className="px-10 py-5 border-2 border-black/15 text-[11px] font-black uppercase tracking-widest text-black/55 hover:border-black hover:text-black transition-all">
              Browse Seniors
            </button>
          </div>
        </Reveal>
      </section>

      {/* ══ FOOTER ══ */}
      <Footer />
    </div>
  );
};

export default Landing;