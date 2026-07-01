'use client';

import React, { useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createCompany, fetchCompanies } from '@/store/slices/companySlice';

interface AddCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddCompanyModal({ isOpen, onClose }: AddCompanyModalProps) {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.company);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    city: '',
    foundedOn: '',
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Company name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.foundedOn) newErrors.foundedOn = 'Founded date is required';
    if (!logoFile) newErrors.logo = 'Company logo is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('location', formData.location);
    data.append('city', formData.city);
    data.append('foundedOn', new Date(formData.foundedOn).toISOString());
    if (logoFile) data.append('logo', logoFile);

    const result = await dispatch(createCompany(data));
    if (createCompany.fulfilled.match(result)) {
      setFormData({ name: '', description: '', location: '', city: '', foundedOn: '' });
      setLogoFile(null);
      setErrors({});
      onClose();
      dispatch(fetchCompanies());
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
          <h2 className="modal-title">Add Company</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form className="modal-body" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="add-company-name">Company Name</label>
            <input
              type="text"
              id="add-company-name"
              name="name"
              placeholder="Enter"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="add-company-description">Description</label>
            <textarea
              id="add-company-description"
              name="description"
              placeholder="Enter company description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
            {errors.description && <span className="form-error">{errors.description}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="add-company-location">Location</label>
            <input
              type="text"
              id="add-company-location"
              name="location"
              placeholder="Select Location"
              value={formData.location}
              onChange={handleChange}
            />
            {errors.location && <span className="form-error">{errors.location}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="add-company-founded">Founded On</label>
            <input
              type="date"
              id="add-company-founded"
              name="foundedOn"
              value={formData.foundedOn}
              onChange={handleChange}
            />
            {errors.foundedOn && <span className="form-error">{errors.foundedOn}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="add-company-city">City</label>
            <input
              type="text"
              id="add-company-city"
              name="city"
              placeholder="Enter city"
              value={formData.city}
              onChange={handleChange}
            />
            {errors.city && <span className="form-error">{errors.city}</span>}
          </div>

          <div className="form-group">
            <label>Company Logo</label>
            <div
              className="file-upload-area"
              onClick={() => fileInputRef.current?.click()}
            >
              {logoFile ? (
                <span className="file-name">{logoFile.name}</span>
              ) : (
                <span className="file-placeholder">Click to upload logo</span>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setLogoFile(file);
                  if (errors.logo) setErrors((prev) => ({ ...prev, logo: '' }));
                }}
                style={{ display: 'none' }}
              />
            </div>
            {errors.logo && <span className="form-error">{errors.logo}</span>}
          </div>

          <div className="modal-footer">
            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
              id="save-company-btn"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
