import { Router } from "express";
import { createPackage, deletePackage, editPackage, getAllPackages } from "../Controllers/package.controller";
import { findUser, ifAdmin } from "../Middlewares/auth.middleware";

const router = Router()

router.get('/packages', getAllPackages)
router.post('/create', findUser, ifAdmin, mediaUpload('packages').fields([
        { name: 'mainImage', maxCount: 1 },       
        { name: 'videoThumbnail', maxCount: 1 },  
        { name: 'thumbnails', maxCount: 10 }      
    ]), 
    createPackage
)
router.delete('/delete', findUser, ifAdmin, deletePackage)
router.put('/edit', findUser, ifAdmin, mediaUpload('packages').fields([
        { name: 'mainImage', maxCount: 1 },
        { name: 'videoThumbnail', maxCount: 1 },
        { name: 'thumbnails', maxCount: 10 }
    ]), 
    editPackage
);


export default router