module.exports = app => {
    const ctrl = require("../controllers/fortunedragonCtrl");
    const router = require("express").Router();

    router.get("/", ctrl.loadPattern);

    app.use('/api/fortunedragon', router);
};
