import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaTwitter, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: "Navigation",
      links: [
        { to: "/", text: "Home" },
        { to: "/profiles", text: "Profiles" },
        { to: "/educators", text: "Educators" },
        { to: "/user", text: "My Account" },
      ]
    },
    {
      title: "Features",
      links: [
        { to: "/chat", text: "Chat" },
        { to: "/notification", text: "Notifications" },
      ]
    },
    {
      title: "Account",
      links: [
        { to: "/login", text: "Sign In" },
        { to: "/user", text: "Profile" },
      ]
    }
  ];

  const socialLinks = [
    {
      icon: <FaGithub />,
      href: "https://github.com",
      label: "GitHub"
    },
    {
      icon: <FaTwitter />,
      href: "https://twitter.com",
      label: "Twitter"
    },
    {
      icon: <FaLinkedin />,
      href: "https://linkedin.com",
      label: "LinkedIn"
    },
    {
      icon: <FaEnvelope />,
      href: "mailto:contact@linkaura.com",
      label: "Email"
    }
  ];

  return (
    <footer className="bg-black">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-amber-500/10 rounded-lg border border-amber-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
                  <path d="M10.827 16.379a6.082 6.082 0 0 1-8.618-7.002l5.412 1.45a6.082 6.082 0 0 1 7.002-8.618l-1.45 5.412a6.082 6.082 0 0 1 8.618 7.002l-5.412-1.45a6.082 6.082 0 0 1-7.002 8.618l1.45-5.412Z"/>
                  <path d="M12 12v.01"/>
                </svg>
              </div>
              <span className="text-lg font-serif tracking-tighter text-white uppercase italic">
                LINK<span className="font-light text-amber-500 not-italic">AURA</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Connect with educators and expand your learning network. Discover profiles, engage in meaningful conversations, and grow together.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-amber-500 hover:border-amber-500/50 transition-all duration-300"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.to}
                      className="text-gray-400 text-sm hover:text-amber-500 transition-colors duration-300"
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 flex justify-center">
          <p className="text-gray-400 text-sm">
            {currentYear} LinkAura. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;