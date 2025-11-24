module.exports = app => {
    const ctrl = require("../controllers/cocosrichesCtrl");
    const router = require("express").Router();

    router.get("/", ctrl.loadPattern);

    app.use('/api/cocosriches', router);
};
