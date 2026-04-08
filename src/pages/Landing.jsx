import React, { useRef, useState, Suspense, useMemo, useEffect } from 'react';
import useSEO from '../hooks/useSEO';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Float, Stars, PointMaterial } from '@react-three/drei';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import { FaHandsHelping, FaGlobe, FaUserGraduate, FaGithub, FaLinkedin, FaArrowRight } from 'react-icons/fa';
import { FiArrowRight, FiZap, FiMessageSquare, FiSearch, FiStar } from 'react-icons/fi';

import Navbar from '../components/Navbar';
import Footer from './Footer';

const BG2 = '#050507';
const ACCENT = '#f59e0b';

/* ══════════════════════════════════════════
   3D COMPONENTS (Kept unchanged as requested)
══════════════════════════════════════════ */
const CoreGlobe = () => {
  const meshRef = useRef();
  useFrame((s) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = s.clock.getElapsedTime() * 0.1;
      meshRef.current.rotation.x = Math.sin(s.clock.getElapsedTime() * 0.07) * 0.12;
    }
  });
  return (
    <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.5}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.6, 64, 64]} />
        <MeshDistortMaterial color="#0a1628" distort={0.42} speed={2.4} roughness={0.1} metalness={0.75} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.35, 32, 32]} />
        <meshBasicMaterial color="#67e8f9" transparent opacity={0.06} side={THREE.BackSide} />
      </mesh>
    </Float>
  );
};

const RingSystem = () => {
  const r1 = useRef(), r2 = useRef(), r3 = useRef();
  useFrame((s) => {
    const t = s.clock.getElapsedTime();
    if (r1.current) { r1.current.rotation.x = t * 0.22; r1.current.rotation.y = t * 0.09; }
    if (r2.current) { r2.current.rotation.x = -t * 0.15; r2.current.rotation.z = t * 0.12; }
    if (r3.current) { r3.current.rotation.y = t * 0.28; r3.current.rotation.z = -t * 0.07; }
  });
  return (
    <>
      <mesh ref={r1} rotation={[Math.PI / 2.8, 0.4, 0]}>
        <torusGeometry args={[2.3, 0.016, 8, 180]} />
        <meshBasicMaterial color="#67e8f9" transparent opacity={0.55} />
      </mesh>
      <mesh ref={r2} rotation={[Math.PI / 3.8, 1.2, 0]}>
        <torusGeometry args={[2.85, 0.012, 8, 220]} />
        <meshBasicMaterial color={ACCENT} transparent opacity={0.4} />
      </mesh>
      <mesh ref={r3} rotation={[Math.PI / 1.8, 0.6, 0.9]}>
        <torusGeometry args={[3.4, 0.009, 8, 240]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.25} />
      </mesh>
    </>
  );
};

const NodeData = [
  { pos: [2.4, 0.8, 0.5], r: 0.13, color: '#f59e0b', speed: 1.2 },
  { pos: [-2.2, 1.0, 0.3], r: 0.10, color: '#67e8f9', speed: 0.9 },
  { pos: [1.8, -1.4, 0.6], r: 0.12, color: '#a78bfa', speed: 1.5 },
  { pos: [-1.6, -1.2, 0.8], r: 0.09, color: '#4ade80', speed: 1.1 },
  { pos: [0.4, 2.4, 0.2], r: 0.11, color: '#f59e0b', speed: 0.8 },
  { pos: [-0.6, -2.5, 0.4], r: 0.08, color: '#67e8f9', speed: 1.3 },
  { pos: [3.0, -0.2, 0.1], r: 0.09, color: '#a78bfa', speed: 1.0 },
  { pos: [-2.8, 0.2, 0.3], r: 0.10, color: '#4ade80', speed: 1.4 },
];

