module.exports = app => {
    const ctrl = require("../controllers/watermarginCtrl");
    const router = require("express").Router();

    router.get("/", ctrl.loadPattern);

    app.use('/api/watermargin', router);
};
