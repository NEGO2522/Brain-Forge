import React from 'react';
import { Link } from 'react-router-dom';
import { FaTwitter, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Navigation',
      links: [
        { to: '/', text: 'Home' },
        { to: '/profiles', text: 'Profiles' },
        { to: '/educators', text: 'Educators' },
        { to: '/user', text: 'My Account' },
      ],
    },
    {
      title: 'Features',
      links: [
        { to: '/chat', text: 'Chat' },
        { to: '/notification', text: 'Notifications' },
      ],
    },
    {
      title: 'Account',
      links: [
        { to: '/user', text: 'Profile' },
        { to: '/connect', text: 'Connect' },
        { to: '/about', text: 'About' },
      ],
    },
  ];

  const socialLinks = [
    { icon: <FaTwitter />,  href: 'https://twitter.com',            label: 'Twitter'  },
    { icon: <FaLinkedin />, href: 'https://linkedin.com',           label: 'LinkedIn' },
    { icon: <FaEnvelope />, href: 'mailto:contact@linkaura.com',    label: 'Email'    },
  ];

  /* ── theme tokens ── */
  const outerBg  = '#000000';          // page bg behind card
  const cardBg   = '#111111';          // card fill — clearly visible
  const cardBd   = 'rgba(255,255,255,0.08)'; // card border
  const shadow   = '0 0 0 1px rgba(255,255,255,0.06), 0 24px 64px rgba(0,0,0,0.6)';
  const textPri  = '#ffffff';
  const textMut  = '#6b7280';
  const divider  = 'rgba(255,255,255,0.07)';
  const iconBg   = 'rgba(255,255,255,0.06)';
  const iconBd   = 'rgba(255,255,255,0.10)';

  return (
    <div
      className="w-full px-4 md:px-8 pb-8"
      style={{ backgroundColor: outerBg }}
    >
      <footer
        className="max-w-7xl mx-auto rounded-3xl overflow-hidden"
        style={{
          backgroundColor: cardBg,
          border: `1px solid ${cardBd}`,
          boxShadow: shadow,
        }}
      >
        <div className="px-8 md:px-12 py-12 md:py-16">

          {/* ── MAIN GRID ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">

            {/* Brand */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-5">
                <div
                  className="p-1.5 rounded-lg"
                  style={{
                    backgroundColor: 'rgba(245,158,11,0.10)',
                    border: '1px solid rgba(245,158,11,0.22)',
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.827 16.379a6.082 6.082 0 0 1-8.618-7.002l5.412 1.45a6.082 6.082 0 0 1 7.002-8.618l-1.45 5.412a6.082 6.082 0 0 1 8.618 7.002l-5.412-1.45a6.082 6.082 0 0 1-7.002 8.618l1.45-5.412Z"/>
                    <path d="M12 12v.01"/>
                  </svg>
                </div>
                <span
                  className="text-lg font-serif tracking-tighter uppercase italic"
                  style={{ color: textPri }}
                >
                  LINK<span className="font-light text-amber-500 not-italic">AURA</span>
                </span>
              </div>

              <p className="text-sm leading-relaxed mb-7" style={{ color: textMut }}>
                Connect with educators and expand your learning network. Discover profiles, engage in meaningful conversations, and grow together.
              </p>

              {/* Social icons */}
              <div className="flex gap-2.5">
                {socialLinks.map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300"
                    style={{ backgroundColor: iconBg, border: `1px solid ${iconBd}`, color: textMut }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = '#f59e0b';
                      e.currentTarget.style.borderColor = 'rgba(245,158,11,0.40)';
                      e.currentTarget.style.backgroundColor = 'rgba(245,158,11,0.08)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = textMut;
                      e.currentTarget.style.borderColor = iconBd;
                      e.currentTarget.style.backgroundColor = iconBg;
                    }}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Nav columns */}
            {footerLinks.map((section, i) => (
              <div key={i}>
                <h3
                  className="text-[10px] font-black uppercase tracking-[0.28em] mb-5"
                  style={{ color: '#f59e0b' }}
                >
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link, j) => (
                    <li key={j}>
                      <Link
                        to={link.to}
                        className="text-sm transition-colors duration-200"
                        style={{ color: textMut }}
                        onMouseEnter={e => e.currentTarget.style.color = '#f59e0b'}
                        onMouseLeave={e => e.currentTarget.style.color = textMut}
                      >
                        {link.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* ── BOTTOM BAR ── */}
          <div
            className="mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{ borderTop: `1px solid ${divider}` }}
          >
            <p className="text-xs" style={{ color: textMut }}>
              © {currentYear} LinkAura. All rights reserved.
            </p>
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold" style={{ color: textMut }}>
              Built with <span className="text-amber-500">♥</span> for builders
            </p>
          </div>

        </div>
      </footer>
    </div>
  );
};

export default Footer;
