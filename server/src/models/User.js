const mongoose = require('mongoose');

const preferencesSchema = new mongoose.Schema(
  {
    lastCompany: { type: String, default: '' },
    lastFile: { type: String, default: '5. All.csv' },
    difficultyFilter: { type: String, default: 'ALL' },
    searchText: { type: String, default: '' },
    currentPage: { type: Number, default: 1, min: 1 },
    pageSize: { type: Number, default: 25, min: 10, max: 100 },
    preferredLanguage: { type: String, default: 'python' },
  },
  { _id: false }
);

const solvedActivitySchema = new mongoose.Schema(
  {
    questionId: { type: String, required: true },
    solvedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const bookmarkedActivitySchema = new mongoose.Schema(
  {
    questionId: { type: String, required: true },
    bookmarkedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    authProvider: {
      type: String,
      enum: ['google', 'local'],
      default: 'google',
    },
    googleId: {
      type: String,
      default: null,
    },
    avatar: {
      type: String,
      default: '',
    },
    passwordHash: {
      type: String,
      default: null,
    },
    solvedQuestionIds: {
      type: [String],
      default: [],
    },
    solvedActivity: {
      type: [solvedActivitySchema],
      default: [],
    },
    bookmarkedQuestionIds: {
      type: [String],
      default: [],
    },
    bookmarkedActivity: {
      type: [bookmarkedActivitySchema],
      default: [],
    },
    preferences: {
      type: preferencesSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
