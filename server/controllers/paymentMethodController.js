import PaymentMethod from "../models/PaymentMethod.js";

const notDeleted = { isDeleted: { $ne: true } };

/**
 * Get all payment methods for an admin
 */
export const getPaymentMethods = async (req, res) => {
  try {
    const adminId = req.user._id;
    const methods = await PaymentMethod.find({
      adminId,
      ...notDeleted
    })
      .sort({ displayOrder: 1, createdAt: 1 })
      .lean();

    return res.status(200).json({ methods });
  } catch (error) {
    return res.status(500).json({ message: error?.message || "Server error" });
  }
};

/**
 * Create a new payment method
 */
export const createPaymentMethod = async (req, res) => {
  try {
    const adminId = req.user._id;
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Payment method name is required" });
    }

    const method = new PaymentMethod({
      adminId,
      name: name.trim(),
      description: (description || "").trim(),
      isActive: true,
      displayOrder: 0
    });

    await method.save();

    return res.status(201).json({
      message: "Payment method created successfully",
      method
    });
  } catch (error) {
    return res.status(500).json({ message: error?.message || "Server error" });
  }
};

/**
 * Update a payment method
 */
export const updatePaymentMethod = async (req, res) => {
  const { methodId } = req.params;

  try {
    const adminId = req.user._id;
    const { name, description, isActive } = req.body;

    const method = await PaymentMethod.findOne({
      _id: methodId,
      adminId,
      ...notDeleted
    });

    if (!method) {
      return res.status(404).json({ message: "Payment method not found" });
    }

    if (name) method.name = name.trim();
    if (description !== undefined) method.description = (description || "").trim();
    if (isActive !== undefined) method.isActive = Boolean(isActive);

    await method.save();

    return res.status(200).json({
      message: "Payment method updated successfully",
      method
    });
  } catch (error) {
    return res.status(500).json({ message: error?.message || "Server error" });
  }
};

/**
 * Delete a payment method
 */
export const deletePaymentMethod = async (req, res) => {
  const { methodId } = req.params;

  try {
    const adminId = req.user._id;

    const method = await PaymentMethod.findOne({
      _id: methodId,
      adminId,
      ...notDeleted
    });

    if (!method) {
      return res.status(404).json({ message: "Payment method not found" });
    }

    method.isDeleted = true;
    method.deletedAt = new Date();
    await method.save();

    return res.status(200).json({
      message: "Payment method deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({ message: error?.message || "Server error" });
  }
};

export default {
  getPaymentMethods,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod
};
