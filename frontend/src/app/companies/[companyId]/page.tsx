'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCompanyById, clearSelectedCompany } from '@/store/slices/companySlice';
import { fetchReviews, clearReviews } from '@/store/slices/reviewSlice';
import StarRating from '@/components/StarRating';
import ReviewCard from '@/components/ReviewCard';
import AddReviewModal from '@/components/AddReviewModal';
import AddCompanyModal from '@/components/AddCompanyModal';
import ReviewFilterBar from '@/components/ReviewFilterBar';

export default function CompanyDetailPage() {
  const params = useParams();
  const companyId = params.companyId as string;
  const dispatch = useAppDispatch();

  const { selectedCompany, loading: companyLoading } = useAppSelector(
    (state) => state.company
  );
  const { reviews, loading: reviewsLoading } = useAppSelector(
    (state) => state.review
  );

  const [showAddReview, setShowAddReview] = useState(false);
  const [showAddCompany, setShowAddCompany] = useState(false);
  const [filterDate, setFilterDate] = useState('');
  const [filterRating, setFilterRating] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');

  useEffect(() => {
    if (companyId) {
      dispatch(fetchCompanyById(companyId));
      dispatch(fetchReviews(companyId));
    }

    return () => {
      dispatch(clearSelectedCompany());
      dispatch(clearReviews());
    };
  }, [dispatch, companyId]);

  const logoUrl = selectedCompany?.logo
    ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '')}${selectedCompany.logo}`
    : null;

  const initials = selectedCompany?.name
    ?.split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  const handleReviewFilter = (filters: { date?: string; rating?: string; sortBy?: string }) => {
    if (filters.date !== undefined) setFilterDate(filters.date);
    if (filters.rating !== undefined) setFilterRating(filters.rating);
    if (filters.sortBy !== undefined) setSortBy(filters.sortBy);
  };

  const filteredReviews = useMemo(() => {
    let result = [...reviews];

    // Filter by date
    if (filterDate) {
      const filterDateStr = new Date(filterDate).toDateString();
      result = result.filter((r) => new Date(r.createdAt).toDateString() === filterDateStr);
    }

    // Filter by rating
    if (filterRating) {
      const ratingNum = parseFloat(filterRating);
      result = result.filter((r) => r.rating >= ratingNum);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'fullName') return a.fullName.localeCompare(b.fullName);
      if (sortBy === 'rating') return b.rating - a.rating;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  }, [reviews, filterDate, filterRating, sortBy]);

  if (companyLoading && !selectedCompany) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="spinner" />
        </div>
      </div>
    );
  }

  if (!selectedCompany) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <h3>Company not found</h3>
          <p>The company you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Review Filters */}
      <ReviewFilterBar
        onFilter={handleReviewFilter}
        onAddCompanyClick={() => setShowAddCompany(true)}
      />

      {/* Company Detail Header */}
      <div className="company-detail-header">
        <div className="company-detail-left">
          <div className="company-detail-logo">
            {logoUrl ? (
              <img src={logoUrl} alt={selectedCompany.name} />
            ) : (
              <span className="company-logo-initials">{initials}</span>
            )}
          </div>

          <div className="company-detail-info">
            <h1>{selectedCompany.name}</h1>
            <p className="company-address">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#999" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {selectedCompany.location}
            </p>
            <div className="company-rating">
              <span className="rating-number">
                {selectedCompany.averageRating.toFixed(1)}
              </span>
              <StarRating rating={selectedCompany.averageRating} size="sm" />
              <span className="review-count">
                {selectedCompany.totalReviews} Reviews
              </span>
            </div>
          </div>
        </div>

        <div className="company-detail-right">
          <span className="company-date">
            Founded on {formatDate(selectedCompany.foundedOn)}
          </span>
          <button
            className="btn btn-primary"
            onClick={() => setShowAddReview(true)}
            id="add-review-btn"
          >
            + Add Review
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <p className="reviews-section-title">
        Result Found: <span className="results-count">{filteredReviews.length}</span>
      </p>

      {reviewsLoading && (
        <div className="loading-container">
          <div className="spinner" />
        </div>
      )}

      {!reviewsLoading && filteredReviews.length === 0 && (
        <div className="empty-state">
          <h3>No reviews yet</h3>
          <p>Be the first to review this company!</p>
        </div>
      )}

      {!reviewsLoading &&
        filteredReviews.map((review) => (
          <ReviewCard key={review._id} review={review} />
        ))}

      <AddReviewModal
        isOpen={showAddReview}
        onClose={() => setShowAddReview(false)}
        companyId={companyId}
      />

      <AddCompanyModal
        isOpen={showAddCompany}
        onClose={() => setShowAddCompany(false)}
      />
    </div>
  );
}
