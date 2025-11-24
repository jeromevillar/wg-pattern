module.exports = app => {
    const ctrl = require("../controllers/fortunetoucanCtrl");
    const router = require("express").Router();

    router.get("/", ctrl.loadPattern);

    app.use('/api/fortunetoucan', router);
};
