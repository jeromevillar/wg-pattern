module.exports = app => {
    const ctrl = require("../controllers/mahjongwaysCtrl");
    const router = require("express").Router();

    router.get("/", ctrl.loadPattern);

    app.use('/api/mahjongways', router);
};
