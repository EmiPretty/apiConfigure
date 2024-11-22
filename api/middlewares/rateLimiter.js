const setRateLimit = require("express-rate-limit");

const rateLimitMiddleware = (req, res, next) => {
  const isAdmin = req.user && req.user.isadmin;

  const limiter = setRateLimit({
    windowMs: 1000,
    max: isAdmin ? 10 : 5,
    message: "You have exceeded your request limit.",
    headers: true,
  });

  limiter(req, res, next);
};

module.exports = rateLimitMiddleware;
