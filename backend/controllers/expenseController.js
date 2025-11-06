import { validationResult } from "express-validator";
import Expense from "../models/Expense.js";
import Group from "../models/Group.js";

export const addExpense = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error("Invalid input");
      err.statusCode = 400;
      err.errors = errors.array();
      throw err;
    }

    const { groupId, description, amount, paidBy, participants } = req.body;

    const group = await Group.findById(groupId);
    if (!group) {
      const err = new Error("Group not found");
      err.statusCode = 404;
      throw err;
    }
    if (!group.members.map(String).includes(String(req.user._id))) {
      const err = new Error("Access denied");
      err.statusCode = 403;
      throw err;
    }
    if (!group.members.map(String).includes(String(paidBy))) {
      const err = new Error("Payer must be a group member");
      err.statusCode = 400;
      throw err;
    }

    const actualParticipants = (participants?.length ? participants : group.members.map(String)).filter((id) =>
      group.members.map(String).includes(String(id))
    );
    if (actualParticipants.length === 0) {
      const err = new Error("No valid participants");
      err.statusCode = 400;
      throw err;
    }

    const perHead = Number(amount) / actualParticipants.length;
    const shares = actualParticipants.map((u) => ({ user: u, share: Math.round(perHead * 100) / 100 }));

    const expense = await Expense.create({
      group: groupId,
      description,
      amount,
      paidBy,
      participants: actualParticipants,
      shares,
      createdBy: req.user._id
    });

    res.status(201).json({ expense });
  } catch (e) {
    next(e);
  }
};

export const listGroupExpenses = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId);
    if (!group || !group.members.map(String).includes(String(req.user._id))) {
      const err = new Error("Group not found or access denied");
      err.statusCode = 404;
      throw err;
    }
    const expenses = await Expense.find({ group: groupId })
      .sort({ createdAt: -1 })
      .populate("paidBy", "name email")
      .populate("shares.user", "name email");
    res.json({ expenses });
  } catch (e) {
    next(e);
  }
};

export const deleteExpense = async (req, res, next) => {
  try {
    const { id } = req.params; // expense id
    const exp = await Expense.findById(id);
    if (!exp) {
      const err = new Error("Expense not found");
      err.statusCode = 404;
      throw err;
    }
    // Only creator or payer can delete
    if (![String(exp.createdBy), String(exp.paidBy)].includes(String(req.user._id))) {
      const err = new Error("Not allowed to delete this expense");
      err.statusCode = 403;
      throw err;
    }
    await Expense.deleteOne({ _id: id });
    res.json({ message: "Deleted" });
  } catch (e) {
    next(e);
  }
};
