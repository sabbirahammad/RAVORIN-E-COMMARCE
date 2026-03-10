import React from "react";

const sponsors = [
  {
    id: 1,
    name: "Sponsor 1",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/02/SVG_logo.svg",
    link: "https://example.com/sponsor1",
    description: "Leading tech innovator",
  },
  {
    id: 2,
    name: "Sponsor 2",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png",
    link: "https://example.com/sponsor2",
    description: "Global search engine",
  },
  {
    id: 3,
    name: "Sponsor 3",
    logo: "https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg",
    link: "https://example.com/sponsor3",
    description: "Movie database leader",
  },
  {
    id: 4,
    name: "Sponsor 4",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Dell_Logo.svg",
    link: "https://example.com/sponsor4",
    description: "PC and hardware giant",
  },
  {
    id: 5,
    name: "Sponsor 5",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    link: "https://example.com/sponsor5",
    description: "E-commerce pioneer",
  },
];

const SponsorMasonryBlockBG = () => {
  return (
    <section className="bg-gradient-to-br from-gray-900 via-black to-gray-800 py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-center text-white text-3xl sm:text-4xl font-bold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
          Our Valued Sponsors
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {sponsors.map(({ id, name, logo, link, description }) => (
            <a
              key={id}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-cyan-500/30 hover:scale-[1.02] transition duration-300 flex flex-col items-center text-center"
              aria-label={`Visit ${name} website`}
            >
              <img
                src={logo}
                alt={`${name} logo`}
                className="h-24 object-contain mb-4"
                loading="lazy"
              />
              <h3 className="text-white text-lg font-semibold">{name}</h3>
              <p className="text-gray-400 text-sm mt-1">{description}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SponsorMasonryBlockBG;



