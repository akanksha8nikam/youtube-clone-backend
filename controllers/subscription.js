import users from "../Modals/Auth.js";
import mongoose from "mongoose";

const PLAN_CONFIG = {
    FREE: { name: "FREE", price: 0, maxMinutes: 5 },
    BRONZE: { name: "BRONZE", price: 10, maxMinutes: 7 },
    SILVER: { name: "SILVER", price: 50, maxMinutes: 10 },
    GOLD: { name: "GOLD", price: 100, maxMinutes: null }, // unlimited
};

export const getPlans = async (req, res) => {
    try {
        return res.status(200).json(Object.values(PLAN_CONFIG));
    } catch (error) {
        console.error("Subscription plans error:", error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

export const getUserSubscription = async (req, res) => {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(404).json({ message: "User unavailable..." });
    }

    try {
        const user = await users.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const planKey = user.subscriptionPlan || "FREE";
        const plan = PLAN_CONFIG[planKey];

        return res.status(200).json({
            plan: plan.name,
            price: plan.price,
            maxMinutes: plan.maxMinutes,
        });
    } catch (error) {
        console.error("Get subscription error:", error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

export const changeSubscription = async (req, res) => {
    const { userId, plan } = req.body;
    if (!userId || !plan) {
        return res.status(400).json({ message: "userId and plan are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(404).json({ message: "User unavailable..." });
    }

    const normalizedPlan = String(plan).toUpperCase();
    if (!PLAN_CONFIG[normalizedPlan]) {
        return res.status(400).json({ message: "Invalid subscription plan" });
    }

    try {
        const updatedUser = await users.findByIdAndUpdate(
            userId,
            { $set: { subscriptionPlan: normalizedPlan } },
            { new: true }
        );

        if (!updatedUser) return res.status(404).json({ message: "User not found" });

        const selectedPlan = PLAN_CONFIG[normalizedPlan];

        return res.status(200).json({
            message: "Subscription updated successfully",
            plan: {
                name: selectedPlan.name,
                price: selectedPlan.price,
                maxMinutes: selectedPlan.maxMinutes,
            },
            user: updatedUser,
        });
    } catch (error) {
        console.error("Change subscription error:", error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};