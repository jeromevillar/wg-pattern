module.exports = app => {
    const ctrl = require("../controllers/fortuneoxCtrl");
    const router = require("express").Router();

    router.get("/", ctrl.loadPattern);

    app.use('/api/fortuneox', router);
};
