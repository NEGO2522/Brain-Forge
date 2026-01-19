import React, { useRef, useState, Suspense, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import { FaLinkedinIn, FaDiscord } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import { RotatingFanIcon } from '../components/RotatingFanIcon';

// --- 1. 3D ROBOT MODEL ---
const RobotModel = ({ isMobile }) => {
  const groupRef = useRef();
  const headTop = useRef();
  const headBottom = useRef();
  const torso = useRef();
  const coreRef = useRef();
  
  const scale = isMobile ? 0.8 : 1.6; 
  const posY = isMobile ? -0.5 : -1.2;

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const openFactor = Math.abs(Math.sin(t * 0.8)); 

    if (groupRef.current) {
      groupRef.current.position.y = posY + Math.sin(t * 1) * 0.05;
      groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.1;
    }

    if (headTop.current) headTop.current.position.y = 1.4 + (openFactor * 0.4);
    if (headBottom.current) headBottom.current.position.y = 1.4 - (openFactor * 0.1);
    if (torso.current) torso.current.scale.set(1 + openFactor * 0.1, 1 + openFactor * 0.1, 1 + openFactor * 0.1);
    
    if (coreRef.current) {
        coreRef.current.rotation.y = t * 2;
        coreRef.current.material.emissiveIntensity = 2 + openFactor * 8;
    }
  });

  return (
    <group ref={groupRef} scale={[scale, scale, scale]}>
      <mesh ref={headTop}>
        <sphereGeometry args={[0.7, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.1} side={THREE.DoubleSide} />
        {[0.25, -0.25].map((x, i) => (
          <mesh key={i} position={[x, -0.1, 0.6]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={5} />
          </mesh>
        ))}
      </mesh>
      <mesh ref={headBottom}>
        <sphereGeometry args={[0.7, 32, 32, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.1} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={coreRef} position={[0, 1.3, 0]}>
        <octahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={2} />
      </mesh>
      <mesh ref={torso} position={[0, 0.4, 0]}>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.1} />
      </mesh>
      {[0.7, -0.7].map((x, i) => (
        <group key={i} position={[x, 0.6, 0]}>
          <mesh><sphereGeometry args={[0.15, 16, 16]} /><meshStandardMaterial color="#333" /></mesh>
          <mesh position={[0, -0.4, 0]}><capsuleGeometry args={[0.1, 0.5, 4, 8]} /><meshStandardMaterial color="#ffffff" metalness={0.8} /></mesh>
        </group>
      ))}
      {[0.3, -0.3].map((x, i) => (
        <mesh key={i} position={[x, -0.2, 0.1]}><cylinderGeometry args={[0.2, 0.25, 0.3, 16]} /><meshStandardMaterial color="#ffffff" metalness={0.8} /></mesh>
      ))}
    </group>
  );
};

const MovingStars = () => {
  const starsRef = useRef();
  const count = 1000;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    return pos;
  }, []);
  useFrame((state) => { if (starsRef.current) starsRef.current.rotation.y = state.clock.getElapsedTime() * 0.005; });
  return (
    <points ref={starsRef}>
      <bufferGeometry><bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} /></bufferGeometry>
      <pointsMaterial size={0.05} color="#ffffff" transparent opacity={0.4} sizeAttenuation={true} />
    </points>
  );
};

// --- 2. COMMUNITY TAG SCROLLER ---
const CommunityScroller = () => {
  const tags = ["Web3 Developers", "AI Researchers", "UI/UX Designers", "SaaS Founders", "Creative Directors", "Data Scientists"];
  return (
    <div className="w-full max-w-sm overflow-hidden">
      <p className="text-[10px] uppercase tracking-[0.4em] text-amber-500 font-bold mb-6 text-center lg:text-left">Trending Hubs</p>
      <div className="flex flex-wrap justify-center lg:justify-start gap-3">
        {tags.map((tag, idx) => (
          <motion.span 
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 * idx }}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] text-white/70 uppercase tracking-widest hover:border-amber-500/50 hover:text-white transition-all cursor-default"
          >
            {tag}
          </motion.span>
        ))}
      </div>
    </div>
  );
};

// --- 3. PHILOSOPHY SECTION ---
const PhilosophySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  const pillars = [
    { title: "Innovate", desc: "Pushing the boundaries of digital collaboration." },
    { title: "Connect", desc: "Linking ambitious minds with global opportunities." },
    { title: "Evolve", desc: "Growing through community-driven knowledge." }
  ];

  return (
    <section ref={ref} className="relative min-h-screen w-full flex-shrink-0 snap-start flex flex-col items-center justify-center bg-black z-20 py-24 px-6 overflow-hidden">
      <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 0.03 } : { opacity: 0 }} className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h2 className="text-[10vw] font-black text-white uppercase tracking-tighter select-none">LINKORA</h2>
      </motion.div>
      <div className="relative z-30 max-w-5xl w-full text-center">
        <motion.span initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} className="text-amber-500 tracking-[0.5em] text-[10px] md:text-xs font-bold mb-4 uppercase block">Our Core Philosophy</motion.span>
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} className="text-4xl md:text-7xl font-serif text-white uppercase tracking-tight mb-16">The Future is <br/> <span className="text-amber-500 italic">Connected</span></motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left mb-20">
          {pillars.map((pillar, index) => (
            <motion.div key={pillar.title} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 + index * 0.1 }}>
              <div className="flex items-center gap-4 mb-4"><span className="text-amber-500 font-mono text-sm">0{index + 1}</span><div className="h-[1px] flex-grow bg-white/10" /></div>
              <h3 className="text-white text-2xl font-serif mb-3 uppercase tracking-widest">{pillar.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{pillar.desc}</p>
            </motion.div>
          ))}
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-12 border-t border-white/5">
          <a href="https://discord.com" target="_blank" rel="noreferrer" className="flex items-center gap-4 px-8 py-4 bg-amber-500 text-black rounded-full font-black hover:bg-amber-400 transition-colors"><FaDiscord /> <span className="text-[10px] uppercase tracking-[0.2em]">Join Discord</span></a>
          <a href="https://www.linkedin.com/company/brainforge16" target="_blank" rel="noreferrer" className="flex items-center gap-4 px-8 py-4 bg-amber-500 text-black rounded-full font-black hover:bg-amber-400 transition-colors"><FaLinkedinIn /> <span className="text-[10px] uppercase tracking-[0.2em]">Join LinkedIn</span></a>
        </div>
      </div>
    </section>
  );
};

