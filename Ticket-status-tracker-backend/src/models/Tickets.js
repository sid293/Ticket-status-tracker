import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: {
    type: String,
    enum: ["Open", "In Progress", "Review", "Testing", "Done"],
    default: "Open"
  },
  statusHistory: [
    {
      status: String,
      timestamp: { type: Date, default: Date.now }
    }
  ],
  owner: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Ticket", ticketSchema);
