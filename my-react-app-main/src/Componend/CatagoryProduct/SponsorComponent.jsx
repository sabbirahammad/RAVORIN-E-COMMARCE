import React from 'react';

const sponsors = [
  {
    name: 'Samsung',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg',
    link: 'https://www.samsung.com/',
  },
  {
    name: 'Sony',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Sony_Logo.svg',
    link: 'https://www.sony.com/',
  },
  {
    name: 'LG',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1f/LG_logo_%282015%29.svg',
    link: 'https://www.lg.com/',
  },
  {
    name: 'Haier',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Haier_logo.svg',
    link: 'https://www.haier.com/',
  },
  {
    name: 'Walton',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Walton_Logo_English.svg',
    link: 'https://waltonbd.com/',
  },
  {
    name: 'Hisense',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Hisense_logo.svg',
    link: 'https://www.hisense.com/',
  },
];

const SponsorComponent = () => {
  return (
    <div className="py-10 px-4 sm:px-6 md:px-10 bg-[#121318] text-white">
      <h2 className="text-2xl font-bold text-center mb-8">Trusted by Top Brands</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 justify-items-center">
        {sponsors.map((sponsor, index) => (
          <a
            key={index}
            href={sponsor.link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full max-w-[120px] p-4 bg-[#1e1e1e] hover:bg-[#2b2b2b] transition rounded-xl shadow-md hover:shadow-xl flex items-center justify-center"
          >
            <img
              src={sponsor.logo}
              alt={sponsor.name}
              className="h-10 object-contain grayscale hover:grayscale-0 transition duration-300"
            />
          </a>
        ))}
      </div>
    </div>
  );
};

export default SponsorComponent;


