import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  creatorId: { type: String },
  creatorName: { type: String },
  tags: [String],
  selectedFile: String,
  comments: { type: [String], default: [] },
  likes: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

export default mongoose.model("Post", postSchema);
