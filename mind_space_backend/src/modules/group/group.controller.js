import { Router } from "express"
import { isAuthenticate } from "../../middlewares/auth.js"
import { asyncHandler } from "../../utils/error/async_handler.js"
import { isValid } from "../../middlewares/isValid.js"
import { joinGroup, leaveGroup } from "./group.service.js"
import { joinGroupSchema, leaveGroupSchema } from "./group.validation.js"

const groupRouter = Router()

groupRouter.post("/join/:groupId", isAuthenticate, isValid(joinGroupSchema), asyncHandler(joinGroup))
groupRouter.post("/leave/:groupId",isAuthenticate,isValid(leaveGroupSchema),asyncHandler(leaveGroup))


export default groupRouter