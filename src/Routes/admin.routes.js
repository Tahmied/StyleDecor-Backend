import { Router } from "express";
import { addService, allServices, deleteService, editService, getServiceById, getServicesForHomepage } from "../Controllers/service.controller.js";
import { AllUsers, UpdateUserRole } from "../Controllers/user.controller.js";
import { ifAdmin } from "../Middlewares/auth.middleware.js";
import { mediaUpload } from "../Middlewares/multer.middleware.js";

const router = Router()

router.post('/add-service', ifAdmin, mediaUpload("services").array('images',10), addService)
router.post('/edit-service', ifAdmin, mediaUpload("services").array('images',10), editService)
router.post('/delete-service', ifAdmin, deleteService)
router.get('/services', allServices)
router.get(`/service/:serviceId`, getServiceById)

router.get('/users', ifAdmin, AllUsers)
router.post('/UpdateUserRole', ifAdmin, UpdateUserRole)
router.get('/homepage-services', getServicesForHomepage)

export default router