const taskRoute = require("./task.route");
const userRoute = require("./user.route");

const version = "/api/v1";

const authMiddleware = require("../middlewares/auth.middleware");

module.exports = (app) => {
    app.use(version + "/tasks", authMiddleware, taskRoute);

    app.use(version + "/users", userRoute);
}