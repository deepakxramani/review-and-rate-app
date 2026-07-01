'use client';

import React from 'react';
import Link from 'next/link';
import StarRating from './StarRating';
import { Company } from '@/services/companyService';

interface CompanyCardProps {
  company: Company;
}

export default function CompanyCard({ company }: CompanyCardProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  const logoUrl = company.logo
    ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '')}${company.logo}`
    : null;

  // Generate initials as fallback
  const initials = company.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="company-card" id={`company-card-${company._id}`}>
      <div className="company-card-left">
        <div className="company-logo">
          {logoUrl ? (
            <img src={logoUrl} alt={company.name} />
          ) : (
            <span className="company-logo-initials">{initials}</span>
          )}
        </div>

        <div className="company-info">
          <h3 className="company-name">{company.name}</h3>
          <p className="company-address">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#999" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {company.location}
          </p>
          <div className="company-rating">
            <span className="rating-number">{company.averageRating.toFixed(1)}</span>
            <StarRating rating={company.averageRating} size="sm" />
            {company.totalReviews > 0 && (
              <span className="review-count">{company.totalReviews} Reviews</span>
            )}
          </div>
        </div>
      </div>

      <div className="company-card-right">
        <span className="company-date">
          {company.foundedOn ? `Founded on ${formatDate(company.foundedOn)}` : ''}
        </span>
        <Link href={`/companies/${company._id}`} className="btn btn-dark" id={`detail-review-${company._id}`}>
          Detail Review
        </Link>
      </div>
    </div>
  );
}
