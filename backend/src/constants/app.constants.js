const APP_CONSTANTS = {
  FILE_UPLOAD: {
    DESTINATION: 'public/uploads',
    MAX_FILE_SIZE: 2 * 1024 * 1024, // 2MB
    ALLOWED_MIME_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  },

  REVIEW: {
    MIN_RATING: 1,
    MAX_RATING: 5,
  },

  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
  },
};

module.exports = APP_CONSTANTS;
