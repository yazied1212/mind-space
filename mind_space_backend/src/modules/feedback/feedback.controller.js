import { Router } from "express";
import { isAuthenticate, isAuthorized } from "../../middlewares/index.js";
import { roles } from "../../utils/index.js";


const router = Router()
router.get("/",isAuthenticate,isAuthorized([roles.user,roles.therapist]))

export default router