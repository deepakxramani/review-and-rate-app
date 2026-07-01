'use client';

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createReview, fetchReviews } from '@/store/slices/reviewSlice';
import { fetchCompanyById } from '@/store/slices/companySlice';
import StarRating from './StarRating';

interface AddReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
}

export default function AddReviewModal({ isOpen, onClose, companyId }: AddReviewModalProps) {
  const dispatch = useAppDispatch();
  const { creating } = useAppSelector((state) => state.review);

  const [formData, setFormData] = useState({
    fullName: '',
    subject: '',
    review: '',
    rating: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.review.trim()) newErrors.review = 'Review is required';
    if (formData.rating === 0) newErrors.rating = 'Rating is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await dispatch(createReview({ companyId, data: formData }));
    if (createReview.fulfilled.match(result)) {
      setFormData({ fullName: '', subject: '', review: '', rating: 0 });
      setErrors({});
      onClose();
      // Refresh reviews and company data (for updated rating)
      dispatch(fetchReviews(companyId));
      dispatch(fetchCompanyById(companyId));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Add Review</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form className="modal-body" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="review-fullname">Full Name</label>
            <input
              type="text"
              id="review-fullname"
              name="fullName"
              placeholder="Enter"
              value={formData.fullName}
              onChange={handleChange}
            />
            {errors.fullName && <span className="form-error">{errors.fullName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="review-subject">Subject</label>
            <input
              type="text"
              id="review-subject"
              name="subject"
              placeholder="Enter"
              value={formData.subject}
              onChange={handleChange}
            />
            {errors.subject && <span className="form-error">{errors.subject}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="review-text">Enter your review</label>
            <textarea
              id="review-text"
              name="review"
              placeholder="Description"
              value={formData.review}
              onChange={handleChange}
              rows={4}
            />
            {errors.review && <span className="form-error">{errors.review}</span>}
          </div>

          <div className="form-group">
            <label>Rating</label>
            <div className="rating-input-row">
              <StarRating
                rating={formData.rating}
                interactive
                onRate={(rating) => {
                  setFormData((prev) => ({ ...prev, rating }));
                  if (errors.rating) setErrors((prev) => ({ ...prev, rating: '' }));
                }}
                size="lg"
              />
              {formData.rating > 0 && (
                <span className="rating-submitted-label">Selected</span>
              )}
            </div>
            {errors.rating && <span className="form-error">{errors.rating}</span>}
          </div>

          <div className="modal-footer">
            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={creating}
              id="save-review-btn"
            >
              {creating ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
