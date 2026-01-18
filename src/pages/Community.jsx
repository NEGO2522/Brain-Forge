import React from 'react';
import { FaDiscord, FaUsers } from 'react-icons/fa';

const CommunityCard = ({ name, description, category, memberCount, discordLink }) => {
  return (
    <div className="bg-gray-900/70 backdrop-blur-sm rounded-xl p-6 border border-amber-500/20 hover:border-amber-400/50 transition-all duration-300 h-full flex flex-col">
      <div className="flex-grow">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-amber-400">{name}</h3>
          <span className="px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-medium rounded-full">
            {category}
          </span>
        </div>
        <p className="text-gray-300 mb-4">{description}</p>
      </div>
      <div className="mt-auto pt-4 border-t border-gray-800 flex justify-between items-center">
        {memberCount && (
          <div className="flex items-center text-gray-400 text-sm">
            <FaUsers className="mr-1" />
            <span>{memberCount} members</span>
          </div>
        )}
        <a 
          href={discordLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors duration-200"
        >
          <FaDiscord className="mr-2" /> Join Now
        </a>
      </div>
    </div>
  );
};

const Community = () => {
  const communities = [
    {
      id: 1,
      name: 'LinkedIn',
      description: 'Enhance your professional profile and network with industry leaders',
      category: 'Networking',
      memberCount: '2.1k+',
      discordLink: 'https://discord.gg/linkedin'
    },
    {
      id: 2,
      name: 'Job Opportunities',
      description: 'Find and share job openings and career advancement opportunities',
      category: 'Career',
      memberCount: '1.8k+',
      discordLink: 'https://discord.gg/jobs'
    },
    {
      id: 3,
      name: 'Startup',
      description: 'Connect with founders, investors, and startup enthusiasts',
      category: 'Entrepreneurship',
      memberCount: '1.5k+',
      discordLink: 'https://discord.gg/startups'
    },
    {
      id: 4,
      name: 'App Development',
      description: 'Master mobile and desktop application development across platforms',
      category: 'Tech',
      memberCount: '980+',
      discordLink: 'https://discord.gg/appdev'
    },
    {
      id: 5,
      name: 'Gen AI',
      description: 'Explore the world of Generative AI models and their applications',
      category: 'AI',
      memberCount: '1.1k+',
      discordLink: 'https://discord.gg/genai'
    },
    {
      id: 3,
      name: 'Agentic AI',
      description: 'Build and understand autonomous AI agents and their ecosystems',
      category: 'AI',
      memberCount: '750+',
      discordLink: 'https://discord.gg/agenticai'
    },
    {
      id: 4,
      name: 'Deep Learning',
      description: 'Dive into neural networks and advanced machine learning techniques',
      category: 'AI',
      memberCount: '1.3k+',
      discordLink: 'https://discord.gg/deeplearning'
    },
    {
      id: 5,
      name: 'Web Development',
      description: 'Build modern web applications and learn from industry experts',
      category: 'Tech',
      memberCount: '1.2k+',
      discordLink: 'https://discord.gg/webdev'
    },
    {
      id: 6,
      name: 'Data Science',
      description: 'Explore data analysis, machine learning, and AI with fellow data enthusiasts',
      category: 'Learning',
      memberCount: '850+',
      discordLink: 'https://discord.gg/datascience'
    },
    {
      id: 7,
      name: 'Cybersecurity',
      description: 'Learn security best practices and ethical hacking techniques',
      category: 'Tech',
      memberCount: '720+',
      discordLink: 'https://discord.gg/cybersec'
    },
    {
      id: 8,
      name: 'Blockchain',
      description: 'Dive into blockchain technology, Web3, and decentralized applications',
      category: 'Tech',
      memberCount: '950+',
      discordLink: 'https://discord.gg/blockchain'
    },
    {
      id: 9,
      name: 'Hackathons',
      description: 'Find hackathons, form teams, and build amazing projects',
      category: 'Events',
      memberCount: '1.5k+',
      discordLink: 'https://discord.gg/hackathons'
    },
    {
      id: 10,
      name: 'DevOps & Cloud',
      description: 'Master cloud infrastructure and CI/CD pipelines',
      category: 'Tech',
      memberCount: '680+',
      discordLink: 'https://discord.gg/devops'
    }
  ];

  return (
    <div 
      className="min-h-screen pt-32 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-auto"
      style={{
        backgroundImage: 'url(/Bg.jpg)', 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        scrollBehavior: 'smooth'
      }}
    >
      {/* Overlay with blur effect */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-amber-400 mb-2 font-['redHatDisplay'] text-left">
            Brain Forge Communities
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-transparent"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map((community) => (
            <CommunityCard
              key={community.id}
              name={community.name}
              description={community.description}
              category={community.category}
              memberCount={community.memberCount}
              discordLink={community.discordLink}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Community;