// --- 4. MAIN LANDING ---
const Landing = () => {
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate(); 
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const footerLinks = [
    { name: "Home", path: "/" },
    { name: "Explore", path: "/explore" },
    { name: "Community", path: "/community" },
    { name: "About", path: "/about" },
    { name: "Connect", path: "/connect" },
    { name: "User", path: "/user" },
    { name: "Profile", path: "/profile" },
  ];

  return (
    <div className="relative w-full bg-black flex flex-col min-h-screen overflow-x-hidden overflow-y-auto snap-y snap-mandatory scrollbar-hide">
      
      <div className="fixed top-0 left-0 right-0 z-50"><Navbar /></div>

      {/* HERO SECTION */}
      <section className="relative min-h-[100dvh] lg:h-screen w-full flex-shrink-0 snap-start flex flex-col lg:flex-row items-center justify-center lg:justify-between px-6 lg:px-24 pt-24 lg:pt-0 overflow-hidden z-10">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-70 lg:opacity-90">
          <Canvas camera={{ position: [0, 0, isMobile ? 12 : 8], fov: 45 }}>
            <Suspense fallback={null}><MovingStars /><RobotModel isMobile={isMobile} /></Suspense>
            <ambientLight intensity={0.4} /><pointLight position={[5, 2, 5]} intensity={50} color="#00d4ff" />
          </Canvas>
        </div>

        <div className="relative z-10 w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left space-y-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white leading-tight tracking-tighter">
              Begin Your <br/> <span className="text-amber-500 italic">Linkora</span> <br/> Journey
            </h1>
            <p className="text-gray-400 max-w-sm mx-auto lg:mx-0 mt-6 text-sm md:text-base">Linking the world's most ambitious talent to the future of technology.</p>
            <button onClick={() => navigate('/explore')} className="mt-10 bg-amber-500 hover:bg-amber-400 transition-colors text-black px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs shadow-[0_10px_30px_rgba(251,191,36,0.2)]">Explore Ecosystem</button>
          </motion.div>
          <CommunityScroller />
        </div>

        <div className="relative z-10 w-full lg:w-1/2 flex flex-col items-center lg:items-end mt-12 lg:mt-0 pb-10 lg:pb-0">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="mb-8 text-center lg:text-right">
            <span className="text-amber-500 text-[10px] font-bold tracking-[0.4em] uppercase block mb-2">Organized By</span>
            <h3 className="text-white text-xl md:text-2xl font-serif tracking-widest uppercase leading-tight">
              KSHITIJ JAIN <br/> & MANISH KUMAR
            </h3>
          </motion.div>
          <motion.div className="w-full max-w-sm bg-white/5 border border-white/10 backdrop-blur-3xl p-8 rounded-[2rem]">
            <span className="text-amber-500 text-[10px] uppercase block mb-1">Impact</span>
            <h4 className="text-white text-xl font-serif mb-6">Linkora Network</h4>
            {[{ val: "10+", label: "Communities" }, { val: "200+", label: "Members" }, { val: "500+", label: "Connections" }].map((stat, i) => (
              <div key={i} className="flex justify-between border-b border-white/5 pb-4 mb-4 last:border-0"><p className="text-2xl font-serif text-white">{stat.val}</p><p className="text-[10px] text-white/40 uppercase tracking-widest">{stat.label}</p></div>
            ))}
          </motion.div>
        </div>
      </section>

      <PhilosophySection />

      {/* --- FOOTER SECTION --- */}
      <footer className="relative w-full bg-black border-t border-white/5 pt-16 pb-8 px-6 lg:px-24 snap-start flex-shrink-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <RotatingFanIcon>
                <div className="w-10 h-10 rounded-full bg-amber-500/5 flex items-center justify-center border border-amber-500/20">
                  <svg className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </RotatingFanIcon>
              <h2 className="text-3xl font-serif text-white tracking-tighter uppercase italic">
                Link<span className="text-amber-500">ora</span>
              </h2>
            </div>
            <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em] font-bold">
              Linking the Future of Collaboration
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-4">
            {footerLinks.map((link) => (
              <button key={link.name} onClick={() => navigate(link.path)} className="text-left text-gray-400 hover:text-amber-500 transition-colors text-[11px] uppercase tracking-widest font-medium">
                {link.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[9px] text-gray-600 uppercase tracking-widest font-mono">© 2026 LINKORA ECOSYSTEM</p>
          <div className="flex items-center gap-2">
            <span className="text-white/20 text-[8px] uppercase tracking-[0.6em] font-bold">Organized By</span>
            <span className="text-white/40 text-[9px] uppercase tracking-[0.2em] font-black">Kshitij Jain & Manish Kumar</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;