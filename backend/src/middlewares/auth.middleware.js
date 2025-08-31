export const protectRoute = async (req, res, next) => {
  try {
    if (!req.auth().isAuthenticated) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Please login", success: false });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: "Server Error", success: false });
  }
};
