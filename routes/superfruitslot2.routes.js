module.exports = app => {
    const ctrl = require("../controllers/superfruitslot2Ctrl");
    const router = require("express").Router();

    router.get("/", ctrl.loadPattern);

    app.use('/api/superfruitslot2', router);
};
