import React, { useState } from 'react';
import { Menu, X, Mail, Phone, Github, Linkedin, ExternalLink } from 'lucide-react';

const Layout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navigation = [
    { name: 'Home', href: '#' },
    { name: 'Research', href: '#research' },
    { name: 'Publications', href: '#publications' },
    { name: 'Projects', href: '#projects' },
    { name: 'CV', href: '#cv' },
    { name: 'Contact', href: '#contact' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-semibold text-gray-800">Ashwin Sathish Kumar</span>
              </div>
            </div>
            
            {/* Desktop nav */}
            <div className="hidden md:flex md:items-center md:space-x-6">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  {item.name}
                </a>
              ))}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-gray-900"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Ashwin Sathish Kumar
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
              Int. MSc. Mathematics and B.E. Electronics & Instrumentation
              <br />
              Birla Institute of Technology & Science, Pilani
            </p>
            <div className="mt-6 flex justify-center space-x-6">
              <a href="mailto:ashwins2003@hotmail.com" className="text-gray-600 hover:text-gray-900">
                <Mail size={24} />
              </a>
              <a href="tel:+919884916260" className="text-gray-600 hover:text-gray-900">
                <Phone size={24} />
              </a>
              <a href="https://github.com/ashwinsathish" className="text-gray-600 hover:text-gray-900">
                <Github size={24} />
              </a>
              <a href="https://www.linkedin.com/in/ashwins-860442226/" className="text-gray-600 hover:text-gray-900">
                <Linkedin size={24} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Research Interests */}
      <section id="research" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Research Interests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              'Wireless Communications',
              'Intelligent Reflecting Surfaces',
              'Photonic Crystals',
              'Biosensors',
              'Surface Plasmon Resonance',
              'Deep Learning'
            ].map((interest) => (
              <div key={interest} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-gray-900">{interest}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Publications */}
      <section id="publications" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Publications</h2>
          <div className="space-y-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900">LiDAR-Enabled Spatial Awareness for Beamforming in IRS-Assisted Wireless Communication System</h3>
              <p className="mt-2 text-gray-600">
                Ashwin S., Sandeep J. <br />
                IEEE International Conference on Advanced Networks and Telecommunications Systems (ANTS), 2024
              </p>
              <a href="#" className="inline-flex items-center mt-4 text-blue-600 hover:text-blue-800">
                Read more <ExternalLink size={16} className="ml-1" />
              </a>
            </div>
            {/* Add more publications similarly */}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900">Aerial IRS-assisted Wireless Communications</h3>
              <p className="mt-4 text-gray-600">
                Implemented Monte Carlo simulations for aerial IRS-assisted system with Nakagami-m fading and Inverse Gamma shadowing...
              </p>
              <a href="#" className="inline-flex items-center mt-4 text-blue-600 hover:text-blue-800">
                Learn more <ExternalLink size={16} className="ml-1" />
              </a>
            </div>
            {/* Add more projects similarly */}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Contact</h2>
          <div className="bg-gray-50 p-8 rounded-lg max-w-3xl mx-auto">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Mail className="text-gray-600" />
                <a href="mailto:ashwins2003@hotmail.com" className="text-gray-600 hover:text-gray-900">
                  ashwins2003@hotmail.com
                </a>
              </div>
              <div className="flex items-center space-x-4">
                <Phone className="text-gray-600" />
                <a href="tel:+919884916260" className="text-gray-600 hover:text-gray-900">
                  +91 9884916260
                </a>
              </div>
              <div className="flex items-center space-x-4">
                <Github className="text-gray-600" />
                <a href="https://github.com/ashwinsathish" className="text-gray-600 hover:text-gray-900">
                  github.com/ashwinsathish
                </a>
              </div>
              <div className="flex items-center space-x-4">
                <Linkedin className="text-gray-600" />
                <a href="https://www.linkedin.com/in/ashwins-860442226/" className="text-gray-600 hover:text-gray-900">
                  LinkedIn Profile
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-400">
            © {new Date().getFullYear()} Ashwin Sathish Kumar. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;