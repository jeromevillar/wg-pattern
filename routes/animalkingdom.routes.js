module.exports = app => {
    const ctrl = require("../controllers/animalkingdomCtrl");
    const router = require("express").Router();

    router.get("/", ctrl.loadPattern);

    app.use('/api/animalkingdom', router);
};
