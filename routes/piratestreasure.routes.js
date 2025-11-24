module.exports = app => {
    const ctrl = require("../controllers/piratestreasureCtrl");
    const router = require("express").Router();

    router.get("/", ctrl.loadPattern);

    app.use('/api/piratestreasure', router);
};
