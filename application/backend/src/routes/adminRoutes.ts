import express from "express";
import { makeUserAdmin, makeUserPremium } from "../controllers/adminController";

const router = express.Router();

router.post("/make-admin", makeUserAdmin);
router.post("/make-premium", makeUserPremium);

export default router;