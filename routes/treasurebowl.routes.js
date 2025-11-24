module.exports = app => {
    const ctrl = require("../controllers/treasurebowlCtrl");
    const router = require("express").Router();

    router.get("/", ctrl.loadPattern);

    app.use('/api/treasurebowl', router);
};
