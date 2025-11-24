module.exports = app => {
    const ctrl = require("../controllers/superfruitsslotCtrl");
    const router = require("express").Router();

    router.get("/", ctrl.loadPattern);

    app.use('/api/superfruitsslot', router);
};
