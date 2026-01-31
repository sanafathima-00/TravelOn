/**
 * User Model
 * Supports 3 roles: tourist, local, admin
 * Stores authentication, profile, and preferences
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    // Basic Info
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      minlength: [2, 'First name must be at least 2 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      minlength: [2, 'Last name must be at least 2 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },

    phone: {
      type: String,
      match: [/^[0-9]{10,}$/, 'Please provide a valid phone number'],
    },

    avatar: {
      type: String,
      default: 'https://via.placeholder.com/150',
    },

    // Role-based access
    role: {
      type: String,
      enum: ['tourist', 'local', 'admin'],
      default: 'tourist',
    },

    // Local-specific fields
    isLocalVerified: {
      type: Boolean,
      default: false,
    },
    localBio: String,
    localSince: Date,

    // Address
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },

    // Location (OPTIONAL – FIXED)
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: undefined,
        validate: {
          validator: function (v) {
            // Allow empty, validate only if provided
            return !v || v.length === 2;
          },
          message: 'Coordinates must be [longitude, latitude]',
        },
      },
    },

    // Preferences
    preferences: {
      currency: { type: String, default: 'USD' },
      language: { type: String, default: 'en' },
      notifications: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
      },
    },

    // Account Status
    isActive: {
      type: Boolean,
      default: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },

    verificationToken: String,
    verificationTokenExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,

    // Social links
    socialLinks: {
      twitter: String,
      instagram: String,
      facebook: String,
    },

    // Ratings & Stats
    averageRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },

    lastLogin: Date,
  },
  {
    timestamps: true,
    indexes: [{ location: '2dsphere' }],
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Full name helper
userSchema.methods.getFullName = function () {
  return `${this.firstName} ${this.lastName}`;
};

module.exports = mongoose.model('User', userSchema);
