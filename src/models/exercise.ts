import { Schema, model, Document } from 'mongoose';

export type ExerciseDocument = Document & {
  userId: string;
  description: string;
  duration: number;
  date: Date;
};

// Matches both YYYY-MM-DD and YYYY-M-D
// const dateRegex = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/;

const exerciseSchema = new Schema(
  {
    userId: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    date: { type: Date },
  },
  {
    versionKey: false,
  }
);

export const Exercise = model<ExerciseDocument>('Exercise', exerciseSchema);
