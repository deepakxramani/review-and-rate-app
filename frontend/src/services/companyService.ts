import api from './api';

export interface Company {
  _id: string;
  name: string;
  logo: string;
  description: string;
  location: string;
  city: string;
  foundedOn: string;
  averageRating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyFilters {
  search?: string;
  city?: string;
  sortBy?: string;
  order?: string;
  page?: number;
  limit?: number;
}

export interface CompanyPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetCompaniesResponse {
  companies: Company[];
  pagination: CompanyPagination;
}

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
}

const companyService = {
  getCompanies: async (params: CompanyFilters = {}) => {
    const response = await api.get<ApiResponse<GetCompaniesResponse>>(
      '/companies',
      { params }
    );
    return response.data.data;
  },

  getCompanyById: async (id: string) => {
    const response = await api.get<ApiResponse<Company>>(`/companies/${id}`);
    return response.data.data;
  },

  createCompany: async (formData: FormData) => {
    const response = await api.post<ApiResponse<Company>>(
      '/companies',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data.data;
  },
};

export default companyService;
