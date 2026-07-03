'use client';

import Navbar from './Navbar';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>{children}</main>
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">K</span>
              </div>
              <span className="text-sm text-gray-500">Kcoders Portal &copy; {new Date().getFullYear()}</span>
            </div>
            <div className="flex space-x-6 text-sm text-gray-500">
              <a href="mailto:info@kcoders.org" className="hover:text-blue-600">Contact</a>
              <a href="https://kcoders.org" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                Main Site
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
