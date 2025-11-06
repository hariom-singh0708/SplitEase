import { validationResult } from "express-validator";
import Transaction from "../models/Transaction.js";

export const createTransaction = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error("Invalid input");
      err.statusCode = 400;
      err.errors = errors.array();
      throw err;
    }

    const { counterpartyName, amount, type, status, date, note } = req.body;
    const tx = await Transaction.create({
      user: req.user._id,
      counterpartyName,
      amount,
      type,
      status: status || "PENDING",
      date: date || Date.now(),
      note,
    });
    res.status(201).json({ transaction: tx });
  } catch (e) {
    next(e);
  }
};

export const listTransactions = async (req, res, next) => {
  try {
    const { type, status, q } = req.query;
    const filter = { user: req.user._id };
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (q) filter.counterpartyName = { $regex: q, $options: "i" };

    const txs = await Transaction.find(filter).sort({ createdAt: -1 });
    res.json({ transactions: txs });
  } catch (e) {
    next(e);
  }
};

export const updateTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tx = await Transaction.findOne({ _id: id, user: req.user._id });
    if (!tx) {
      const err = new Error("Transaction not found");
      err.statusCode = 404;
      throw err;
    }
    const allowed = ["counterpartyName", "amount", "type", "status", "date", "note"];
    for (const k of allowed) if (k in req.body) tx[k] = req.body[k];
    await tx.save();
    res.json({ transaction: tx });
  } catch (e) {
    next(e);
  }
};

export const deleteTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tx = await Transaction.findOneAndDelete({ _id: id, user: req.user._id });
    if (!tx) {
      const err = new Error("Transaction not found");
      err.statusCode = 404;
      throw err;
    }
    res.json({ message: "Deleted" });
  } catch (e) {
    next(e);
  }
};
