import { Router } from "express";
import { createPackage, deletePackage, editPackage, getAllPackages } from "../Controllers/package.controller.js";
import { findUser, ifAdmin } from "../Middlewares/auth.middleware.js";
import { mediaUpload } from "../Middlewares/multer.middleware.js";

const router = Router()

router.get('/packages', getAllPackages)
router.post('/create', findUser, ifAdmin, mediaUpload('packages').fields([
        { name: 'mainImage', maxCount: 1 },       
        { name: 'thumbnails', maxCount: 10 }      
    ]), 
    createPackage
)
router.post('/delete', findUser, ifAdmin, deletePackage)
router.post('/edit', findUser, ifAdmin, mediaUpload('packages').fields([
        { name: 'mainImage', maxCount: 1 },
        { name: 'thumbnails', maxCount: 10 }
    ]), 
    editPackage
);


export default router