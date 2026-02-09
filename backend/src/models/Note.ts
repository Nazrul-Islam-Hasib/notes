import mongoose, { Schema, Document } from 'mongoose';

export interface INoteDocument extends Document {
  title: string;
  tags: string[];
  content: string;
  lastEdited: Date;
  isArchived: boolean;
  color?: string;
  userId: string;
}

const NoteSchema = new Schema<INoteDocument>({
  title: { type: String, required: true },
  tags: { type: [String], default: [] },
  content: { type: String, required: true },
  lastEdited: { type: Date, default: Date.now },
  isArchived: { type: Boolean, default: false },
  color: { type: String },
  userId: { type: String, required: true }
}, {
  timestamps: true
});

export const Note = mongoose.model<INoteDocument>('Note', NoteSchema);
