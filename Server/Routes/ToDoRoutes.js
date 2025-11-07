import express from "express";
import {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  recreateDailyHabits,
  getTodoByUserId,
} from "../Controller/TodoController.js";
import authMiddleware from "../Middlewares/authMiddleware.js";

// these are added -> for security --
import {
  createTodoValidationRules,
  updateTodoValidationRules,
} from "../security/validation.js";
import { validate } from "../security/validationMiddleware.js";
import { sanitizeFields } from "../security/sanitizeMiddleware.js";
//

const router = express.Router();

// router.post("/", authMiddleware, createTodo);
router.post(
  "/",
  authMiddleware,
  createTodoValidationRules(),
  validate,
  sanitizeFields(["title"]),
  createTodo
);

router.get("/", authMiddleware, getAllTodos);
router.get("/:id", authMiddleware, getTodoById);
router.get("/user/:id", authMiddleware, getTodoByUserId);

// router.put("/:id", authMiddleware, updateTodo);
router.put(
  "/:id",
  authMiddleware,
  updateTodoValidationRules(),
  validate,
  sanitizeFields(["title"]),
  updateTodo
);

router.delete("/:id", authMiddleware, deleteTodo);
router.post("/recreate-daily-habits", authMiddleware, recreateDailyHabits);

export default router;
