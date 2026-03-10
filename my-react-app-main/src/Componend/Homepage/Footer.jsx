import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const footerLinks = {
  Ravorin: ['About Ravorin', 'Career', 'Blog', 'B2B Digital'],
  Buy: ['Bill & Top Up', 'Official Store', 'Blog', 'Promo'],
  'Guide and Help': ['Ravorin Care', 'Terms and Condition', 'Privacy', 'FAQ'],
};

const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-b from-[#16173b] via-[#1d1f52] to-[#2d1f6d] text-white mt-12">
      <div className="w-full max-w-none px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/ravorin-logo.png"
                alt="Ravorin logo"
                className="w-12 h-12 rounded-xl object-cover border border-white/20 shadow"
                onError={(e) => {
                  e.currentTarget.src = '/vite.svg';
                }}
              />
              <span className="text-2xl font-extrabold tracking-tight">Ravorin</span>
            </div>
            <p className="text-sm text-white/80">Let&apos;s Shop Beyond Boundaries</p>
            <div className="flex items-center gap-3 pt-2">
              {[FaFacebookF, FaTwitter, FaInstagram, FaYoutube].map((Icon, idx) => (
                <button
                  key={idx}
                  className="w-10 h-10 rounded-full bg-white/10 text-white grid place-items-center hover:bg-white/20 transition-colors"
                  aria-label={`social-${idx}`}
                >
                  <Icon className="text-lg" />
                </button>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="space-y-3">
              <h3 className="text-lg font-semibold">{title}</h3>
              <ul className="space-y-2 text-sm text-white/85">
                {links.map((item) => (
                  <li key={item} className="hover:text-white transition-colors cursor-pointer">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <hr className="border-white/10" />

        <div className="py-6 text-center text-sm text-white/80">
          © 2025 Ravorin. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
