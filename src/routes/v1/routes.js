const userRoutes = require("../../v1/components/users/user.routes");
const authRoutes = require("../../v1/components/auth/auth.routes");
const taskRoutes = require("../../v1/components/tasks/task.routes");

const setupRoutes = (app) => {
  app.get("/", (req, res) => {
    res.status(200).json({
      status: "success",
      message: "API Running",
    });
  });

  app.use("/api/v1/users", userRoutes);
  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/tasks", taskRoutes);
};

module.exports = setupRoutes;
