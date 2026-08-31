import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGenre extends Document {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  novelCount: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GenreSchema = new Schema<IGenre>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, default: "" },
    icon: { type: String, default: "" },
    color: { type: String, default: "#8b5cf6" },
    novelCount: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const Genre: Model<IGenre> =
  mongoose.models.Genre || mongoose.model<IGenre>("Genre", GenreSchema);
