import mongoose from "mongoose";

const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  userId: { type: String, required: true },
  status: { type: String, required: true },
  amount: { type: Number, required: true },
  verified: { type: Boolean, default: false },
});

const Transaction = mongoose.model("transaction", transactionSchema);
export default Transaction;
