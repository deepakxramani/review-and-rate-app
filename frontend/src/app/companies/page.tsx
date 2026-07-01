'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCompanies } from '@/store/slices/companySlice';
import FilterBar from '@/components/FilterBar';
import CompanyCard from '@/components/CompanyCard';
import AddCompanyModal from '@/components/AddCompanyModal';

export default function CompaniesPage() {
  const dispatch = useAppDispatch();
  const { companies, loading, error, pagination } = useAppSelector(
    (state) => state.company
  );
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    dispatch(fetchCompanies());
  }, [dispatch]);

  return (
    <div className="page-container">
      <FilterBar onAddCompanyClick={() => setShowAddModal(true)} />

      <p className="results-info">
        Result Found: <span className="results-count">{pagination.total}</span>
      </p>

      {loading && (
        <div className="loading-container">
          <div className="spinner" />
        </div>
      )}

      {error && <div className="error-state">{error}</div>}

      {!loading && !error && companies.length === 0 && (
        <div className="empty-state">
          <h3>No companies found</h3>
          <p>Try adjusting your filters or add a new company.</p>
        </div>
      )}

      {!loading &&
        companies.map((company) => (
          <CompanyCard key={company._id} company={company} />
        ))}

      <AddCompanyModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  );
}
