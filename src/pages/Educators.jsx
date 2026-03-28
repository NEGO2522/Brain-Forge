import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaYoutube, FaInstagram } from 'react-icons/fa';
import { FiSearch } from 'react-icons/fi';

const ALL_EDUCATORS = [
  { name: "Code With Harry", field: "Full Stack & DSA", github: "codewithharry", linkedin: "company/code-with-harry/", youtube: "CodeWithHarry", instagram: "codewithharry" },
  { name: "Kunal Kushwaha", field: "DevOps & Open Source", github: "kunal-kushwaha", linkedin: "in/kunal-kushwaha/", youtube: "KunalKushwaha", instagram: "kunalk09" },
  { name: "Hitesh Choudhary", field: "JavaScript & Backend", github: "hiteshchoudhary", linkedin: "company/chaicodehq/", youtube: "HiteshChoudharydotcom", instagram: "hiteshchoudharyofficial" },
  { name: "freeCodeCamp", field: "Web Dev & CS Fundamentals", github: "freeCodeCamp", linkedin: "school/free-code-camp/", youtube: "freecodecamp", instagram: "freecodecamp" },
  { name: "Krish Naik", field: "Machine Learning & AI", github: "krishnaik06", linkedin: "in/naikkrish/", youtube: "krishnaik06", instagram: "krishnaik06" },
  { name: "Apna College", field: "DSA & Placement Prep", github: "apna-college", linkedin: "company/apna-college/", youtube: "ApnaCollegeOfficial", instagram: "apna.college" },
  { name: "Traversy Media", field: "Full Stack & Frameworks", github: "bradtraversy", linkedin: "in/bradtraversy/", youtube: "TraversyMedia", instagram: "traversymedia" },
  { name: "Fireship", field: "Modern Web & Tools", github: "codediodeio", linkedin: "in/jeff-delaney/", youtube: "Fireship", instagram: "fireshipio" },
  { name: "The Coding Train", field: "Creative Coding & Algorithms", github: "CodingTrain", linkedin: "in/daniel-shiffman/", youtube: "TheCodingTrain", instagram: "thecodingtrain" },
  { name: "Clever Programmer", field: "React & JavaScript", github: "CleverProgrammer", linkedin: "in/qazi-imtiaz-ali/", youtube: "CleverProgrammer", instagram: "cleverprogrammer" },
  { name: "Tech With Tim", field: "Python & Machine Learning", github: "techwithtim", linkedin: "in/tim-ruscica/", youtube: "TechWithTim", instagram: "techwithtim" },
  { name: "Kevin Powell", field: "CSS & Frontend Design", github: "kevin-powell", linkedin: "in/kevinpowell6/", youtube: "KevinPowell", instagram: "kevinpowell6" },
  { name: "Academind", field: "React, Node & Cloud", github: "academind", linkedin: "company/academind/", youtube: "Academind", instagram: "academind_web" },
  { name: "Sonny Sangha", field: "Full Stack React", github: "sonnysangha", linkedin: "in/sonny-sangha/", youtube: "SonnySangha", instagram: "sonnysangha" },
  { name: "CS50 Harvard", field: "CS Fundamentals", github: "cs50", linkedin: "company/cs50/", youtube: "cs50", instagram: "cs50" },
  { name: "Piyush Garg", field: "Node.js & System Design", github: "piyushgarg-dev", linkedin: "in/piyushgarg97/", youtube: "PiyushGargDev", instagram: "piyushgarg.dev" },
  { name: "Sheriyans Coding School", field: "MERN Stack & Projects", github: "sheriyanscoding", linkedin: "company/sheriyanscode/", youtube: "SheriyanscodingSchool", instagram: "sheriyanscode" },
  { name: "Chai aur Code", field: "JavaScript & Backend", github: "hiteshchoudhary", linkedin: "company/chaicodehq/", youtube: "ChaiAurCode", instagram: "chaiaurcode" },
  { name: "Programming with Mosh", field: "Clean Code & Best Practices", github: "mosh-hamedani", linkedin: "in/moshhamedani/", youtube: "programmingwithmosh", instagram: "programmingwithmosh" },
  { name: "Codevolution", field: "React & TypeScript", github: "gopinav", linkedin: "in/gopinav/", youtube: "Codevolution", instagram: "codevolution_" },
  { name: "Web Dev Simplified", field: "JavaScript & Web APIs", github: "WebDevSimplified", linkedin: "in/kyle-cook-web-dev-simplified/", youtube: "WebDevSimplified", instagram: "webdevsimplified" },
  { name: "Neetcode", field: "DSA & LeetCode", github: "neetcode-gh", linkedin: "in/navdeep-singh-9b7751168/", youtube: "NeetCode", instagram: "neetcode_io" },
  { name: "NetworkChuck", field: "Networking & Cybersecurity", github: "theNetworkChuck", linkedin: "in/chuckkeith/", youtube: "NetworkChuck", instagram: "networkchuck" },
  { name: "TechWorld with Nana", field: "DevOps & Kubernetes", github: "nanuchi", linkedin: "in/nana-janashia/", youtube: "TechWorldwithNana", instagram: "techworld_with_nana" },
];

