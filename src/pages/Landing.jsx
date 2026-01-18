import React, { useRef, useState, Suspense, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import Navbar from '../components/Navbar';

// --- 1. FIXED REAL-TIME COUNTDOWN HOOK ---
const useCountdown = (targetDate) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
};

// --- 2. ENLARGED ANIMATED ROBOT ---
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

// --- 3. ORGANIZED BY SECTION ---
const OrganizedBySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  const links = [
    { name: "About Us", url: "#about" },
    { name: "Join LinkedIn", url: "https://linkedin.com" },
    { name: "Join Discord", url: "https://discord.com" }
  ];

  return (
    <section ref={ref} className="relative min-h-screen w-full flex-shrink-0 snap-start flex flex-col items-center justify-center bg-black z-20 py-20 px-6">
      <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 0.05 } : { opacity: 0 }} className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h2 className="text-[18vw] font-black text-white uppercase tracking-tighter select-none">KSHITIJ</h2>
      </motion.div>
      
      <div className="relative z-30 flex flex-col items-center text-center">
        <span className="text-amber-500 tracking-[0.5em] text-[10px] md:text-xs font-bold mb-4 uppercase">Lead Organizer</span>
        <h2 className="text-5xl md:text-8xl font-serif text-white uppercase tracking-widest mb-12">Kshitij Jain</h2>
        
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12 mt-4">
          <span className="text-white/30 text-[10px] uppercase tracking-[0.4em] mb-2 md:mb-0">Connect Us:</span>
          {links.map((link, index) => (
            <motion.a
              key={link.name}
              href={link.url}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="group relative flex flex-col items-center"
            >
              <span className="text-white/70 group-hover:text-amber-500 text-xs md:text-sm uppercase tracking-[0.2em] font-medium transition-colors duration-300">
                {link.name}
              </span>
              <div className="h-[1px] w-0 group-hover:w-full bg-amber-500 transition-all duration-300 mt-1 shadow-[0_0_8px_#fbbf24]" />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- 4. MAIN LANDING ---
const Landing = () => {
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate(); // 2. Initialize navigate
  
  // Fixed Target Date (14 days from now)
  const targetDate = useMemo(() => new Date().getTime() + 14 * 24 * 60 * 60 * 1000, []);
  const timeLeft = useCountdown(targetDate);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="relative w-full bg-black flex flex-col min-h-screen overflow-x-hidden overflow-y-auto snap-y snap-mandatory scrollbar-hide">
      
      <div className="fixed top-0 left-0 right-0 z-50"><Navbar /></div>

      {/* SECTION 1: HERO */}
      <section className="relative min-h-[100dvh] lg:h-screen w-full flex-shrink-0 snap-start flex flex-col lg:flex-row items-center justify-center lg:justify-between px-6 lg:px-24 pt-24 lg:pt-0 overflow-hidden z-10">
        
        {/* Background 3D Layer */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-70 lg:opacity-90">
          <Canvas camera={{ position: [0, 0, isMobile ? 12 : 8], fov: 45 }}>
            <Suspense fallback={null}>
              <MovingStars />
              <RobotModel isMobile={isMobile} />
            </Suspense>
            <ambientLight intensity={0.4} />
            <pointLight position={[5, 2, 5]} intensity={50} color="#00d4ff" />
          </Canvas>
        </div>

        {/* LEFT CONTENT */}
        <div className="relative z-10 w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white leading-tight tracking-tighter">
              Begin Your <br/> 
              <span className="text-amber-500 italic">Community</span> <br/>
              Journey
            </h1>
            <p className="text-gray-400 max-w-sm mx-auto lg:mx-0 mt-6 text-sm md:text-base">
              Forge connections between passion and professional excellence in our digital ecosystem.
            </p>
            <div className="mt-10">
              <button 
                onClick={() => navigate('/explore')} // 3. Add onClick navigation
                className="bg-amber-500 text-black px-6 py-4 rounded-full font-bold active:scale-95 transition-all shadow-[0_10px_20px_rgba(251,191,36,0.2)] uppercase tracking-widest text-xs cursor-pointer w-max"
              >
                Explore Here
              </button>
            </div>
          </motion.div>

          {/* COUNTDOWN */}
          <div className="flex flex-col items-center lg:items-start space-y-3 bg-white/5 lg:bg-transparent p-6 rounded-3xl backdrop-blur-xl border border-white/10 lg:border-none w-full max-w-sm lg:max-w-none">
            <span className="text-[10px] uppercase tracking-[0.3em] text-amber-500 font-bold">DEPLOYMENT STARTS IN</span>
            <div className="flex gap-6">
              {[
                { label: 'D', value: timeLeft.days },
                { label: 'H', value: timeLeft.hours },
                { label: 'M', value: timeLeft.minutes },
                { label: 'S', value: timeLeft.seconds }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <span className="text-2xl md:text-4xl font-serif text-white w-[1.5ch] text-center">
                    {item.value.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[9px] text-amber-500 font-bold uppercase">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: HERO CREDIT + STATS CARD */}
        <div className="relative z-10 w-full lg:w-1/2 flex flex-col items-center lg:items-end mt-12 lg:mt-0 pb-10 lg:pb-0">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="mb-8 text-center lg:text-right">
            <span className="text-amber-500 text-[10px] font-bold tracking-[0.4em] uppercase block mb-2">Organized By</span>
            <h3 className="text-white text-2xl md:text-3xl font-serif tracking-widest">KSHITIJ JAIN</h3>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="w-full max-w-sm bg-white/5 border border-white/10 backdrop-blur-3xl p-8 rounded-[2rem] shadow-2xl border-l-amber-500/20">
            <div className="mb-6">
              <span className="text-amber-500 text-[10px] font-black tracking-widest uppercase block mb-1">Impact</span>
              <h4 className="text-white text-xl font-serif">Community Reach</h4>
            </div>
            <div className="grid grid-cols-1 gap-6 text-white">
               {[
                 { val: "25+", label: "Communities" },
                 { val: "5,400+", label: "Enrolled" },
                 { val: "1,200+", label: "Connections" }
               ].map((stat, idx) => (
                 <div key={idx} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0">
                    <p className="text-2xl font-serif">{stat.val}</p>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest">{stat.label}</p>
                 </div>
               ))}
            </div>
          </motion.div>
        </div>
      </section>

      <OrganizedBySection />
    </div>
  );
};

export default Landing;