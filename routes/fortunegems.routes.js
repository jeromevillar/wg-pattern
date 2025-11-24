module.exports = app => {
    const ctrl = require("../controllers/fortunegemsCtrl");
    const router = require("express").Router();

    router.get("/", ctrl.loadPattern);

    app.use('/api/fortunegems', router);
};
