import express from "express";
import {
  createEvent,
  deleteEvent,
  getAllEvents,
  getEventByDate,
  getEventById,
  updateEvent,
} from "../Controller/EventController.js";
import authMiddleware from "../Middlewares/authMiddleware.js";

// these are added -> for security --
import {
  createEventValidationRules,
  updateEventValidationRules,
} from "../security/validation.js";
import { validate } from "../security/validationMiddleware.js";
import { sanitizeFields } from "../security/sanitizeMiddleware.js";
// ------

const router = express.Router();

// Apply authentication middleware to all event routes
router.use(authMiddleware);

router.get("/", getAllEvents);
router.get("/by-date", getEventByDate);
router.get("/:id", getEventById);
// router.post("/", createEvent);
router.post(
  "/",
  createEventValidationRules(),
  validate,
  sanitizeFields(["title"]),
  createEvent
);

// router.put("/:id", updateEvent);
router.put(
  "/:id",
  updateEventValidationRules(),
  validate,
  sanitizeFields(["title"]),
  updateEvent
);

router.delete("/:id", deleteEvent);

export default router;
