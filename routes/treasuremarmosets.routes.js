module.exports = app => {
    const ctrl = require("../controllers/treasuremarmosetsCtrl");
    const router = require("express").Router();

    router.get("/", ctrl.loadPattern);
    app.use('/api/treasuremarmosets', router);
};
