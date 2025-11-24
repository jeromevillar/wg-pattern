module.exports = app => {
    const ctrl = require("../controllers/wildbountyshowdownCtrl");
    const router = require("express").Router();

    router.get("/", ctrl.loadPattern);

    app.use('/api/wildbountyshowdown', router);
};
