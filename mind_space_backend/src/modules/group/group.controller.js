import { Router } from "express"
import { isAuthenticate } from "../../middlewares/auth.js"
import { asyncHandler } from "../../utils/error/async_handler.js"
import { isValid } from "../../middlewares/isValid.js"
import { createGroup, joinGroup, leaveGroup, removeUserFromGroup } from "./group.service.js"
import { createGroupSchema, joinGroupSchema, leaveGroupSchema, removeUserFromGroupSchema } from "./group.validation.js"
import { isAuthorized } from "../../middlewares/isAuthorized.js"
import { roles } from "../../utils/index.js"

const router = Router()

router.post("/join/:groupId", isAuthenticate, isValid(joinGroupSchema), asyncHandler(joinGroup))
router.post("/leave/:groupId",isAuthenticate,isValid(leaveGroupSchema),asyncHandler(leaveGroup))
router.post("/create-group",isAuthenticate,isAuthorized(roles.admin),isValid(createGroupSchema), asyncHandler(createGroup))
router.delete("/remove-user/:groupId/:userId",isAuthenticate,isAuthorized(roles.admin),
isValid(removeUserFromGroupSchema),asyncHandler(removeUserFromGroup))


export default router