module.exports = app => {
    const ctrl = require("../controllers/dragonstreasure2Ctrl");
    const router = require("express").Router();

    router.get("/", ctrl.loadPattern);

    app.use('/api/dragonstreasure2', router);
};
