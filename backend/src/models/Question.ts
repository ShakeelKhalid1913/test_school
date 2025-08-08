import mongoose, { Schema } from 'mongoose';
import { IQuestion, CompetencyArea, AssessmentLevel } from '../types';

/**
 * Question Schema for the Test School platform
 * Stores assessment questions with competency mapping
 */
const questionSchema = new Schema<IQuestion>({
  title: {
    type: String,
    required: [true, 'Question title is required'],
    trim: true,
    maxlength: [200, 'Question title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Question description is required'],
    trim: true,
    maxlength: [1000, 'Question description cannot exceed 1000 characters']
  },
  options: [{
    text: {
      type: String,
      required: [true, 'Option text is required'],
      trim: true,
      maxlength: [300, 'Option text cannot exceed 300 characters']
    },
    isCorrect: {
      type: Boolean,
      required: [true, 'Option correctness is required']
    }
  }],
  competencyArea: {
    type: String,
    enum: Object.values(CompetencyArea),
    required: [true, 'Competency area is required']
  },
  level: {
    type: String,
    enum: Object.values(AssessmentLevel),
    required: [true, 'Assessment level is required']
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator is required']
  }
}, {
  timestamps: true
});

// Validation: Ensure at least one correct answer exists
questionSchema.pre('save', function(next) {
  const hasCorrectAnswer = this.options.some(option => option.isCorrect);
  if (!hasCorrectAnswer) {
    return next(new Error('Question must have at least one correct answer'));
  }
  
  // Ensure we have 2-4 options
  if (this.options.length < 2 || this.options.length > 4) {
    return next(new Error('Question must have between 2 and 4 options'));
  }
  
  next();
});

// Indexes for better query performance
questionSchema.index({ competencyArea: 1, level: 1 });
questionSchema.index({ isActive: 1 });
questionSchema.index({ level: 1 });
questionSchema.index({ createdBy: 1 });

const Question = mongoose.model<IQuestion>('Question', questionSchema);

export default Question;
