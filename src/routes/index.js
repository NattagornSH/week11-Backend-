import { Router } from "express";
import { router as v1Routes } from "./V1/index.js";
import { router as v2Routes } from "./V2/index.js";

export const router = Router();

router.use("/v1", v1Routes);
router.use("/v2", v2Routes);
