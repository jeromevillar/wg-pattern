module.exports = app => {
    const ctrl = require("../controllers/thevaultCtrl");
    const router = require("express").Router();

    router.get("/", ctrl.loadPattern);

    app.use('/api/thevault', router);
};
