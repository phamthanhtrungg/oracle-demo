function checkCookie(req, res, next) {
  if (req.session.user === undefined && req.cookies.my_cookie != undefined) {
    res.clearCookie("my_cookie");
  }
  next();
}

function checkUserPrivileges(expectedPriv = false, location = "/") {
  return function (req, res, next) {
    const currentState =
      req.session.user != undefined && req.cookies.my_cookie != undefined;
    if (expectedPriv !== currentState) {
      return res.redirect(location);
    }
    next();
  };
}

function CustomErrorMiddleware(err, _, res, next) {
  if (err) {
    res.status(500).json({
      error: err.message,
      success: false,
    });
  }
  next();
}

export { checkCookie, checkUserPrivileges, CustomErrorMiddleware };
