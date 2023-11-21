import express from "express";
import { z } from "zod";

import { findValuationsForClient } from "../controllers/valuations-controller";

const router = express.Router();

const getValuationsSchema = z.object({
  clientId: z.string(),
});

router.get("/valuations", (req, res) => {
  try {
    const validatedParams: { clientId: string } = getValuationsSchema.parse(
      req.query,
    );
    const valuations = findValuationsForClient(validatedParams.clientId);
    res.send(valuations);
  } catch (error: any) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

export default router;
