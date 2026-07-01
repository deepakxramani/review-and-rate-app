'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppDispatch } from '@/store/hooks';
import { setFilters, fetchCompanies } from '@/store/slices/companySlice';

export default function Navbar() {
  const dispatch = useAppDispatch();
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setFilters({ search: searchValue }));
    dispatch(fetchCompanies());
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link href="/" className="navbar-logo">
          <span className="logo-icon">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </span>
          <span className="logo-text">
            Review<span className="logo-ampersand">&amp;</span>
            <span className="logo-rate">RATE</span>
          </span>
        </Link>

        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="search-input"
            id="navbar-search-input"
          />
          <button type="submit" className="search-btn" aria-label="Search">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </button>
        </form>

        <nav className="navbar-links">
          <Link href="#" className="nav-link">SignUp</Link>
          <Link href="#" className="nav-link">Login</Link>
        </nav>
      </div>
    </header>
  );
}
