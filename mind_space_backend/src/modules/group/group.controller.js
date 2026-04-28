import { Router } from "express"
import { isAuthenticate } from "../../middlewares/auth.js"
import { asyncHandler } from "../../utils/error/async_handler.js"
import { isValid } from "../../middlewares/isValid.js"
import { createGroup, getGroupMembers, joinGroupRequest, leaveGroup, removeUserFromGroup, updateGroup } from "./group.service.js"
import { createGroupSchema, GroupSchema,  removeUserFromGroupSchema, updateGroupSchema } from "./group.validation.js"
import { isAuthorized } from "../../middlewares/isAuthorized.js"
import { roles } from "../../utils/index.js"

const router = Router()

router.post("/join/:groupId", isAuthenticate, isValid(GroupSchema), asyncHandler(joinGroupRequest))
// Admin accept or reject join requests (API) -----> need to be implemented by socket.io for real-time updates to users
router.post("/leave/:groupId",isAuthenticate,isValid(GroupSchema),asyncHandler(leaveGroup))
router.post("/create-group",isAuthenticate,isAuthorized(roles.admin),isValid(createGroupSchema), asyncHandler(createGroup))
router.delete("/remove-user/:groupId/:userId",isAuthenticate,isAuthorized(roles.admin),
isValid(removeUserFromGroupSchema),asyncHandler(removeUserFromGroup))

router.get("/get-members/:groupId",isAuthenticate,isValid(GroupSchema),asyncHandler(getGroupMembers))
router.put("/update-group/:groupId",isAuthenticate,isAuthorized(roles.admin)
,isValid(updateGroupSchema),asyncHandler(updateGroup))

export default router