import express from "express";
import {
    getPlans,
    getUserSubscription,
    changeSubscription,
} from "../controllers/subscription.js";

const routes = express.Router();

routes.get("/plans", getPlans);
routes.get("/user/:userId", getUserSubscription);
routes.patch("/change", changeSubscription);

export default routes;