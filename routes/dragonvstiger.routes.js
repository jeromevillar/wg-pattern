module.exports = app => {
    const ctrl = require("../controllers/dragonvstigerCtrl");
    const router = require("express").Router();

    router.get("/", ctrl.loadPattern);

    app.use('/api/dragonvstiger', router);
};
