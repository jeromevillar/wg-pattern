module.exports = app => {
    const ctrl = require("../controllers/mrturtleCtrl");
    const router = require("express").Router();

    router.get("/", ctrl.loadPattern);

    app.use('/api/mrturtle', router);
};
