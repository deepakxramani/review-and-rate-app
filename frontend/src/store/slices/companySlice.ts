import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import companyService, {
  Company,
  CompanyFilters,
  CompanyPagination,
} from '@/services/companyService';

interface CompanyState {
  companies: Company[];
  selectedCompany: Company | null;
  loading: boolean;
  error: string | null;
  pagination: CompanyPagination;
  filters: CompanyFilters;
}

const initialState: CompanyState = {
  companies: [],
  selectedCompany: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  filters: {
    search: '',
    city: '',
    sortBy: 'createdAt',
    order: 'desc',
  },
};

// Thunks
export const fetchCompanies = createAsyncThunk(
  'company/fetchCompanies',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { company: CompanyState };
      const { filters, pagination } = state.company;
      const params: CompanyFilters = {
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
      };
      // Remove empty filter values
      Object.keys(params).forEach((key) => {
        const k = key as keyof CompanyFilters;
        if (params[k] === '' || params[k] === undefined) {
          delete params[k];
        }
      });
      return await companyService.getCompanies(params);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch companies'
      );
    }
  }
);

export const fetchCompanyById = createAsyncThunk(
  'company/fetchCompanyById',
  async (companyId: string, { rejectWithValue }) => {
    try {
      return await companyService.getCompanyById(companyId);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch company'
      );
    }
  }
);

export const createCompany = createAsyncThunk(
  'company/createCompany',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      return await companyService.createCompany(formData);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to create company'
      );
    }
  }
);

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<CompanyFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1; // reset page on filter change
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination.page = 1;
    },
    clearSelectedCompany: (state) => {
      state.selectedCompany = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchCompanies
    builder.addCase(fetchCompanies.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCompanies.fulfilled, (state, action) => {
      state.loading = false;
      state.companies = action.payload.companies;
      state.pagination = action.payload.pagination;
    });
    builder.addCase(fetchCompanies.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // fetchCompanyById
    builder.addCase(fetchCompanyById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCompanyById.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedCompany = action.payload;
    });
    builder.addCase(fetchCompanyById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // createCompany
    builder.addCase(createCompany.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createCompany.fulfilled, (state, action) => {
      state.loading = false;
      state.companies.unshift(action.payload);
    });
    builder.addCase(createCompany.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { setFilters, setPage, resetFilters, clearSelectedCompany, clearError } =
  companySlice.actions;
export default companySlice.reducer;
