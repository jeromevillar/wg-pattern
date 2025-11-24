module.exports = app => {
    const ctrl = require("../controllers/superaceCtrl");
    const router = require("express").Router();

    router.get("/", ctrl.loadPattern);

    app.use('/api/superace', router);
};
