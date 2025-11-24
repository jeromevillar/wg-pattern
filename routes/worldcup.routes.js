module.exports = app => {
    const ctrl = require("../controllers/worldcupCtrl");
    const router = require("express").Router();

    router.get("/", ctrl.loadPattern);

    app.use('/api/worldcup', router);
};
