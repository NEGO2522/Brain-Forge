import React, { useState, useEffect, useRef } from 'react';
import useSEO from '../hooks/useSEO';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUser, FiMail, FiGithub, FiLinkedin, FiMapPin,
  FiCpu, FiLogOut, FiSave, FiCheckCircle,
  FiAlertCircle, FiX, FiChevronDown, FiSearch, FiPlus, FiCalendar
} from 'react-icons/fi';

const TECH_DOMAINS = [
  "Beginner",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Mobile App Developer",
  "UI/UX Designer",
  "DevOps Engineer",
  "Data Scientist",
  "AI / ML Engineer",
  "Blockchain Developer",
  "Cloud Architect",
  "Cybersecurity Analyst",
  "Game Developer",
  "Embedded Systems",
  "Others"
];

const User = () => {
  useSEO({
    title: 'Profile Settings',
    description: 'Manage your Linkaura identity, update your domain, location, and socials.',
    keywords: 'profile, user settings, linkaura identity, tech stack'
  });

  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [currentUser, setCurrentUser] = useState(null);
  const [profileId,   setProfileId]   = useState(null); // Supabase row id
  const [formData, setFormData] = useState({
    name: '', email: '', address: '', github: '', linkedin: '', tech_stack: '', year: '1'
  });
  const [isSubmitting,  setIsSubmitting]  = useState(false);
  const [submitStatus,  setSubmitStatus]  = useState({ success: null, message: '' });
  const [showTechDropdown, setShowTechDropdown] = useState(false);
  const [searchTerm,    setSearchTerm]    = useState('');
  const [customTech,    setCustomTech]    = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  /* ── Auth + load profile ── */
  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate('/login'); return; }
      const user = session.user;
      setCurrentUser(user);

      // Fetch existing profile row
      const { data } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setProfileId(data.id);
        setFormData({
          name:       data.name       || '',
          email:      data.email      || user.email || '',
          address:    data.address    || '',
          github:     data.github     || '',
          linkedin:   data.linkedin   || '',
          tech_stack: data.tech_stack || '',
          year:       data.year       || '1',
        });
      } else {
        setFormData(prev => ({ ...prev, email: user.email || '' }));
      }
    };
    load();
  }, []);

  /* ── Click outside dropdown ── */
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setShowTechDropdown(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleTech = (tech) => {
    if (tech === 'Others') { setShowCustomInput(true); setShowTechDropdown(false); return; }
    const current = formData.tech_stack ? formData.tech_stack.split(',').map(t => t.trim()).filter(t => t) : [];
    const next = current.includes(tech) ? current.filter(t => t !== tech) : [...current, tech];
    setFormData(prev => ({ ...prev, tech_stack: next.join(', ') }));
  };

  const handleAddCustomTech = () => {
    if (customTech.trim()) { toggleTech(customTech.trim()); setCustomTech(''); setShowCustomInput(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEmpty = Object.values(formData).some(v => !v || (typeof v === 'string' && !v.trim()));
    if (isEmpty) {
      setSubmitStatus({ success: false, message: 'All fields are mandatory!' });
      setTimeout(() => setSubmitStatus({ success: null, message: '' }), 4000);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = { ...formData, user_id: currentUser.id, updated_at: new Date().toISOString() };

      if (profileId) {
        // Update existing row
        const { error } = await supabase.from('user_profiles').update(payload).eq('id', profileId);
        if (error) throw error;
      } else {
        // Insert new row
        const { data, error } = await supabase.from('user_profiles').insert({
          ...payload, created_at: new Date().toISOString()
        }).select().single();
        if (error) throw error;
        setProfileId(data.id);
      }
      setSubmitStatus({ success: true, message: 'Profile Updated!' });
    } catch (err) {
      setSubmitStatus({ success: false, message: err.message });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus({ success: null, message: '' }), 4000);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen w-full bg-black text-white relative flex flex-col items-center pt-32 pb-20 px-4">
      {/* Background */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
        <img src="/User.jpg" className="w-full h-full object-cover" alt="bg" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-5xl relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-4xl shadow-lg">
              <FiUser className="text-amber-500" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-serif italic">Profile <span className="text-amber-500">Settings</span></h1>
              <p className="text-gray-500 text-[10px] uppercase tracking-[0.4em] font-black mt-2">Manage Your Information</p>
            </div>
          </div>
          <button type="button" onClick={handleSignOut}
            className="flex items-center gap-3 px-6 py-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
            <FiLogOut /> Sign Out
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-6 md:p-10 space-y-8 shadow-2xl">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InputField label="Name"  icon={<FiUser />}  name="name"  value={formData.name}  onChange={handleChange} required />
                <InputField label="Email" icon={<FiMail />}  name="email" value={formData.email} onChange={handleChange} required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black ml-1">
                    <FiCalendar className="text-amber-500" /> Year <span className="text-amber-500">*</span>
                  </label>
                  <div className="relative">
                    <select name="year" value={formData.year} onChange={handleChange} required
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:border-amber-500/50 transition-all text-white outline-none appearance-none cursor-pointer uppercase tracking-widest">
                      <option value="1" className="bg-neutral-900">Year 01</option>
                      <option value="2" className="bg-neutral-900">Year 02</option>
                      <option value="3" className="bg-neutral-900">Year 03</option>
                      <option value="4" className="bg-neutral-900">Year 04</option>
                    </select>
                    <FiChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-amber-500 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Tech Stack */}
              <div className="space-y-3 relative" ref={dropdownRef}>
                <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black ml-1">
                  <FiCpu className="text-amber-500" /> Skills <span className="text-amber-500">*</span>
                </label>
                <div
                  onClick={() => setShowTechDropdown(!showTechDropdown)}
                  className={`min-h-[60px] w-full bg-white/5 border rounded-2xl p-3 flex flex-wrap gap-2 cursor-pointer transition-all ${!formData.tech_stack ? 'border-white/10' : 'border-amber-500/30'}`}>
                  {formData.tech_stack ? formData.tech_stack.split(',').filter(t => t.trim()).map(tech => (
                    <span key={tech} className="bg-amber-500 text-black text-[9px] font-black uppercase px-3 py-1.5 rounded-lg flex items-center gap-2 hover:bg-white transition-colors">
                      {tech.trim()}
                      <FiX className="cursor-pointer" onClick={(e) => { e.stopPropagation(); toggleTech(tech.trim()); }} />
                    </span>
                  )) : <span className="text-gray-500 text-xs py-2 px-2 uppercase tracking-widest">Select Skills (Required)...</span>}
                  <FiChevronDown className={`ml-auto self-center text-gray-500 transition-transform ${showTechDropdown ? 'rotate-180' : ''}`} />
                </div>

                <AnimatePresence>
                  {showTechDropdown && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                      className="absolute z-50 w-full mt-2 bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                      <div className="p-3 border-b border-white/5 flex items-center gap-3 bg-white/5">
                        <FiSearch className="text-amber-500" />
                        <input className="bg-transparent border-none outline-none text-xs w-full uppercase tracking-widest text-white"
                          placeholder="Filter Skills..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} autoFocus />
                      </div>
                      <div className="max-h-64 overflow-y-auto p-2 grid grid-cols-1 md:grid-cols-2 gap-1">
                        {TECH_DOMAINS.filter(o => o.toLowerCase().includes(searchTerm.toLowerCase())).map(option => (
                          <div key={option} onClick={() => toggleTech(option)}
                            className={`px-4 py-3 text-[10px] uppercase font-bold tracking-widest rounded-xl cursor-pointer transition-all ${formData.tech_stack.includes(option) ? 'bg-amber-500 text-black' : 'hover:bg-white/5 text-gray-500 hover:text-white'}`}>
                            {option}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {showCustomInput && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-4 flex gap-2">
                      <input
                        className="flex-1 bg-white/5 border border-amber-500/30 rounded-xl px-4 py-3 text-xs uppercase tracking-widest text-white focus:outline-none focus:border-amber-500"
                        placeholder="Type specific skill (e.g. Python, Rust)..."
                        value={customTech} onChange={e => setCustomTech(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddCustomTech())}
                      />
                      <button type="button" onClick={handleAddCustomTech}
                        className="bg-amber-500 text-black px-6 rounded-xl font-black text-[10px] uppercase hover:bg-white transition-all flex items-center gap-2">
                        <FiPlus /> Add
                      </button>
                      <button type="button" onClick={() => setShowCustomInput(false)} className="text-gray-500 hover:text-white px-2"><FiX /></button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black ml-1">Location <span className="text-amber-500">*</span></label>
                <textarea name="address" value={formData.address} onChange={handleChange} required rows="3"
                  className="w-full bg-white/5 border border-white/10 rounded-3xl py-4 px-6 text-sm focus:border-amber-500/50 transition-all resize-none text-white uppercase outline-none"
                  placeholder="City, Country" />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
              <h3 className="text-[10px] uppercase tracking-[0.3em] text-amber-500 font-black mb-8">Social Links <span className="text-amber-500">*</span></h3>
              <SocialInput label="GitHub"   icon={<FiGithub />}   prefix="github.com/" name="github"   value={formData.github}   onChange={handleChange} required />
              <div className="h-6" />
              <SocialInput label="LinkedIn" icon={<FiLinkedin />} prefix="in/"         name="linkedin" value={formData.linkedin} onChange={handleChange} required />
            </div>

            <div className="bg-amber-500 rounded-[2.5rem] p-8 text-black shadow-xl">
              <h4 className="font-serif italic text-2xl mb-2">Save</h4>
              <p className="text-[9px] font-black uppercase tracking-widest opacity-70 mb-6">Update your profile information.</p>
              <button type="submit" disabled={isSubmitting}
                className="w-full bg-black text-white py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest hover:bg-neutral-900 transition-all">
                {isSubmitting ? 'Saving...' : <><FiSave /> Save Profile</>}
              </button>
            </div>
          </div>
        </form>

        {/* Status Toast */}
        <AnimatePresence>
          {submitStatus.message && (
            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}
              className={`fixed bottom-8 right-8 z-[100] px-8 py-5 rounded-3xl border backdrop-blur-3xl shadow-2xl flex items-center gap-4 ${
                submitStatus.success
                  ? 'bg-green-500/10 border-green-500/20 text-green-400'
                  : 'bg-red-500/10 border-red-500/20 text-red-400'
              }`}>
              {submitStatus.success ? <FiCheckCircle className="text-xl" /> : <FiAlertCircle className="text-xl" />}
              <span className="text-[10px] font-black uppercase tracking-widest">{submitStatus.message}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

const InputField = ({ label, icon, name, value, onChange, required }) => (
  <div className="space-y-3">
    <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black ml-1">
      <span className="text-amber-500">{icon}</span> {label} {required && <span className="text-amber-500">*</span>}
    </label>
    <input name={name} type="text" value={value} onChange={onChange} required={required}
      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:border-amber-500/50 transition-all text-white outline-none"
      placeholder="Enter..." />
  </div>
);

const SocialInput = ({ label, icon, prefix, name, value, onChange, required }) => (
  <div className="space-y-3">
    <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black ml-1">
      {icon} {label} {required && <span className="text-amber-500">*</span>}
    </label>
    <div className="flex bg-white/5 border border-white/10 rounded-2xl overflow-hidden focus-within:border-amber-500/50">
      <span className="bg-white/5 px-4 flex items-center text-[9px] text-gray-600 border-r border-white/5 font-black uppercase">{prefix}</span>
      <input name={name} value={value} onChange={onChange} required={required}
        className="bg-transparent w-full py-4 px-4 text-xs focus:outline-none text-white font-bold" placeholder="ID" />
    </div>
  </div>
);

export default User;
