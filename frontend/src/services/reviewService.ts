import api from './api';
import { Company } from './companyService';

export interface Review {
  _id: string;
  company: string;
  fullName: string;
  subject: string;
  review: string;
  rating: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewData {
  fullName: string;
  subject: string;
  review: string;
  rating: number;
}

export interface GetReviewsResponse {
  company: Company;
  reviews: Review[];
}

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
}

const reviewService = {
  getReviews: async (companyId: string, params: { page?: number; limit?: number } = {}) => {
    const response = await api.get<ApiResponse<GetReviewsResponse>>(
      `/companies/${companyId}/reviews`,
      { params }
    );
    return response.data.data;
  },

  createReview: async (companyId: string, data: CreateReviewData) => {
    const response = await api.post<ApiResponse<Review>>(
      `/companies/${companyId}/reviews`,
      data
    );
    return response.data.data;
  },
};

export default reviewService;
