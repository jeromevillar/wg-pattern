module.exports = app => {
    const ctrl = require("../controllers/festivalofthesaintsCtrl");
    const router = require("express").Router();

    router.get("/", ctrl.loadPattern);

    app.use('/api/festivalofthesaints', router);
};
