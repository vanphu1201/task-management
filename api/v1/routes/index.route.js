const taskRoute = require("./task.route");
const userRoute = require("./user.route");

const version = "/api/v1";

module.exports = (app) => {
    app.use(version + "/tasks", taskRoute);

    app.use(version + "/users", userRoute);
}