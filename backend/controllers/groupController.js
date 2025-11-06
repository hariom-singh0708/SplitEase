import { validationResult } from "express-validator";
import Group from "../models/Group.js";
import User from "../models/User.js";
import Expense from "../models/Expense.js";
import { computeBalances } from "../utils/calculateSplit.js";

export const createGroup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error("Invalid input");
      err.statusCode = 400;
      err.errors = errors.array();
      throw err;
    }

    const { name, membersIdentifiers } = req.body; // array of emails or mobiles
    const query = {
      $or: [
        { email: { $in: membersIdentifiers.filter((x) => x.includes("@")).map((e) => e.toLowerCase()) } },
        { mobile: { $in: membersIdentifiers.filter((x) => !x.includes("@")) } }
      ]
    };
    const found = await User.find(query).select("_id");
    const memberIds = new Set(found.map((u) => String(u._id)));
    memberIds.add(String(req.user._id)); // ensure creator is a member

    const group = await Group.create({
      name,
      createdBy: req.user._id,
      members: Array.from(memberIds)
    });

    res.status(201).json({ group });
  } catch (e) {
    next(e);
  }
};

export const myGroups = async (req, res, next) => {
  try {
    const groups = await Group.find({ members: req.user._id }).sort({ createdAt: -1 }).populate("members", "name email mobile");
    res.json({ groups });
  } catch (e) {
    next(e);
  }
};

export const groupDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const group = await Group.findById(id).populate("members", "name email mobile");
    if (!group || !group.members.some((m) => String(m._id) === String(req.user._id))) {
      const err = new Error("Group not found or access denied");
      err.statusCode = 404;
      throw err;
    }
    res.json({ group });
  } catch (e) {
    next(e);
  }
};

export const addMembers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { membersIdentifiers } = req.body;

    const group = await Group.findById(id);
    if (!group) {
      const err = new Error("Group not found");
      err.statusCode = 404;
      throw err;
    }
    // Only existing members can add others
    if (!group.members.map(String).includes(String(req.user._id))) {
      const err = new Error("Access denied");
      err.statusCode = 403;
      throw err;
    }

    const query = {
      $or: [
        { email: { $in: membersIdentifiers.filter((x) => x.includes("@")).map((e) => e.toLowerCase()) } },
        { mobile: { $in: membersIdentifiers.filter((x) => !x.includes("@")) } }
      ]
    };
    const found = await User.find(query).select("_id");
    const addIds = found.map((u) => String(u._id));
    const merged = Array.from(new Set([...group.members.map(String), ...addIds]));
    group.members = merged;
    await group.save();

    res.json({ group });
  } catch (e) {
    next(e);
  }
};

export const removeMember = async (req, res, next) => {
  try {
    const { id } = req.params; // groupId
    const { userId } = req.body;

    const group = await Group.findById(id);
    if (!group) {
      const err = new Error("Group not found");
      err.statusCode = 404;
      throw err;
    }
    // Only creator can remove, and cannot remove themselves if they are last payer existence etc.
    if (String(group.createdBy) !== String(req.user._id)) {
      const err = new Error("Only group creator can remove members");
      err.statusCode = 403;
      throw err;
    }

    // Ensure no expenses left involving that user, or require settlement (simple check)
    const count = await Expense.countDocuments({ group: id, $or: [{ paidBy: userId }, { participants: userId }] });
    if (count > 0) {
      const err = new Error("Cannot remove member with existing expenses; settle or delete expenses first");
      err.statusCode = 400;
      throw err;
    }

    group.members = group.members.filter((m) => String(m) !== String(userId));
    await group.save();
    res.json({ group });
  } catch (e) {
    next(e);
  }
};

export const groupSettlement = async (req, res, next) => {
  try {
    const { id } = req.params;
    const group = await Group.findById(id);
    if (!group || !group.members.map(String).includes(String(req.user._id))) {
      const err = new Error("Group not found or access denied");
      err.statusCode = 404;
      throw err;
    }

    const expenses = await Expense.find({ group: id }).select("amount paidBy participants");
    const { net, settlements } = computeBalances(expenses, group.members);

    res.json({ net, settlements });
  } catch (e) {
    next(e);
  }
};

export const deleteGroup = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Only creator can delete
    if (group.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this group" });
    }

    await group.deleteOne();
    res.json({ message: "Group deleted successfully" });
  } catch (error) {
    next(error);
  }
};

