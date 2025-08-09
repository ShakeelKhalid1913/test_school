import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser, UserRole, AssessmentLevel } from '../types';

/**
 * User Schema for the Test School platform
 * Handles authentication, user management, and test progress tracking
 */
const userSchema = new Schema<IUser>({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email address'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false // Don't include password in queries by default
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.STUDENT
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String,
    select: false
  },
  passwordResetToken: {
    type: String,
    select: false
  },
  passwordResetExpires: {
    type: Date,
    select: false
  },
  otpCode: {
    type: String,
    select: false
  },
  otpExpires: {
    type: Date,
    select: false
  },
  currentLevel: {
    type: String,
    enum: Object.values(AssessmentLevel),
    default: null
  },
  canTakeTest: {
    type: Boolean,
    default: true
  },
  lastTestAttempt: {
    type: Date,
    default: null
  },
  phone: {
    type: String,
    default: null
  },
  organization: {
    type: String,
    default: null
  },
  position: {
    type: String,
    default: null
  },
  country: {
    type: String,
    default: null
  },
  city: {
    type: String,
    default: null
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      const { password, emailVerificationToken, passwordResetToken, passwordResetExpires, otpCode, otpExpires, ...safeUser } = ret;
      return safeUser;
    }
  },
  toObject: { virtuals: true }
});

/**
 * Hash password before saving user
 */
userSchema.pre('save', async function(next) {
  // Only hash password if it's been modified
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

/**
 * Compare entered password with hashed password
 */
userSchema.methods.comparePassword = async function(enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * Generate password reset token
 */
userSchema.methods.generatePasswordResetToken = function(): string {
  const resetToken = Math.random().toString(36).substring(2, 15) + 
                    Math.random().toString(36).substring(2, 15);
  
  this.passwordResetToken = resetToken;
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  
  return resetToken;
};

/**
 * Generate OTP code for verification
 */
userSchema.methods.generateOTP = function(): string {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  
  this.otpCode = otp;
  this.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  
  return otp;
};

/**
 * Check if user can take a test based on their level and previous attempts
 */
userSchema.methods.canTakeTestStep = function(step: number): boolean {
  // If user failed Step 1, they cannot retake
  if (!this.canTakeTest) {
    return false;
  }

  // Logic for determining if user can take specific test step
  switch (step) {
    case 1:
      return this.currentLevel === null || this.currentLevel === AssessmentLevel.A1 || this.currentLevel === AssessmentLevel.A2;
    case 2:
      return this.currentLevel === AssessmentLevel.A2 || this.currentLevel === AssessmentLevel.B1 || this.currentLevel === AssessmentLevel.B2;
    case 3:
      return this.currentLevel === AssessmentLevel.B2 || this.currentLevel === AssessmentLevel.C1 || this.currentLevel === AssessmentLevel.C2;
    default:
      return false;
  }
};

/**
 * Get user's full name
 */
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ currentLevel: 1 });
userSchema.index({ isEmailVerified: 1 });

const User = mongoose.model<IUser>('User', userSchema);

export default User;
