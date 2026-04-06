import Member from "../models/Member.js";
import Invoice from "../models/Invoice.js";
import mongoose from "mongoose";

const notDeleted = { isDeleted: { $ne: true } };
const OVERDUE_REASON = "Automatically deactivated due to overdue invoice";
const REACTIVATION_REASON = "Automatically reactivated - overdue invoice resolved";

/**
 * Check if member has any unpaid overdue invoices
 * @param {ObjectId} memberId - Member ID
 * @returns {Promise<{hasOverdue: boolean, overdueInvoice: Object|null}>}
 */
export const checkMemberOverdueStatus = async (memberId) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find the earliest unpaid invoice with past due date
    const overdueInvoice = await Invoice.findOne({
      memberId: new mongoose.Types.ObjectId(memberId),
      status: "Unpaid",
      dueDate: { $lt: today },
      ...notDeleted
    })
      .sort({ dueDate: 1 })
      .lean();

    return {
      hasOverdue: !!overdueInvoice,
      overdueInvoice: overdueInvoice
    };
  } catch (error) {
    console.error(`Error checking overdue status for member ${memberId}:`, error.message);
    throw error;
  }
};

/**
 * Update member status based on payment and due date logic
 * @param {ObjectId} memberId - Member ID
 * @param {boolean} shouldBeActive - Whether member should be active
 * @param {string} reason - Reason for status change
 * @returns {Promise<Object>} Updated member
 */
export const updateMemberStatusAutomated = async (memberId, shouldBeActive, reason) => {
  try {
    const member = await Member.findOne({
      _id: new mongoose.Types.ObjectId(memberId),
      ...notDeleted
    });

    if (!member) {
      console.warn(`Member not found: ${memberId}`);
      return null;
    }

    // Only update if status actually changes
    if (member.isActive === shouldBeActive) {
      return member;
    }

    member.isActive = shouldBeActive;
    member.statusReason = reason;
    member.statusUpdatedAt = new Date();

    await member.save();

    console.log(
      `Member ${member.memberCode} (${member.name}) status updated to ${shouldBeActive ? "Active" : "Inactive"}: ${reason}`
    );

    return member;
  } catch (error) {
    console.error(`Error updating member status for ${memberId}:`, error.message);
    throw error;
  }
};

/**
 * Process all members and update status based on invoice due dates
 * This is the main automation function
 * @returns {Promise<Object>} Summary of changes
 */
export const processAllMembersOverdueStatus = async () => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const summary = {
    processed: 0,
    deactivated: 0,
    reactivated: 0,
    errors: 0,
    timestamp: new Date()
  };

  try {
    // Find all active members
    const activeMembers = await Member.find({
      isActive: true,
      ...notDeleted
    })
      .select("_id memberCode name")
      .session(session)
      .lean();

    console.log(`[Member Status Automation] Processing ${activeMembers.length} active members...`);

    for (const member of activeMembers) {
      try {
        const { hasOverdue, overdueInvoice } = await checkMemberOverdueStatus(member._id);

        if (hasOverdue) {
          // Deactivate member
          await updateMemberStatusAutomated(
            member._id,
            false,
            `${OVERDUE_REASON} (Due: ${overdueInvoice.dueDate.toISOString().split("T")[0]}, Amount: ${overdueInvoice.amount})`
          );
          summary.deactivated++;
        }

        summary.processed++;
      } catch (error) {
        console.error(`Error processing member ${member.memberCode}:`, error.message);
        summary.errors++;
      }
    }

    // Find all inactive members and check if they should be reactivated
    const inactiveMembers = await Member.find({
      isActive: false,
      statusReason: { $regex: "Automatically deactivated" },
      ...notDeleted
    })
      .select("_id memberCode name")
      .session(session)
      .lean();

    console.log(`[Member Status Automation] Checking ${inactiveMembers.length} inactive members for reactivation...`);

    for (const member of inactiveMembers) {
      try {
        const { hasOverdue } = await checkMemberOverdueStatus(member._id);

        if (!hasOverdue) {
          // All invoices are now paid or no unpaid overdue invoices
          await updateMemberStatusAutomated(
            member._id,
            true,
            REACTIVATION_REASON
          );
          summary.reactivated++;
        }

        summary.processed++;
      } catch (error) {
        console.error(`Error processing inactive member ${member.memberCode}:`, error.message);
        summary.errors++;
      }
    }

    await session.commitTransaction();

    console.log(
      `[Member Status Automation] Complete - Processed: ${summary.processed}, Deactivated: ${summary.deactivated}, Reactivated: ${summary.reactivated}, Errors: ${summary.errors}`
    );

    return summary;
  } catch (error) {
    await session.abortTransaction();
    console.error("[Member Status Automation] Transaction failed:", error.message);
    summary.errors++;
    throw error;
  } finally {
    session.endSession();
  }
};

/**
 * Get automation statistics
 * @param {ObjectId} adminId - Admin ID (optional, for filtering by admin)
 * @returns {Promise<Object>} Statistics
 */
export const getMemberStatusAutomationStats = async (adminId = null) => {
  try {
    const filter = { ...notDeleted };
    if (adminId) {
      filter.adminId = new mongoose.Types.ObjectId(adminId);
    }

    const automatedlyDeactivated = await Member.countDocuments({
      ...filter,
      statusReason: { $regex: "Automatically deactivated" },
      isActive: false
    });

    const automatedlyReactivated = await Member.countDocuments({
      ...filter,
      statusReason: { $regex: "Automatically reactivated" }
    });

    const totalInactiveMembers = await Member.countDocuments({
      ...filter,
      isActive: false
    });

    const totalActiveMembers = await Member.countDocuments({
      ...filter,
      isActive: true
    });

    return {
      automatedlyDeactivated,
      automatedlyReactivated,
      totalInactiveMembers,
      totalActiveMembers,
      lastRunTimestamp: new Date()
    };
  } catch (error) {
    console.error("Error fetching automation stats:", error.message);
    throw error;
  }
};

export default {
  checkMemberOverdueStatus,
  updateMemberStatusAutomated,
  processAllMembersOverdueStatus,
  getMemberStatusAutomationStats
};
