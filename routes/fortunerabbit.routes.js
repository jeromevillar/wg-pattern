module.exports = app => {
    const ctrl = require("../controllers/fortunerabbitCtrl");
    const router = require("express").Router();

    router.get("/", ctrl.loadPattern);

    app.use('/api/fortunerabbit', router);
};
