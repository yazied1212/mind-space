import { Router } from "express";
import { isAuthenticate, isAuthorized, isValid } from "../../middlewares/index.js";
import { asyncHandler, roles } from "../../utils/index.js";
import delaySession, {requestSession,  confirmSession, cancelSession } from "./session.service.js";
import {  delaySessionSchema, requestSessionSchema } from "./session.validation.js";

const router = Router()
router.post(
    "/request",
    isAuthenticate,
    isAuthorized([roles.user]),
    isValid(requestSessionSchema),
    asyncHandler(requestSession)
);
router.patch(
    "/confirm/:sessionId",
    isAuthenticate,
    isAuthorized([roles.therapist]), // Only therapists can confirm
    asyncHandler(confirmSession)
);
router.patch(
    "/cancel/:sessionId",
    isAuthenticate,
    isAuthorized([roles.user, roles.therapist]), 
    asyncHandler(cancelSession)
);
router.patch(
    "/delay/:sessionId",
    isAuthenticate,
    isAuthorized([roles.user, roles.therapist]),
    isValid(delaySessionSchema),
    asyncHandler(delaySession)
);


export default router
