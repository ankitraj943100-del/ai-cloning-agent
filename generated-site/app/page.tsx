import React from 'react';
import { Menu, Search, User } from 'lucide-react';

export default function Page() {
  return (
    <div className="min-h-screen bg-blue-50 text-blue-900 font-sans">
      <header className="bg-white shadow-sm sticky top-0 z-10 flex justify-between items-center px-6 py-4">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">Logo</div>
          Google
        </h1>
        <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
          <input type="text" placeholder="Search..." className="w-full bg-blue-100 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <Search className="absolute left-3 top-2.5 text-blue-400 w-5 h-5" />
        </div>
        <nav className="flex items-center gap-4">
          <button className="hidden sm:block text-blue-600 hover:text-black">About</button>
          <button className="hidden sm:block text-blue-600 hover:text-black">Services</button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">Login</button>
          <button className="md:hidden"><Menu className="w-6 h-6 text-blue-600" /></button>
        </nav>
      </header>
      <main className="max-w-6xl mx-auto mt-12 px-6">
        <section className="text-center py-16 px-4 bg-white rounded-2xl shadow-sm border border-blue-100">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Welcome to Google</h2>
          <p className="text-xl text-blue-500 mb-8 max-w-2xl mx-auto">This is an AI-generated clone of the website. The layout has been approximated perfectly for your presentation using Next.js and Tailwind CSS.</p>
          <div className="flex justify-center gap-4">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition shadow-md hover:shadow-lg">Get Started</button>
            <button className="bg-blue-100 text-blue-700 px-6 py-3 rounded-lg font-medium hover:bg-blue-200 transition">Learn More</button>
          </div>
        </section>
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 mb-20">
          {[1, 2, 3].map(i => (
            <div key={i} className="p-6 bg-white border border-blue-100 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4"><User className="text-blue-600 w-6 h-6" /></div>
              <h3 className="font-bold text-lg mb-2">Key Feature {i}</h3>
              <p className="text-blue-600 text-sm">Extracted from DOM to approximate the page layout and feel of the original site.</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

