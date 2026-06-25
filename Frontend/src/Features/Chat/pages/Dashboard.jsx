import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../Auth/hooks/useAuth";
import { useChat } from "../hooks/useChat";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, handleLogout } = useAuth();
  const chat = useChat();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFocus, setSelectedFocus] = useState("All");

  useEffect(() => {
    chat.initializeSocketConnection();
  }, []);

  const handleSignOut = async () => {
    await handleLogout();
    navigate("/login");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    alert(`Searching for: "${searchQuery}" with focus: "${selectedFocus}"`);
    setSearchQuery("");
  };

  const focusOptions = ["All", "Academic", "Writing", "YouTube", "Reddit"];
  const suggestions = [
    { title: "Clean Tailwind layouts", desc: "Guidelines for minimalist design" },
    { title: "Quantum mechanics explanation", desc: "Simplified for everyday terms" },
    { title: "AI productivity startup names", desc: "Brainstorm descriptive names" },
    { title: "Camera specification breakdown", desc: "Compare flagship phone lenses" },
  ];

  return (
    <div className="min-h-screen flex bg-zinc-950 text-zinc-100 antialiased font-sans overflow-hidden w-full">
      
      {/* Sidebar Layout */}
      <aside className="w-60 border-r border-zinc-900 bg-zinc-950 p-6 flex flex-col justify-between hidden md:flex flex-shrink-0 z-20 animate-fade-in">
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-zinc-200">
              <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="4" />
              <path d="M12 20H28M20 12V28" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            </svg>
            <span className="font-display font-bold text-base text-zinc-100 tracking-tight">
              perplexity
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <a href="#" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-zinc-900 text-zinc-100 font-semibold text-xs transition-colors">
              <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </a>
            <a href="#" onClick={(e) => e.preventDefault()} className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-zinc-500 hover:text-zinc-300 font-medium text-xs transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Discover
            </a>
            <a href="#" onClick={(e) => e.preventDefault()} className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-zinc-500 hover:text-zinc-300 font-medium text-xs transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20" />
              </svg>
              Library
            </a>
          </nav>
        </div>

        {/* User Card */}
        <div className="border-t border-zinc-900 pt-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-100 flex items-center justify-center font-bold text-xs">
              {user.username ? user.username.substring(0, 2).toUpperCase() : "US"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-zinc-200 truncate">{user.username}</p>
              <p className="text-[10px] text-zinc-600 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 bg-transparent hover:bg-zinc-900 hover:text-zinc-100 text-zinc-500 text-xs font-medium py-2 rounded-xl border border-zinc-900 hover:border-zinc-800 transition-colors cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Layout */}
      <main className="flex-1 flex flex-col min-h-screen relative overflow-y-auto z-10 animate-fade-in">
        
        {/* Verification Alert Banner */}
        {!user.verified && (
          <div className="bg-amber-950/10 border-b border-amber-900/30 px-6 py-3 flex items-center justify-between gap-4 text-amber-400 text-xs font-medium">
            <div className="flex items-center gap-2">
              <span>✉️</span>
              <p>
                Email is unverified. Check <span className="text-amber-200 font-semibold">{user.email}</span> for your verification link.
              </p>
            </div>
            <button className="text-[10px] font-semibold px-2.5 py-1.5 bg-amber-500/5 hover:bg-amber-500/10 text-amber-300 rounded-lg border border-amber-500/10 transition-colors">
              Resend
            </button>
          </div>
        )}

        {/* Mobile Navbar Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-zinc-900 bg-zinc-950">
          <div className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-zinc-200">
              <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="4" />
              <path d="M12 20H28M20 12V28" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            </svg>
            <span className="font-display font-bold text-base text-zinc-100 tracking-tight">perplexity</span>
          </div>
          <button
            onClick={handleSignOut}
            className="text-[10px] font-semibold px-2.5 py-1.5 bg-transparent border border-zinc-900 rounded-xl text-zinc-400 hover:text-zinc-200"
          >
            Sign Out
          </button>
        </header>

        {/* Center Search Interface */}
        <div className="flex-1 max-w-[680px] mx-auto w-full px-6 py-12 md:py-24 flex flex-col justify-center items-center">
          
          <h2 className="text-3xl font-display font-medium text-zinc-100 mb-8 tracking-tight text-center">
            Where knowledge comes at a Prompt
          </h2>

          {/* Search Box */}
          <div className="w-full border border-zinc-900 focus-within:border-zinc-800 rounded-2xl p-4 transition-all duration-200">
            <form onSubmit={handleSearchSubmit}>
              <textarea
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ask anything..."
                rows="3"
                className="w-full bg-transparent resize-none text-zinc-200 text-sm outline-none placeholder:text-zinc-700"
              />
              <div className="flex items-center justify-between border-t border-zinc-900/60 pt-3 mt-2">
                {/* Focus Filter Select */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-[70%]">
                  {focusOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setSelectedFocus(opt)}
                      className={`text-[10px] px-2.5 py-1.5 rounded-full font-semibold transition-all ${
                        selectedFocus === opt
                          ? "bg-zinc-900 text-zinc-100 border border-zinc-800"
                          : "bg-transparent border border-transparent text-zinc-600 hover:text-zinc-400"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={!searchQuery.trim()}
                  className={`p-2 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                    searchQuery.trim()
                      ? "bg-zinc-100 text-zinc-950 hover:bg-zinc-200"
                      : "bg-transparent text-zinc-800 border border-zinc-900 cursor-not-allowed"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </form>
          </div>

          {/* Quick suggestions grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5 w-full mt-10">
            {suggestions.map((sug, i) => (
              <button
                key={i}
                onClick={() => setSearchQuery(sug.title)}
                className="border border-zinc-900 hover:border-zinc-800 text-left p-4.5 rounded-2xl transition-colors flex flex-col gap-1 cursor-pointer bg-transparent"
              >
                <span className="text-xs font-semibold text-zinc-200">{sug.title}</span>
                <span className="text-[10px] text-zinc-600 font-sans">{sug.desc}</span>
              </button>
            ))}
          </div>

        </div>

      </main>

    </div>
  );
}
