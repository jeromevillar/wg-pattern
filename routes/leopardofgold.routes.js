module.exports = app => {
    const ctrl = require("../controllers/leopardofgoldCtrl");
    const router = require("express").Router();

    router.get("/", ctrl.loadPattern);

    app.use('/api/leopardofgold', router);
};
