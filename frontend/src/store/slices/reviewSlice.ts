import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import reviewService, { Review, CreateReviewData } from '@/services/reviewService';

interface ReviewState {
  reviews: Review[];
  loading: boolean;
  creating: boolean;
  error: string | null;
}

const initialState: ReviewState = {
  reviews: [],
  loading: false,
  creating: false,
  error: null,
};

// Thunks
export const fetchReviews = createAsyncThunk(
  'review/fetchReviews',
  async (companyId: string, { rejectWithValue }) => {
    try {
      const result = await reviewService.getReviews(companyId);
      return result.reviews;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch reviews'
      );
    }
  }
);

export const createReview = createAsyncThunk(
  'review/createReview',
  async (
    { companyId, data }: { companyId: string; data: CreateReviewData },
    { rejectWithValue }
  ) => {
    try {
      return await reviewService.createReview(companyId, data);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to create review'
      );
    }
  }
);

const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    clearReviews: (state) => {
      state.reviews = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchReviews
    builder.addCase(fetchReviews.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchReviews.fulfilled, (state, action) => {
      state.loading = false;
      state.reviews = action.payload;
    });
    builder.addCase(fetchReviews.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // createReview
    builder.addCase(createReview.pending, (state) => {
      state.creating = true;
      state.error = null;
    });
    builder.addCase(createReview.fulfilled, (state, action) => {
      state.creating = false;
      state.reviews.unshift(action.payload);
    });
    builder.addCase(createReview.rejected, (state, action) => {
      state.creating = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearReviews, clearError } = reviewSlice.actions;
export default reviewSlice.reducer;
