module.exports = app => {
    const ctrl = require("../controllers/queenofbountyCtrl");
    const router = require("express").Router();

    router.get("/", ctrl.loadPattern);

    app.use('/api/queenofbounty', router);
};
