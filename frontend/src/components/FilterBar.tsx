'use client';

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setFilters, fetchCompanies } from '@/store/slices/companySlice';

interface FilterBarProps {
  onAddCompanyClick: () => void;
}

export default function FilterBar({ onAddCompanyClick }: FilterBarProps) {
  const dispatch = useAppDispatch();
  const { filters } = useAppSelector((state) => state.company);
  const [cityInput, setCityInput] = useState(filters.city || '');

  const handleFindCompany = () => {
    dispatch(setFilters({ city: cityInput }));
    dispatch(fetchCompanies());
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    let sortBy = 'createdAt';
    let order = 'desc';

    switch (value) {
      case 'name':
        sortBy = 'name';
        order = 'asc';
        break;
      case 'averageRating':
        sortBy = 'averageRating';
        order = 'desc';
        break;
      case 'city':
        sortBy = 'city';
        order = 'asc';
        break;
      default:
        sortBy = 'createdAt';
        order = 'desc';
    }

    dispatch(setFilters({ sortBy, order }));
    dispatch(fetchCompanies());
  };

  return (
    <div className="filter-bar">
      <div className="filter-left">
        <div className="filter-group">
          <label className="filter-label" htmlFor="city-select">Select City</label>
          <div className="city-input-wrapper">
            <input
              type="text"
              id="city-select"
              className="city-input"
              placeholder="Enter city name"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleFindCompany()}
            />
            <span className="city-icon">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#7C3AED" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </span>
          </div>
        </div>

        <button className="btn btn-primary" onClick={handleFindCompany} id="find-company-btn">
          Find Company
        </button>

        <button className="btn btn-primary btn-outlined" onClick={onAddCompanyClick} id="add-company-btn">
          + Add Company
        </button>
      </div>

      <div className="filter-right">
        <div className="filter-group">
          <label className="filter-label" htmlFor="sort-select">Sort:</label>
          <select
            id="sort-select"
            className="sort-select"
            onChange={handleSortChange}
            defaultValue="createdAt"
          >
            <option value="name">Name</option>
            <option value="averageRating">Average Rating</option>
            <option value="city">Location</option>
            <option value="createdAt">Newest</option>
          </select>
        </div>
      </div>
    </div>
  );
}