const FILTERS = ["All", "Full Stack", "Machine Learning & AI", "DSA", "CSS & Frontend", "Python", "DevOps", "React"];

const Educators = () => {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = ALL_EDUCATORS.filter(e => {
    const matchSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.field.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      activeFilter === 'All' || e.field.toLowerCase().includes(activeFilter.toLowerCase());
    return matchSearch && matchFilter;
  });

  return (
    <div className="min-h-screen w-full bg-black text-white pt-32 pb-20 px-4 md:px-10 relative overflow-x-hidden">
      {/* bg glow */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[10%] right-[-5%] w-[40%] h-[40%] bg-amber-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] left-[-5%] w-[40%] h-[40%] bg-amber-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <span className="text-amber-500 text-[10px] uppercase tracking-[0.5em] font-black block mb-3">
            Community Picks
          </span>
          <h1 className="text-4xl md:text-6xl font-serif italic mb-3">
            Top <span className="text-amber-500">Educators</span>
          </h1>
          <div className="w-16 h-1 bg-amber-500 mb-6" />
          <p className="text-gray-400 text-sm max-w-xl leading-relaxed">
            A curated list of educators our community follows and recommends. Learn from the best in development, design, and computer science.
          </p>
        </motion.div>

        {/* Search + Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative max-w-sm w-full">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500/50" />
            <input
              type="text"
              placeholder="Search by name or topic..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-11 text-sm outline-none focus:border-amber-500/40 transition-all placeholder:text-gray-600 tracking-wide"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                  activeFilter === f
                    ? 'bg-amber-500 text-black border-amber-500'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:border-amber-500/30 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <p className="text-gray-600 text-[10px] uppercase tracking-widest font-black mb-8">
          Showing {filtered.length} of {ALL_EDUCATORS.length} educators
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((edu, i) => (
            <motion.div
              key={edu.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="group bg-white/5 border border-white/10 rounded-[2rem] p-6 hover:border-amber-500/40 transition-all duration-300 flex flex-col gap-4"
            >
              <div>
                <h3 className="text-white font-serif text-lg italic mb-1 group-hover:text-amber-500 transition-colors">
                  {edu.name}
                </h3>
                <p className="text-[10px] uppercase tracking-widest text-amber-500/60 font-black">
                  {edu.field}
                </p>
              </div>

              <div className="flex gap-2 mt-auto">
                {edu.youtube && (
                  <a href={`https://youtube.com/@${edu.youtube}`} target="_blank" rel="noreferrer"
                    className="p-2 bg-white/5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all border border-white/5" title="YouTube">
                    <FaYoutube size={14} />
                  </a>
                )}
                {edu.instagram && (
                  <a href={`https://instagram.com/${edu.instagram}`} target="_blank" rel="noreferrer"
                    className="p-2 bg-white/5 rounded-lg text-gray-500 hover:text-pink-400 hover:bg-pink-500/10 transition-all border border-white/5" title="Instagram">
                    <FaInstagram size={14} />
                  </a>
                )}
                {edu.github && (
                  <a href={`https://github.com/${edu.github}`} target="_blank" rel="noreferrer"
                    className="p-2 bg-white/5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all border border-white/5" title="GitHub">
                    <FaGithub size={14} />
                  </a>
                )}
                {edu.linkedin && (
                  <a href={`https://linkedin.com/${edu.linkedin}`} target="_blank" rel="noreferrer"
                    className="p-2 bg-white/5 rounded-lg text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all border border-white/5" title="LinkedIn">
                    <FaLinkedin size={14} />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-24 text-center opacity-40 font-serif italic text-xl">
            No educators found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Educators;
