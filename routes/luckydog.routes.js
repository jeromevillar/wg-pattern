module.exports = app => {
    const ctrl = require("../controllers/luckydogCtrl");
    const router = require("express").Router();

    router.get("/", ctrl.loadPattern);

    app.use('/api/luckydog', router);
};
