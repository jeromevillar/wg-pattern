module.exports = app => {
    const ctrl = require("../controllers/fishingmasterCtrl");
    const router = require("express").Router();

    router.get("/", ctrl.loadPattern);

    app.use('/api/fishingmaster', router);
};
