export function isAuthorized(allowedRole = []) {
  return (req, res, next) => {
    if (!allowedRole.includes(req.authUser.role)) {
      return next(new Error("not authorized", { cause: 401 }));
    }

    return next();
  };
}
