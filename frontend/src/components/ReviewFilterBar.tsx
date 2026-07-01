'use client';

import React, { useState } from 'react';

interface ReviewFilterBarProps {
  onFilter: (filters: { date?: string; rating?: string; sortBy?: string }) => void;
  onAddCompanyClick: () => void;
}

export default function ReviewFilterBar({ onFilter, onAddCompanyClick }: ReviewFilterBarProps) {
  const [date, setDate] = useState('');
  const [rating, setRating] = useState('');

  const handleFindReview = () => {
    onFilter({ date, rating });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilter({ sortBy: e.target.value });
  };

  return (
    <div className="filter-bar">
      <div className="filter-left">
        <button className="btn btn-primary btn-outlined" onClick={onAddCompanyClick} id="detail-add-company-btn">
          + Add Company
        </button>

        <div className="filter-group">
          <label className="filter-label" htmlFor="review-date-filter">Date</label>
          <div className="city-input-wrapper">
            <input
              type="date"
              id="review-date-filter"
              className="city-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-label" htmlFor="review-rating-filter">Rating</label>
          <select
            id="review-rating-filter"
            className="sort-select"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          >
            <option value="">All</option>
            <option value="5">5</option>
            <option value="4.5">4.5</option>
            <option value="4">4</option>
            <option value="3.5">3.5</option>
            <option value="3">3</option>
            <option value="2.5">2.5</option>
            <option value="2">2</option>
            <option value="1.5">1.5</option>
            <option value="1">1</option>
          </select>
        </div>

        <button className="btn btn-primary" onClick={handleFindReview} id="find-review-btn">
          Find Review
        </button>
      </div>

      <div className="filter-right">
        <div className="filter-group">
          <label className="filter-label" htmlFor="review-sort-select">Sort:</label>
          <select
            id="review-sort-select"
            className="sort-select"
            onChange={handleSortChange}
            defaultValue="createdAt"
          >
            <option value="createdAt">Date</option>
            <option value="fullName">Name</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      </div>
    </div>
  );
}
