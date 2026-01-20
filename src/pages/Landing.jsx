import React, { useRef, useState, Suspense, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import { 
  FaLinkedinIn, FaDiscord, FaLightbulb, FaHandsHelping, 
  FaGlobe, FaCubes, FaRocket, FaGithub, FaLinkedin, 
  FaUserGraduate // Imported for the educator profile icon
} from 'react-icons/fa';
import Navbar from '../components/Navbar';

// --- 1. STAR BACKGROUND ---
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

// --- 2. 3D ROBOT MODEL (ENLARGED) ---
const RobotModel = ({ isMobile }) => {
  const groupRef = useRef();
  const headTop = useRef();
  const headBottom = useRef();
  const torso = useRef();
  const coreRef = useRef();
  
  const scale = isMobile ? 1.0 : 2.0; 
  const posY = isMobile ? -1.0 : -1.8; 

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

// --- 3. COMMUNITY TAG SCROLLER ---
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

// --- 4. DYNAMIC ISOMETRIC STACK ---
const IsometricPhilosophyStack = () => {
  const initialPillars = [
    { id: 1, title: "Innovate", icon: <FaLightbulb />, color: "bg-white/10", tagline: "Build the Future", details: "Access cutting-edge resources and AI frameworks to scale your vision." },
    { id: 2, title: "Connect", icon: <FaHandsHelping />, color: "bg-amber-500/10", tagline: "Unite with Peers", details: "Join high-signal networks and collaborate with top-tier developers." },
    { id: 3, title: "Evolve", icon: <FaUserGraduate />, color: "bg-white/5", tagline: "Continuous Growth", details: "Stay ahead with exclusive workshops and community-led mentorship." },
  ];

  const [stack, setStack] = useState(initialPillars);

  const handleCardClick = (clickedId) => {
    const clickedIndex = stack.findIndex(item => item.id === clickedId);
    if (clickedIndex === 0) return; 

    const newStack = [...stack];
    const [selectedItem] = newStack.splice(clickedIndex, 1);
    newStack.unshift(selectedItem);
    setStack(newStack);
  };

  return (
    <div className="relative h-[450px] md:h-[650px] w-full flex items-center justify-center lg:justify-start perspective-2000">
      <AnimatePresence mode="popLayout">
        {stack.map((item, i) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, x: -100, rotateX: 45, rotateZ: -45 }}
            animate={{ 
              opacity: 1, 
              x: 0, 
              y: (i * 90) - 90, 
              rotateX: 45, 
              rotateZ: -45,
              scale: i === 0 ? 1 : 0.9,
              zIndex: stack.length - i,
            }}
            onClick={() => handleCardClick(item.id)}
            transition={{ type: "spring", stiffness: 80, damping: 20, mass: 1.2 }}
            className={`absolute cursor-pointer w-64 h-64 md:w-[380px] md:h-[380px] rounded-[3rem] md:rounded-[4rem] border backdrop-blur-3xl shadow-[0_50px_100px_rgba(0,0,0,0.6)] flex flex-col items-center justify-center p-8 text-center transition-colors duration-1000 ${i === 0 ? 'border-amber-500 bg-amber-500/10' : 'border-white/10 ' + item.color}`}
          >
            <div className="transform rotate-45 flex flex-col items-center">
              <div className={`text-4xl md:text-7xl mb-4 transition-colors duration-700 ${i === 0 ? 'text-white' : 'text-amber-500'}`}>
                {item.icon}
              </div>
              <h3 className="text-white text-2xl md:text-4xl font-serif uppercase tracking-[0.2em]">
                {item.title}
              </h3>
              {i === 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 space-y-3">
                  <p className="text-amber-400 font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold">{item.tagline}</p>
                  <p className="text-gray-300 text-[10px] md:text-sm max-w-[200px] md:max-w-[250px] leading-relaxed hidden sm:block">{item.details}</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// --- 5. PHILOSOPHY SECTION ---
const PhilosophySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.1 });

  const pillars = [
    { icon: <FaGlobe />, title: "Decentralized", desc: "No single point of failure, only community-led progress." },
    { icon: <FaCubes />, title: "Modular", desc: "Built to adapt. Integrate with the tools you already use." },
  ];

  const educators = [
    { name: "Code With Harry", github: "codewithharry", linkedin: "company/code-with-harry/" },
    { name: "Kunal Kushwaha", github: "kunal-kushwaha", linkedin: "in/kunal-kushwaha/" },
    { name: "Hitesh Choudhary", github: "hiteshchoudhary", linkedin: "company/chaicodehq/" },
    { name: "freeCodeCamp", github: "freeCodeCamp", linkedin: "school/free-code-camp/" },
    { name: "Krish Naik", github: "krishnaik06", linkedin: "in/naikkrish/" },
    { name: "Apna College", github: "apna-college", linkedin: "company/apna-college/" }
  ];

  return (
    <section ref={ref} className="relative min-h-screen w-full flex-shrink-0 snap-start flex flex-col items-center bg-black z-20 py-16 md:py-24 px-6 lg:px-24 overflow-hidden -mt-[1px]">
      <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 0.05 } : { opacity: 0 }} className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h2 className="text-[clamp(10rem,15vw,20rem)] font-black text-white uppercase tracking-tighter select-none">LINKAURA</h2>
      </motion.div>

      <div className="relative z-30 w-full max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-32 mb-16 md:mb-24">
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-start">
            <IsometricPhilosophyStack />
          </div>

          <div className="w-full lg:w-1/2 text-left flex flex-col justify-center">
            <motion.span initial={{ opacity: 0, x: -20 }} animate={isInView ? { opacity: 1, x: 0 } : {}} className="text-amber-500 tracking-[0.5em] text-[10px] md:text-xs font-bold mb-4 md:mb-6 uppercase block font-mono">Our Core Philosophy</motion.span>
            
            <motion.h2 initial={{ opacity: 0, x: -20 }} animate={isInView ? { opacity: 1, x: 0 } : {}} className="text-5xl md:text-7xl lg:text-8xl font-serif text-white uppercase tracking-tight mb-6 md:mb-8 leading-[0.9]">
              The Future is <br/> <span className="text-amber-500 italic">Connected</span>
            </motion.h2>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }} className="text-gray-400 text-sm md:text-lg max-w-xl mb-8 md:mb-12 font-light leading-relaxed">
              Linkaura is more than a platform; it's a living ecosystem designed to bridge the gap between talent and technology through high-signal networks.
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {pillars.map((p, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3 + (i * 0.1) }}
                  className="group p-5 md:p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-amber-500/50 transition-all duration-500"
                >
                  <div className="text-amber-500 text-xl md:text-2xl mb-4 group-hover:scale-110 transition-transform duration-500">{p.icon}</div>
                  <h4 className="text-white text-base md:text-lg font-serif uppercase tracking-widest mb-2">{p.title}</h4>
                  <p className="text-gray-500 text-xs md:text-sm leading-relaxed">{p.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full border-t border-white/5 pt-12 md:pt-16 mb-16 md:mb-20">
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-10 gap-4">
            <div className="group">
              <p className="text-amber-500 text-[9px] md:text-[10px] uppercase tracking-[0.4em] font-bold mb-2 font-mono">Network Core</p>
              <h3 className="text-3xl md:text-5xl font-serif text-white uppercase italic">Verified Educators</h3>
            </div>
            <p className="text-gray-500 text-xs md:text-sm max-w-xs font-light tracking-wide md:text-right">Access knowledge from the masters of the current digital frontier.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 w-full">
            {educators.map((edu, idx) => (
              <motion.div 
                key={idx}
                className="group relative p-4 md:p-6 rounded-[2rem] bg-white/5 border border-white/10 hover:border-amber-500 transition-all duration-500 flex flex-col items-center text-center"
              >
                {/* Updated Icon from FaSeedling to FaUserGraduate */}
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-4 group-hover:bg-amber-500 group-hover:text-black transition-all">
                  <FaUserGraduate size={16} />
                </div>
                <h5 className="text-white text-[10px] md:text-[11px] font-black uppercase tracking-widest mb-4 leading-tight min-h-[2em] flex items-center">{edu.name}</h5>
                <div className="flex gap-4 mt-auto">
                  <a href={`https://github.com/${edu.github}`} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white transition-colors"><FaGithub size={14}/></a>
                  <a href={`https://linkedin.com/${edu.linkedin}`} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white transition-colors"><FaLinkedin size={14}/></a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 pb-12">
          <a href="https://discord.com" target="_blank" rel="noreferrer" className="w-full sm:w-60 flex items-center justify-center gap-4 px-8 py-4 bg-amber-500 text-black rounded-full font-black hover:bg-amber-400 transition-all uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-amber-500/10"><FaDiscord size={16}/> Join Discord</a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-full sm:w-60 flex items-center justify-center gap-4 px-8 py-4 border border-white/20 text-white rounded-full font-black hover:bg-white hover:text-black transition-all uppercase tracking-[0.2em] text-[10px]"><FaLinkedinIn size={16}/> Join LinkedIn</a>
        </div>
      </div>
    </section>
  );
};

// --- 6. MAIN LANDING ---
const Landing = () => {
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate(); 
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="relative w-full bg-black flex flex-col min-h-screen overflow-x-hidden text-white selection:bg-amber-500 selection:text-black">
      <div className="fixed top-0 left-0 right-0 z-50"><Navbar /></div>

      <section className="relative min-h-[100vh] lg:h-screen w-full flex-shrink-0 snap-start flex flex-col lg:flex-row items-center justify-center lg:justify-between px-6 lg:px-24 pt-20 lg:pt-0 overflow-hidden z-10 bg-black">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-60 lg:opacity-80">
          <Canvas camera={{ position: [0, 0, isMobile ? 12 : 8], fov: 45 }}>
            <Suspense fallback={null}>
              <MovingStars />
              <RobotModel isMobile={isMobile} />
            </Suspense>
            <ambientLight intensity={0.4} />
            <pointLight position={[5, 2, 5]} intensity={50} color="#00d4ff" />
          </Canvas>
        </div>

        <div className="relative z-10 w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left mt-10 lg:mt-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-6 md:space-y-8">
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-serif text-white leading-[1.1] tracking-tighter">
              Begin Your <br/> <span className="text-amber-500 italic">Linkaura</span> <br/> Journey
            </h1>
            <p className="text-gray-400 max-w-sm mx-auto lg:mx-0 text-sm md:text-base">Linking the world's most ambitious talent to the future of technology.</p>
            <button onClick={() => navigate('/roadmap')} className="bg-amber-500 hover:bg-amber-400 transition-colors text-black px-8 py-4 rounded-full font-bold uppercase tracking-widest text-[10px] md:text-xs">Explore Ecosystem</button>
          </motion.div>
          <div className="mt-12 md:mt-16 w-full flex justify-center lg:justify-start">
            <CommunityScroller />
          </div>
        </div>

        <div className="relative z-10 w-full lg:w-1/2 flex flex-col items-center lg:items-end mt-12 lg:mt-24 pb-10 lg:pb-0">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="mb-6 md:mb-8 text-center lg:text-right">
            <span className="text-amber-500 text-[9px] md:text-[10px] font-bold tracking-[0.4em] uppercase block mb-2">Organized By</span>
            <h3 className="text-white text-lg md:text-2xl font-serif tracking-widest uppercase leading-tight">
              KSHITIJ JAIN <br className="hidden md:block"/> & MANISH KUMAR
            </h3>
          </motion.div>
          <motion.div className="w-full max-w-sm bg-white/5 border border-white/10 backdrop-blur-3xl p-6 md:p-8 rounded-[2rem]">
            <span className="text-amber-500 text-[9px] md:text-[10px] uppercase block mb-1 font-bold">Impact</span>
            <h4 className="text-white text-lg md:text-xl font-serif mb-6">Linkaura Network</h4>
            {[{ val: "10+", label: "Communities" }, { val: "200+", label: "Members" }, { val: "500+", label: "Connections" }].map((stat, i) => (
              <div key={i} className="flex justify-between border-b border-white/5 pb-3 mb-3 last:border-0 last:mb-0 last:pb-0">
                <p className="text-xl md:text-2xl font-serif text-white">{stat.val}</p>
                <p className="text-[9px] text-white/40 uppercase tracking-widest flex items-center">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <PhilosophySection />

      <footer className="relative w-full bg-black border-t border-white/5 py-10 px-6 lg:px-24 flex-shrink-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <p className="text-[10px] text-gray-500 uppercase tracking-[0.4em] font-mono">
            © 2026 LINKAURA ECOSYSTEM
          </p>
          <div className="flex flex-col items-center md:items-end">
            <span className="text-white/20 text-[8px] uppercase tracking-[0.6em] font-bold mb-1">Founders</span>
            <span className="text-white/50 text-[10px] uppercase tracking-[0.2em] font-black italic">
              Kshitij Jain & Manish Kumar
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;