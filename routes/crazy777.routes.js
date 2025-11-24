module.exports = app => {
    const ctrl = require("../controllers/crazy777Ctrl");
    const router = require("express").Router();

    router.get("/", ctrl.loadPattern);

    app.use('/api/crazy777', router);
};
