const express = require("express");
const cors = require("cors");
const db = require('./models');
const path = require("path");
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

db.sequelize.sync()
    .then(() => {
        console.log("Synced db.");
    })
    .catch((err) => {
        console.log("Failed to sync db: " + err.message);
    });

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to bezkoder application." });
});

require("./routes/fortunetiger.routes")(app);
require("./routes/fortunetoucan.routes")(app);
require("./routes/leopardofgold.routes")(app);
require("./routes/fortuneox.routes")(app);
require("./routes/fortunerabbit.routes")(app);
require("./routes/dragonstreasure.routes")(app);
require("./routes/luckydog.routes")(app);
require("./routes/festivalofthesaints.routes")(app);
require("./routes/thevault.routes")(app);
require("./routes/mahjongways2.routes")(app);
require("./routes/mahjongways.routes")(app);
require("./routes/piratestreasure.routes")(app);
require("./routes/crazy777.routes")(app);
require("./routes/dragonstreasure2.routes")(app);
require("./routes/treasurebowl.routes")(app);
require("./routes/fortunedragon.routes")(app);
require("./routes/animalkingdom.routes")(app);
require("./routes/fishingmaster.routes")(app);
require("./routes/wukong.routes")(app);
require("./routes/mrturtle.routes")(app);
require("./routes/dragonvstiger.routes")(app);

require("./routes/worldcup.routes")(app);
require("./routes/treasuremarmosets.routes")(app);
require("./routes/sambadance.routes")(app);
require("./routes/superfruitsslot.routes")(app);
require("./routes/watermargin.routes")(app);
require("./routes/fortunegems.routes")(app);
require("./routes/fortunemouse.routes")(app);
require("./routes/superace.routes")(app);
require("./routes/cocosriches.routes")(app);
require("./routes/fortunesnake.routes")(app);
require("./routes/superfruitslot2.routes")(app);
require("./routes/queenofbounty.routes")(app);
require("./routes/wildbountyshowdown.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
