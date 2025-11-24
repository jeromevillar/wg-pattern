const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    'wg_pattern',
    'root',
    '',
    {
        host: 'localhost',
        dialect: 'mysql',
        pool: {
            max: 20,
            min: 0,
            acquire: 60000,
            idle: 10000
        }
    }
);


const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.fortunetiger = require("./fortunetiger.model")(sequelize, Sequelize);
db.fortunetoucan = require("./fortunetoucan.model")(sequelize, Sequelize);
db.leopardofgold = require("./leopardofgold.model")(sequelize, Sequelize);
db.fortuneox = require("./fortuneox.model")(sequelize, Sequelize);
db.fortunerabbit = require("./fortunerabbit.model")(sequelize, Sequelize);
db.dragonstreasure = require("./dragonstreasure.model")(sequelize, Sequelize);
db.luckydog = require("./luckydog.model")(sequelize, Sequelize);
db.thevault = require("./thevault.model")(sequelize, Sequelize);
db.festivalofthesaints = require("./festivalofthesaints.model")(sequelize, Sequelize);
db.mahjongways2 = require("./mahjongways2.model")(sequelize, Sequelize);
db.mahjongways = require("./mahjongways.model")(sequelize, Sequelize);
db.piratestreasure = require("./piratestreasure.model")(sequelize, Sequelize);
db.crazy777 = require("./crazy777.model")(sequelize, Sequelize);
db.dragonstreasure2 = require("./dragonstreasure2.model")(sequelize, Sequelize);
db.treasurebowl = require("./treasurebowl.model")(sequelize, Sequelize);
db.fortunedragon = require("./fortunedragon.model")(sequelize, Sequelize);
db.animalkingdom = require("./animalkingdom.model")(sequelize, Sequelize);
db.fishingmaster = require("./fishingmaster.model")(sequelize, Sequelize);
db.wukong = require("./wukong.model")(sequelize, Sequelize);
db.mrturtle = require("./mrturtle.model")(sequelize, Sequelize);
db.dragonvstiger = require("./dragonvstiger.model")(sequelize, Sequelize);
db.treasuremarmosets = require("./treasuremarmosets.model")(sequelize, Sequelize);
db.sambadance = require("./sambadance.model")(sequelize, Sequelize);
db.worldcup = require("./worldcup.model")(sequelize, Sequelize);
db.superfruitsslot = require("./superfruitsslot.model")(sequelize, Sequelize);
db.watermargin = require("./watermargin.model")(sequelize, Sequelize);
db.fortunegems = require("./fortunegems.model")(sequelize, Sequelize);
db.fortunemouse = require("./fortunemouse.model")(sequelize, Sequelize);
db.superace = require("./superace.model")(sequelize, Sequelize);
db.cocosriches = require("./cocosriches.model")(sequelize, Sequelize);
db.fortunesnake = require("./fortunesnake.model")(sequelize, Sequelize);
db.superfruitslot2 = require("./superfruitslot2.model")(sequelize, Sequelize);
db.queenofbounty = require("./queenofbounty.model")(sequelize, Sequelize);
db.wildbountyshowdown = require("./wildbountyshowdown.model")(sequelize, Sequelize);

module.exports = db;
