const taskRoute = require("./task.route");

const version = "/api/v1";

module.exports = (app) => {
    app.use(version + "/tasks", taskRoute);
}