import { Router } from "express";
import { router as v1Routes } from "./V1/index.js";
import { router as v2Routes } from "./V2/index.js";

export const router = Router();

router.use("/V1", v1Routes);
router.use("/V2", v2Routes);
