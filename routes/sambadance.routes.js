module.exports = app => {
    const ctrl = require("../controllers/sambadanceCtrl");
    const router = require("express").Router();

    router.get("/", ctrl.loadPattern);

    app.use('/api/sambadance', router);
};
