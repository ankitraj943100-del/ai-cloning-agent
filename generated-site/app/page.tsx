"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";

export default function GoogleHomepage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [showAppsMenu, setShowAppsMenu] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  const appsRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node)
      ) {
        setShowSettings(false);
      }
      if (
        appsRef.current &&
        !appsRef.current.contains(event.target as Node)
      ) {
        setShowAppsMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `https://www.google.com/search?q=${encodeURIComponent(
        searchQuery
      )}`;
    }
  };

  const handleLucky = () => {
    if (searchQuery.trim()) {
      window.location.href = `https://www.google.com/search?q=${encodeURIComponent(
        searchQuery
      )}&btnI=I`;
    } else {
      window.location.href = "https://doodles.google/";
    }
  };

  const languages = [
    { name: "हिन्दी", href: "#" },
    { name: "বাংলা", href: "#" },
    { name: "తెలుగు", href: "#" },
    { name: "मराठी", href: "#" },
    { name: "தமிழ்", href: "#" },
    { name: "ગુજરાતી", href: "#" },
    { name: "ಕನ್ನಡ", href: "#" },
    { name: "മലയാളം", href: "#" },
    { name: "ਪੰਜਾਬੀ", href: "#" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white text-[#202124] font-sans antialiased select-none">
      {/* Top Header */}
      <header className="flex items-center justify-between px-6 py-3.5 text-[13px] text-[#1f1f1f]">
        {/* Left Nav */}
        <div className="flex items-center space-x-4">
          <a
            href="https://about.google/"
            className="hover:underline text-[14px] text-[#1f1f1f] p-1"
          >
            About
          </a>
          <a
            href="https://store.google.com/"
            className="hover:underline text-[14px] text-[#1f1f1f] p-1"
          >
            Store
          </a>
        </div>

        {/* Right Nav */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <a
            href="https://mail.google.com"
            className="hover:underline text-[13px] text-[#1f1f1f] py-1 px-1"
          >
            Mymail
          </a>
          <a
            href="https://www.google.com/imghp"
            className="hover:underline text-[13px] text-[#1f1f1f] py-1 px-1"
          >
            Images
          </a>

          {/* Google Apps 9-dots button */}
          <div className="relative" ref={appsRef}>
            <button
              onClick={() => setShowAppsMenu(!showAppsMenu)}
              title="Google apps"
              aria-label="Google apps"
              className="p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
            >
              <svg
                className="w-6 h-6 text-[#5f6368]"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <circle cx="6" cy="6" r="2" />
                <circle cx="12" cy="6" r="2" />
                <circle cx="18" cy="6" r="2" />
                <circle cx="6" cy="12" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="18" cy="12" r="2" />
                <circle cx="6" cy="18" r="2" />
                <circle cx="12" cy="18" r="2" />
                <circle cx="18" cy="18" r="2" />
              </svg>
            </button>

            {/* Apps Menu Dropdown */}
            {showAppsMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-3xl shadow-xl border border-gray-200 p-4 z-50 grid grid-cols-3 gap-y-4 text-center text-xs text-gray-700">
                <a
                  href="https://account.google.com"
                  className="flex flex-col items-center p-2 rounded-2xl hover:bg-blue-50/50"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg mb-1">
                    G
                  </div>
                  Account
                </a>
                <a
                  href="https://www.google.com"
                  className="flex flex-col items-center p-2 rounded-2xl hover:bg-blue-50/50"
                >
                  <div className="w-10 h-10 flex items-center justify-center mb-1">
                    <svg className="w-8 h-8" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  </div>
                  Search
                </a>
                <a
                  href="https://maps.google.com"
                  className="flex flex-col items-center p-2 rounded-2xl hover:bg-blue-50/50"
                >
                  <div className="w-10 h-10 flex items-center justify-center mb-1 text-2xl">
                    🗺️
                  </div>
                  Maps
                </a>
                <a
                  href="https://youtube.com"
                  className="flex flex-col items-center p-2 rounded-2xl hover:bg-blue-50/50"
                >
                  <div className="w-10 h-10 flex items-center justify-center mb-1 text-2xl">
                    ▶️
                  </div>
                  YouTube
                </a>
                <a
                  href="https://news.google.com"
                  className="flex flex-col items-center p-2 rounded-2xl hover:bg-blue-50/50"
                >
                  <div className="w-10 h-10 flex items-center justify-center mb-1 text-2xl">
                    📰
                  </div>
                  News
                </a>
                <a
                  href="https://mail.google.com"
                  className="flex flex-col items-center p-2 rounded-2xl hover:bg-blue-50/50"
                >
                  <div className="w-10 h-10 flex items-center justify-center mb-1 text-2xl">
                    ✉️
                  </div>
                  Mymail
                </a>
              </div>
            )}
          </div>

          {/* Sign In Button */}
          <a
            href="https://accounts.google.com/ServiceLogin"
            className="inline-flex items-center justify-center bg-[#0b57d0] hover:bg-[#1b66df] text-white text-[14px] font-medium px-6 py-2 rounded-full transition-colors shadow-sm"
          >
            Sign in
          </a>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 -mt-20 sm:-mt-14">
        {/* Google Logo */}
        <div className="mb-7 select-none">
          <div className="flex items-center text-[84px] sm:text-[92px] tracking-[-3px] font-medium leading-none">
            <span className="text-[#4285F4]">G</span>
            <span className="text-[#EA4335]">o</span>
            <span className="text-[#FBBC05]">o</span>
            <span className="text-[#4285F4]">g</span>
            <span className="text-[#34A853]">l</span>
            <span className="text-[#EA4335] -ml-0.5">e</span>
          </div>
        </div>

        {/* Search Bar Form */}
        <form onSubmit={handleSearch} className="w-full max-w-[584px]">
          <div className="relative flex items-center w-full h-[46px] rounded-full border border-[#dfe1e5] hover:border-transparent hover:shadow-[0_1px_6px_rgba(32,33,36,0.28)] focus-within:border-transparent focus-within:shadow-[0_1px_6px_rgba(32,33,36,0.28)] transition-all bg-white px-4">
            {/* Search Icon */}
            <Search className="w-5 h-5 text-[#9aa0a6] shrink-0 mr-3" />

            {/* Input field */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-full bg-transparent outline-none text-[#202124] text-[16px]"
              autoFocus
            />

            {/* Clear button if text exists */}
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="p-1 hover:bg-gray-100 rounded-full mr-2 text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Mic and Lens Icons Container */}
            <div className="flex items-center space-x-3 shrink-0 ml-1">
              {/* Google Voice / Mic */}
              <button
                type="button"
                title="Search by voice"
                className="focus:outline-none p-1 hover:opacity-80 transition-opacity"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#4285f4"
                    d="m12 15c1.66 0 3-1.34 3-3V6c0-1.66-1.34-3-3-3S9 4.34 9 6v6c0 1.66 1.34 3 3 3z"
                  />
                  <path fill="#34a853" d="M11 18.92h2V22h-2z" />
                  <path
                    fill="#fbbc05"
                    d="M7.05 12.05c0 2.73 2.22 4.95 4.95 4.95v-2c-1.63 0-2.95-1.32-2.95-2.95h-2z"
                  />
                  <path
                    fill="#ea4335"
                    d="M16.95 12.05c0 1.63-1.32 2.95-2.95 2.95v2c2.73 0 4.95-2.22 4.95-4.95h-2z"
                  />
                </svg>
              </button>

              {/* Google Lens / Camera */}
              <button
                type="button"
                title="Search by image"
                className="focus:outline-none p-1 hover:opacity-80 transition-opacity"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M5 8a3 3 0 0 1 3-3h1.17l1.42-1.41A2 2 0 0 1 12 3h0a2 2 0 0 1 1.41.59L14.83 5H16a3 3 0 0 1 3 3v1a1 1 0 1 1-2 0V8a1 1 0 0 0-1-1h-1.66l-1.41-1.41A.996.996 0 0 0 12 5.34c-.27 0-.52.11-.71.29L9.88 7H8a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h4a1 1 0 1 1 0 2H8a3 3 0 0 1-3-3V8z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 9a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M19 16a3 3 0 0 1-3 3h-1a1 1 0 1 1 0-2h1a1 1 0 0 0 1-1v-1a1 1 0 1 1 2 0v1z"
                  />
                  <path fill="#34A853" d="M19 13a1 1 0 0 1-1-1V9a1 1 0 1 1 2 0v3a1 1 0 0 1-1 1z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center items-center gap-3 pt-7">
            <button
              type="submit"
              className="bg-[#f8f9fa] border border-[#f8f9fa] hover:border-[#dadce0] hover:shadow-[0_1px_1px_rgba(0,0,0,0.1)] text-[#3c4043] hover:text-[#202124] text-[14px] rounded px-4 py-2 min-w-[127px] h-9 flex items-center justify-center transition-all select-none"
            >
              Google Search
            </button>
            <button
              type="button"
              onClick={handleLucky}
              className="bg-[#f8f9fa] border border-[#f8f9fa] hover:border-[#dadce0] hover:shadow-[0_1px_1px_rgba(0,0,0,0.1)] text-[#3c4043] hover:text-[#202124] text-[14px] rounded px-4 py-2 min-w-[127px] h-9 flex items-center justify-center transition-all select-none"
            >
              I&apos;m Feeling Lucky
            </button>
          </div>
        </form>

        {/* Language Offerings */}
        <div className="text-[13px] text-[#4d5156] mt-7 text-center leading-7">
          <span>Google offered in: </span>
          {languages.map((lang, index) => (
            <React.Fragment key={lang.name}>
              <a
                href={lang.href}
                className="text-[#1a0dab] hover:underline px-1 whitespace-nowrap"
              >
                {lang.name}
              </a>
              {index < languages.length - 1 && " "}
            </React.Fragment>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#f2f2f2] text-[14px] text-[#70757a]">
        {/* Country row */}
        <div className="px-7 py-3 border-b border-[#dadce0] text-[15px] font-normal">
          India
        </div>

        {/* Links row */}
        <div className="px-7 py-3 flex flex-wrap justify-between items-center gap-y-3">
          {/* Left links */}
          <div className="flex flex-wrap space-x-6 sm:space-x-7">
            <a
              href="https://ads.google.com"
              className="hover:underline hover:text-[#3c4043]"
            >
              Advertising
            </a>
            <a
              href="https://www.google.com/services"
              className="hover:underline hover:text-[#3c4043]"
            >
              Business
            </a>
            <a
              href="https://google.com/search/howsearchworks/"
              className="hover:underline hover:text-[#3c4043]"
            >
              How Search works
            </a>
          </div>

          {/* Right links */}
          <div className="flex flex-wrap space-x-6 sm:space-x-7 relative" ref={settingsRef}>
            <a
              href="https://policies.google.com/privacy"
              className="hover:underline hover:text-[#3c4043]"
            >
              Privacy
            </a>
            <a
              href="https://policies.google.com/terms"
              className="hover:underline hover:text-[#3c4043]"
            >
              Terms
            </a>

            <button
              type="button"
              onClick={() => setShowSettings(!showSettings)}
              className="hover:underline hover:text-[#3c4043] focus:outline-none flex items-center"
            >
              Settings
            </button>

            {/* Settings Dropdown Popover */}
            {showSettings && (
              <div className="absolute right-0 bottom-8 mb-2 w-48 bg-white border border-[#dadce0] rounded-lg shadow-lg py-2 z-50 text-[13px] text-[#3c4043]">
                <a
                  href="https://www.google.com/preferences"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Search settings
                </a>
                <a
                  href="https://www.google.com/advanced_search"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Advanced search
                </a>
                <a
                  href="https://myactivity.google.com/privacyadvisor/search"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Your data in Search
                </a>
                <a
                  href="https://myactivity.google.com/product/search"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Search history
                </a>
                <a
                  href="https://support.google.com/websearch"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Search help
                </a>
              </div>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
