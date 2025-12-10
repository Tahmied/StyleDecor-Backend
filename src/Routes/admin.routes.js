import { Router } from "express";
import { addService, deleteService, editService } from "../Controllers/service.controller.js";
import { ifAdmin } from "../Middlewares/auth.middleware.js";
import { mediaUpload } from "../Middlewares/multer.middleware.js";

const router = Router()

router.post('/add-service', ifAdmin, mediaUpload("services").array('images',10), addService)
router.post('/edit-service', ifAdmin, editService)
router.post('/delete-service', ifAdmin, deleteService)

export default router