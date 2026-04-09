import React from 'react';
import { Link } from 'react-router-dom';
import { FiTwitter, FiLinkedin, FiMail, FiGithub } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Platform',
      links: [
        { to: '/', text: 'Home' },
        { to: '/profiles', text: 'Browse Seniors' },
        { to: '/educators', text: 'Educators' },
        { to: '/connect', text: 'Connect' },
      ],
    },
    {
      title: 'Features',
      links: [
        { to: '/chat', text: 'Direct Chat' },
        { to: '/notification', text: 'Notifications' },
        { to: '/user', text: 'My Profile' },
      ],
    },
    {
      title: 'Company',
      links: [
        { to: '/about', text: 'About' },
        { to: '/signup', text: 'Join Free' },
        { to: '/login', text: 'Sign In' },
      ],
    },
  ];

  const socialLinks = [
    { icon: <FiTwitter size={14} />,  href: 'https://twitter.com',         label: 'Twitter'  },
    { icon: <FiLinkedin size={14} />, href: 'https://linkedin.com',         label: 'LinkedIn' },
    { icon: <FiGithub size={14} />,   href: 'https://github.com',           label: 'GitHub'   },
    { icon: <FiMail size={14} />,     href: 'mailto:contact@linkaura.com',  label: 'Email'    },
  ];

  return (
    <footer className="bg-white border-t border-black/8" style={{ fontFamily: "'Georgia', serif" }}>

      {/* ── MAIN GRID ── */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">

          {/* Brand column */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 bg-black flex items-center justify-center">
                <span className="text-white text-[10px] font-black">L</span>
              </div>
              <span className="text-sm font-black uppercase tracking-[0.3em]" style={{ fontFamily: 'sans-serif' }}>Linkaura</span>
            </div>
            <p className="text-sm text-black/45 leading-relaxed mb-8" style={{ fontFamily: 'sans-serif', fontWeight: 400 }}>
              The college-exclusive platform where juniors find seniors in the same domain — and seniors earn by sharing what they know.
            </p>

            {/* Social icons */}
            <div className="flex gap-2">
              {socialLinks.map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-8 h-8 border border-black/15 flex items-center justify-center text-black/35 hover:bg-black hover:text-white hover:border-black transition-all duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {footerLinks.map((section, i) => (
            <div key={i}>
              <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-black/30 mb-5" style={{ fontFamily: 'sans-serif' }}>
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, j) => (
                  <li key={j}>
                    <Link
                      to={link.to}
                      className="text-sm text-black/45 hover:text-black transition-colors duration-150"
                      style={{ fontFamily: 'sans-serif', fontWeight: 400 }}
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="border-t border-black/8">
        <div className="max-w-5xl mx-auto px-6 md:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-black/25" style={{ fontFamily: 'sans-serif' }}>
            © {currentYear} Linkaura · All rights reserved
          </p>
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-black/25" style={{ fontFamily: 'sans-serif' }}>
            Accessible only with your college email
          </p>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
