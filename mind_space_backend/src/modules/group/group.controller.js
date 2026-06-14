import { Router } from "express"
import { isAuthenticate } from "../../middlewares/auth.js"
import { asyncHandler } from "../../utils/error/async_handler.js"
import { isValid } from "../../middlewares/isValid.js"
import { createGroup, deleteGroup, getGroupMembers, getGroups, joinGroupRequest, leaveGroup, removeUserFromGroup, updateGroup, getGroupMessages, getPendingRequests, handleJoinRequest } from "./group.service.js"
import { createGroupSchema, GroupSchema,  removeUserFromGroupSchema, updateGroupSchema } from "./group.validation.js"
import { isAuthorized } from "../../middlewares/isAuthorized.js"
import { roles } from "../../utils/index.js"

const router = Router()

router.post("/join/:groupId", isAuthenticate, isValid(GroupSchema), asyncHandler(joinGroupRequest))
router.post("/leave/:groupId",isAuthenticate,isValid(GroupSchema),asyncHandler(leaveGroup))
router.post("/create-group",isAuthenticate,isAuthorized(roles.admin),isValid(createGroupSchema), asyncHandler(createGroup))
router.delete("/remove-user/:groupId/:userId",isAuthenticate,isAuthorized(roles.admin),
isValid(removeUserFromGroupSchema),asyncHandler(removeUserFromGroup))
router.get("/get-groups",isAuthenticate,asyncHandler(getGroups))
router.get("/get-members/:groupId",isAuthenticate,isValid(GroupSchema),asyncHandler(getGroupMembers))
router.put("/update-group/:groupId",isAuthenticate,isAuthorized(roles.admin)
,isValid(updateGroupSchema),asyncHandler(updateGroup))
router.delete("/delete-group/:groupId",isAuthenticate,isAuthorized(roles.admin),isValid(GroupSchema),asyncHandler(deleteGroup))

// Message history
router.get("/messages/:groupId", isAuthenticate, isValid(GroupSchema), asyncHandler(getGroupMessages))

// Admin handles join requests
router.get("/pending-requests", isAuthenticate, isAuthorized(roles.admin), asyncHandler(getPendingRequests))
router.post("/handle-request/:requestId", isAuthenticate, isAuthorized(roles.admin), asyncHandler(handleJoinRequest))

export default router