const FloatingNode = ({ pos, r, color, speed }) => {
  const ref = useRef();
  useFrame((s) => {
    if (ref.current) {
      const t = s.clock.getElapsedTime() * speed;
      ref.current.position.y = pos[1] + Math.sin(t) * 0.12;
      ref.current.position.x = pos[0] + Math.cos(t * 0.7) * 0.08;
    }
  });
  return (
    <Float speed={speed * 0.8} floatIntensity={0.4}>
      <mesh ref={ref} position={pos}>
        <sphereGeometry args={[r, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.8} roughness={0.1} metalness={0.6} />
      </mesh>
      <mesh position={pos}>
        <sphereGeometry args={[r * 2.3, 12, 12]} />
        <meshBasicMaterial color={color} transparent opacity={0.07} side={THREE.BackSide} />
      </mesh>
    </Float>
  );
};

const ConnectionLines = () => {
  const ref = useRef();
  const geometry = useMemo(() => {
    const pairs = [
      [NodeData[0].pos, NodeData[4].pos],
      [NodeData[1].pos, NodeData[3].pos],
      [NodeData[2].pos, NodeData[5].pos],
      [NodeData[6].pos, NodeData[0].pos],
      [NodeData[7].pos, NodeData[1].pos],
    ];
    const pts = [];
    pairs.forEach(([a, b]) => {
      pts.push(new THREE.Vector3(...a));
      pts.push(new THREE.Vector3(...b));
    });
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);
  useFrame((s) => {
    if (ref.current) ref.current.material.opacity = 0.12 + Math.sin(s.clock.getElapsedTime() * 0.8) * 0.06;
  });
  return (
    <lineSegments ref={ref} geometry={geometry}>
      <lineBasicMaterial color="#67e8f9" transparent opacity={0.15} />
    </lineSegments>
  );
};

const ParticleCloud = () => {
  const ref = useRef();
  const count = 380;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 4 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);
  useFrame((s) => {
    if (ref.current) {
      ref.current.rotation.y = s.clock.getElapsedTime() * 0.028;
      ref.current.rotation.x = s.clock.getElapsedTime() * 0.015;
    }
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <PointMaterial size={0.042} color="#ffffff" transparent opacity={0.28} sizeAttenuation depthWrite={false} />
    </points>
  );
};

const HeroScene = ({ isMobile }) => (
  <Canvas
    camera={{ position: [0, 0, isMobile ? 10.5 : 7.8], fov: 48 }}
    gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    style={{ background: 'transparent' }}
    onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
  >
    <Suspense fallback={null}>
      <Stars radius={90} depth={55} count={1600} factor={2.8} saturation={0} fade speed={0.5} />
      <ParticleCloud />
      <ConnectionLines />
      {NodeData.map((n, i) => <FloatingNode key={i} {...n} />)}
      <RingSystem />
      <CoreGlobe />
    </Suspense>
    <ambientLight intensity={0.4} />
    <pointLight position={[5, 4, 6]} intensity={42} color="#67e8f9" />
    <pointLight position={[-6, -4, 5]} intensity={28} color="#a78bfa" />
    <pointLight position={[0, 6, 3]} intensity={20} color={ACCENT} />
  </Canvas>
);

/* ══════════════════════════════════════════
   OTHER COMPONENTS (Unchanged)
══════════════════════════════════════════ */
const StatItem = ({ value, label }) => (
  <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
    <span className="text-4xl md:text-5xl font-black font-serif text-amber-500">{value}</span>
    <span className="text-[10px] uppercase tracking-[0.4em] font-bold mt-2 text-zinc-400">{label}</span>
  </div>
);

const FeatureCard = ({ icon, title, desc, accent, delay }) => {
  const ref = useRef();
  const inView = useInView(ref, { once: true, amount: 0.35 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.6 }}
      className="group p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl hover:border-white/20 transition-all duration-500 hover:-translate-y-2"
      whileHover={{ scale: 1.02 }}
    >
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-3xl transition-transform group-hover:scale-110" style={{ backgroundColor: `${accent}15`, color: accent }}>
        {icon}
      </div>
      <h4 className="text-xl font-semibold mb-3 text-white tracking-tight">{title}</h4>
      <p className="text-zinc-400 leading-relaxed">{desc}</p>
    </motion.div>
  );
};

const Step = ({ num, title, desc, last }) => {
  const ref = useRef();
  const inView = useInView(ref, { once: true, amount: 0.4 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: num * 0.1, duration: 0.6 }}
      className="flex gap-6"
    >
      <div className="flex flex-col items-center">
        <div className="w-11 h-11 rounded-full flex items-center justify-center text-lg font-black flex-shrink-0" style={{ backgroundColor: 'rgba(245,158,11,0.15)', border: '2px solid rgba(245,158,11,0.6)', color: '#f59e0b' }}>
          {num}
        </div>
        {!last && <div className="w-px flex-1 mt-3" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />}
      </div>
      <div className="pb-12">
        <h4 className="text-xl font-semibold mb-2 text-white">{title}</h4>
        <p className="text-zinc-400 leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
};

const IsometricStack = () => {
  const pillars = [
    { id: 1, title: 'Discover', icon: <FaGlobe />, tagline: 'Find Your People', details: 'Browse real profiles by tech stack and location.' },
    { id: 2, title: 'Connect', icon: <FaHandsHelping />, tagline: 'Reach Out Directly', details: 'Message anyone. Build real relationships.' },
    { id: 3, title: 'Grow', icon: <FaUserGraduate />, tagline: 'Learn Together', details: 'Follow educators and grow your skills.' },
  ];
  const [stack, setStack] = useState(pillars);
  const click = (id) => {
    const idx = stack.findIndex(i => i.id === id);
    if (idx === 0) return;
    const next = [...stack];
    const [sel] = next.splice(idx, 1);
    next.unshift(sel);
    setStack(next);
  };
  return (
    <div className="relative h-[420px] md:h-[580px] w-full flex items-center justify-center" style={{ perspective: '2000px' }}>
      <AnimatePresence mode="popLayout">
        {stack.map((item, i) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, x: -100, rotateX: 48, rotateZ: -42 }}
            animate={{
              opacity: 1,
              x: 0,
              y: i * 82 - 82,
              rotateX: 48,
              rotateZ: -42,
              scale: i === 0 ? 1 : 0.87,
              zIndex: stack.length - i,
            }}
            onClick={() => click(item.id)}
            transition={{ type: 'spring', stiffness: 75, damping: 22 }}
            className="absolute cursor-pointer w-64 md:w-[340px] h-64 md:h-[340px] rounded-[2.75rem] backdrop-blur-2xl flex flex-col items-center justify-center p-8 text-center border"
            style={{
              borderColor: i === 0 ? ACCENT : 'rgba(255,255,255,0.1)',
              backgroundColor: i === 0 ? 'rgba(245,158,11,0.1)' : 'rgba(255,255,255,0.035)',
              boxShadow: i === 0 ? '0 40px 80px rgba(245,158,11,0.15)' : '0 25px 60px rgba(0,0,0,0.4)',
            }}
          >
            <div className="transform rotate-45 flex flex-col items-center gap-3">
              <div className="text-5xl md:text-6xl" style={{ color: i === 0 ? '#fff' : ACCENT }}>
                {item.icon}
              </div>
              <h3 className="text-2xl md:text-3xl font-serif tracking-wider text-white">{item.title}</h3>
              {i === 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-amber-400 font-mono text-xs uppercase tracking-widest">{item.tagline}</p>
                  <p className="text-sm max-w-[200px] text-zinc-300 hidden md:block">{item.details}</p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

const EducatorCard = ({ edu, idx }) => {
  const ref = useRef();
  const inView = useInView(ref, { once: true, amount: 0.25 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: idx * 0.08, duration: 0.5 }}
      className="group p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl text-center transition-all hover:border-amber-400/30 hover:-translate-y-1"
    >
      <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-5 group-hover:bg-amber-500 group-hover:text-black transition-all">
        <FaUserGraduate size={22} />
      </div>
      <h5 className="font-semibold text-white text-base mb-2">{edu.name}</h5>
      <p className="text-xs text-amber-400 font-mono mb-4">{edu.college}</p>
      <div className="flex justify-center gap-5 text-zinc-400">
        <a href={`https://github.com/${edu.github}`} target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors">
          <FaGithub size={18} />
        </a>
        <a href={`https://linkedin.com/${edu.linkedin}`} target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors">
          <FaLinkedin size={18} />
        </a>
      </div>
    </motion.div>
  );
};

/* ══════════════════════════════════════════
   MAIN LANDING COMPONENT
══════════════════════════════════════════ */
const Landing = () => {
  useSEO({
    title: 'Linkaura — Where Tech Builders Connect',
    description: "India's premium professional network for developers, designers, and creators.",
    keywords: 'linkaura, developer network, tech community, indian developers',
  });

  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const features = [
    { icon: <FiSearch />, title: 'College Email Verification', desc: 'Join with your official college email. Connect only with verified students from your campus.', accent: '#f59e0b', delay: 0 },
    { icon: <FiMessageSquare />, title: 'Domain-Specific Mentors', desc: 'Find seniors in your exact domain - Cybersecurity, AI, Web Dev, or any field you choose.', accent: '#67e8f9', delay: 0.1 },
    { icon: <FiZap />, title: 'Paid Consultations', desc: 'Seniors earn ₹99+ per 1-on-1 call. Juniors get expert guidance at affordable rates.', accent: '#a78bfa', delay: 0.2 },
    { icon: <FiStar />, title: 'Direct Chat & Socials', desc: 'Get LinkedIn, GitHub, and direct chat access to your mentors instantly.', accent: '#4ade80', delay: 0.3 },
  ];

  const steps = [
    { num: 1, title: 'Verify with College Email', desc: 'Sign up with your official college email to join your campus network.' },
    { num: 2, title: 'Find Your Domain Mentors', desc: 'Browse seniors in your specific field - Cybersecurity, AI, Web Development, and more.' },
    { num: 3, title: 'Connect & Chat Directly', desc: 'Get their LinkedIn, GitHub, and start chatting with mentors instantly.' },
    { num: 4, title: 'Book Paid Consultations', desc: 'Schedule 1-on-1 calls starting at ₹99. Seniors earn, juniors learn.' },
  ];

  const educators = [
    { name: 'Rahul Sharma', github: 'rahul-cs', linkedin: 'in/rahul-sharma-cs/', college: 'IIT Delhi' },
    { name: 'Priya Patel', github: 'priya-ai', linkedin: 'in/priya-patel-ai/', college: 'BIT Pilani' },
    { name: 'Amit Kumar', github: 'amit-cyber', linkedin: 'in/amit-kumar-security/', college: 'NIT Trichy' },
    { name: 'Sneha Reddy', github: 'sneha-web', linkedin: 'in/sneha-reddy-dev/', college: 'IIIT Hyderabad' },
    { name: 'Vikram Singh', github: 'vikram-ml', linkedin: 'in/vikram-singh-ml/', college: 'IIT Bombay' },
    { name: 'Neha Gupta', github: 'neha-app', linkedin: 'in/neha-gupta-mobile/', college: 'IIT Madras' },
  ];

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-black text-white selection:bg-amber-500 selection:text-black">
      <div className="fixed top-0 left-0 right-0 z-50"><Navbar /></div>

      {/* HERO SECTION - Only this part is updated */}
      <section className="relative min-h-[100dvh] lg:min-h-screen flex items-center justify-center overflow-hidden pt-20 lg:pt-0">
        {/* Beautiful Background Image matching the UI design */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0"
            alt="Futuristic tech network"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'brightness(0.85) contrast(1.1) saturate(1.05)' }}
          />
          {/* Overlays for better text visibility and mood */}
          <div className="absolute inset-0 bg-gradient-to-br from-black via-black/70 to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-10 max-w-2xl"
            >
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-mono tracking-[0.45em] text-amber-400">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400" />
                </span>
                COLLEGE MENTORSHIP PLATFORM
              </div>

              <h1 className="text-6xl md:text-7xl lg:text-[5.2rem] leading-none font-serif tracking-tighter">
                Where <span className="text-amber-500">juniors</span> meet<br />their mentors
              </h1>

              <p className="text-xl md:text-2xl text-zinc-400 max-w-lg mx-auto lg:mx-0">
                Connect with seniors in your domain. Get guidance, share knowledge,<br className="hidden lg:block" />
                and build your college network.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/profiles')}
                  className="flex items-center justify-center gap-3 bg-amber-500 hover:bg-amber-400 text-black font-bold px-10 py-5 rounded-2xl text-sm uppercase tracking-[0.08em] transition-all shadow-2xl shadow-amber-500/40"
                >
                  Find Mentors <FiArrowRight />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/login')}
                  className="flex items-center justify-center gap-3 border border-white/20 hover:border-amber-400/60 px-10 py-5 rounded-2xl font-semibold text-sm uppercase tracking-[0.08em] backdrop-blur-md transition-all"
                >
                  Join with College Email
                </motion.button>
              </div>

              <p className="text-xs text-zinc-500">Trusted by 50+ colleges across India</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* All sections below are 100% unchanged */}
      <div className="border-y border-white/10 bg-black/80 backdrop-blur-md py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center lg:justify-between gap-x-16 gap-y-10"
          >
            {[
              { value: '50+', label: 'Colleges' },
              { value: '500+', label: 'Senior Mentors' },
              { value: '2K+', label: 'Mentorship Sessions' },
              { value: '₹99', label: 'Starting Consultation' },
            ].map((s, i) => <StatItem key={i} {...s} />)}
          </motion.div>
        </div>
      </div>

      <section className="py-24 md:py-32 px-6 lg:px-12 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-amber-500 text-xs uppercase tracking-[0.5em] font-mono font-bold mb-3">MENTORSHIP FEATURES</p>
            <h2 className="text-5xl md:text-6xl font-serif tracking-tight text-white">
              Everything you need to<br />
              <span className="text-amber-500 italic">connect & grow</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => <FeatureCard key={i} {...f} />)}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 px-6 lg:px-12" style={{ backgroundColor: BG2 }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-20 items-start">
            <div className="lg:w-5/12">
              <p className="text-amber-500 text-xs uppercase tracking-[0.5em] font-mono font-bold mb-3">HOW IT WORKS</p>
              <h2 className="text-5xl md:text-6xl font-serif tracking-tight text-white mb-12">
                Connect with mentors<br />
                <span className="text-amber-500 italic">in 4 simple steps</span>
              </h2>
              <div className="space-y-2">
                {steps.map((s, i) => <Step key={i} {...s} last={i === steps.length - 1} />)}
              </div>
            </div>
            <div className="lg:w-7/12">
              <IsometricStack />
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-28 px-6 lg:px-12 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <p className="text-amber-500 text-xs uppercase tracking-[0.5em] font-mono font-bold mb-3">TOP SENIOR MENTORS</p>
              <h2 className="text-5xl md:text-6xl font-serif tracking-tight text-white">
                Meet our <span className="text-amber-500 italic">Senior Mentors</span>
              </h2>
            </div>
            <motion.a
              href="/mentors"
              className="flex items-center gap-3 text-amber-400 hover:text-amber-300 text-sm uppercase tracking-widest font-bold border border-amber-400/30 px-8 py-3.5 rounded-full hover:bg-amber-400/10 transition-all"
            >
              View All Mentors <FaArrowRight size={14} />
            </motion.a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {educators.map((edu, idx) => <EducatorCard key={idx} edu={edu} idx={idx} />)}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 lg:px-12" style={{ backgroundColor: BG2 }}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl p-12 md:p-20 text-center relative overflow-hidden border border-amber-400/20"
            style={{ backgroundColor: 'rgba(245,158,11,0.07)' }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.15)_0%,transparent_70%)]" />
            <div className="relative z-10">
              <p className="text-amber-400 text-xs uppercase tracking-[0.5em] font-mono font-bold mb-4">JOIN THE MENTORSHIP</p>
              <h2 className="text-5xl md:text-6xl font-serif tracking-tight mb-8 text-white">
                Ready to find your<br />
                <span className="text-amber-500 italic">college mentor?</span>
              </h2>
              <p className="text-zinc-400 text-xl max-w-lg mx-auto mb-12">
                Connect with seniors from your college. Get guidance in your domain. Start your mentorship journey today.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/login')}
                  className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-12 py-6 rounded-2xl text-sm uppercase tracking-widest shadow-xl shadow-amber-500/40 transition-all"
                >
                  Join with College Email
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/profiles')}
                  className="border border-white/30 hover:border-amber-400 px-12 py-6 rounded-2xl font-semibold text-sm uppercase tracking-widest transition-all"
                >
                  Find Mentors
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;