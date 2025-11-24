module.exports = app => {
    const ctrl = require("../controllers/mahjongways2Ctrl");
    const router = require("express").Router();

    router.get("/", ctrl.loadPattern);

    app.use('/api/mahjongways2', router);
};
