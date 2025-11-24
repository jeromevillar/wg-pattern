module.exports = app => {
    const ctrl = require("../controllers/dragonstreasureCtrl");
    const router = require("express").Router();

    router.get("/", ctrl.loadPattern);

    app.use('/api/dragonstreasure', router);
};
