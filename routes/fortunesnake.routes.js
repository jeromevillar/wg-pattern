module.exports = app => {
    const ctrl = require("../controllers/fortunesnakeCtrl");
    const router = require("express").Router();

    router.get("/", ctrl.loadPattern);

    app.use('/api/fortunesnake', router);
};
