module.exports = app => {
    const ctrl = require("../controllers/fortunetigerCtrl");
    const router = require("express").Router();

    router.get("/", ctrl.loadPattern);

    app.use('/api/fortunetiger', router);
};
