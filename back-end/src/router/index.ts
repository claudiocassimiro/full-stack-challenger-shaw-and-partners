import { Router } from "express";
import multer from "multer";
import csvController from "../controllers/csvController";

const router = Router();
const upload = multer({ dest: "uploads/" });

router.post("/api/files", upload.single("file"), csvController.save);
router.get("/api/users", csvController.search);

export default router;
