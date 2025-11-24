module.exports = app => {
    const ctrl = require("../controllers/fortunemouseCtrl");
    const router = require("express").Router();

    router.get("/", ctrl.loadPattern);

    app.use('/api/fortunemouse', router);
};
