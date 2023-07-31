// Middleware to check if the user is an admin
const checkAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
};

module.exports = checkAdmin;
