import React from 'react';
import { GithubIcon, InstagramIcon, LinkedinIcon, MailIcon } from './components/icons';
import type { SocialLink } from './types';
import SliderButton from './components/SliderButton';
// Fix: Import the Chatbot component to render it
import Chatbot from './components/Chatbot';

const socialLinks: SocialLink[] = [
  {
    id: 'github',
    name: 'GitHub',
    url: 'https://github.com/danishveerrana',
    icon: <GithubIcon className="w-8 h-8" />,
    color: 'from-gray-700 to-gray-900',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/danishveerrana',
    icon: <LinkedinIcon className="w-8 h-8" />,
    color: 'from-blue-600 to-blue-800',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    url: 'https://instagram.com/danishveerrana',
    icon: <InstagramIcon className="w-8 h-8" />,
    color: 'from-pink-500 to-purple-600',
  },
  {
    id: 'email',
    name: 'Email',
    url: 'mailto:veerdanish452008@gmail.com',
    icon: <MailIcon className="w-8 h-8" />,
    color: 'from-teal-500 to-cyan-600',
  },
];

const App: React.FC = () => {
  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 overflow-hidden bg-black">
      <div className="absolute top-0 left-0 -translate-x-1/3 -translate-y-1/3 w-[700px] h-[700px] rounded-full bg-purple-600 blur-3xl animate-glow1 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-[700px] h-[700px] rounded-full bg-pink-500 blur-3xl animate-glow2 pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col items-center text-center text-white">
        <img 
          src="https://unavatar.io/instagram/danishveerrana" 
          alt="Profile" 
          className="w-32 h-32 rounded-full border-4 border-white/50 shadow-2xl mb-6"
        />
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Danish Veer Rana
        </h1>
        <p className="mt-2 text-lg md:text-xl text-white/80 max-w-md">
          I'm a tech enthusiast who loves to code... and more.
        </p>

        <div className="mt-12 w-full max-w-sm flex flex-col space-y-6">
          {socialLinks.map((link) => (
            <SliderButton key={link.id} link={link} />
          ))}
        </div>
      </div>
      
      <footer className="absolute bottom-4 text-white/50 text-sm z-10">
        <p>Built with React &amp; Tailwind CSS</p>
      </footer>
      {/* Fix: Render the Chatbot component */}
      <Chatbot />
    </main>
  );
};

export default App;
