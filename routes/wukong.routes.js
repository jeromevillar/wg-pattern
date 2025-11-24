module.exports = app => {
    const ctrl = require("../controllers/wukongCtrl");
    const router = require("express").Router();

    router.get("/", ctrl.loadPattern);

    app.use('/api/wukong', router);
};
