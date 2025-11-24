const db = require('../models');
const Model = db.fortunerabbit;
const WebSocket = require('ws');
const path = require("path");
const { v4: uuidv4 } = require('uuid');
const {getLaunchUrl} = require("../utils/launchGame");
const {loadProto} = require("../utils/proto");
const {delay, startPing, stopPing, sendMessage, receiveMessage, sendClientLoginReq, sendDivisionActivityReq, sendSpinDragonTreasureStartReq, saveSpin} = require("../utils/common");

const PROTO_PATH = path.join(__dirname, "../utils/com_protocol.proto");

const gameId = 3035;
const gameCode = "fortune-rabbit";
const minChip = 0.1;

let sendSpinCmd = 12011;
let sendSpinRoute = "com_protocol.DragonTreasureStartReq";
let receiveSpinRoute = "com_protocol.DragonTreasureStartRsp";

let account = "";
let agent = "";
let time = 0;
let token = "";
let deviceId = uuidv4();
let root = null;
let initPattern = null;
let totalRound = 9999;
let userBalance = 0;
let maxCount = 5000;

exports.loadPattern = async (req, res) => {
    root = await loadProto(PROTO_PATH);

    let launchUrl = await getLaunchUrl(gameId);

    console.log("✅ [Get launch url success]:", JSON.stringify(launchUrl));
    
    const queryString = launchUrl.replace("https://fgahfdvi.cg7.co/clientv3/index.html?", "");
    const pairs = queryString.split("&");

    for (const pair of pairs){
        const [key, value] = pair.split("=");
        if (key === "token") token = value;
        if (key === "time") time = parseInt(value, 10);
        if (key === "account") account = value;
        if (key === "agent") agent = value;
    }

    let big = await Model.max('big');
    if (!big) {
        big = 0;
    }

    let ws = new WebSocket(`wss://fgahfdvi.cg7.co/gogamesac/?account=${account}&agent=${agent}&time=${time}&token=${token}&gameId=${gameId}`, 
        'Chat-1.0',
        {
            headers: {
                'Accept-Encoding': 'gzip, deflate, br, zstd',
                'Accept-Language': 'en-US,en;q=0.9,pt;q=0.8,ko;q=0.7',
                'Cache-Control': 'no-cache',
                'Connection': 'Upgrade',
                'Cookie': '__cf_bm=t8qcGt9OeuqTygeM9fY7Ke8T7aBMuLn9U1m3pdqVdo0-1752718605-1.0.1.1-cH2B.j2mi_ZCa5wg9VJwQZw1vCCKTAILVcDpFLRBbWExDKaTLHRBM2RqadqjPEQpTkzf6sR.Fq3PTDOfp6XbVGAJqay8NIph9y_ZtLo1b6E',
                //'Host': 'fgahfdvi.cg7.co',
                'Origin': 'https://fgahfdvi.cg7.co',
                'Pragma': 'no-cache',
                //'Sec-WebSocket-Extensions': 'permessage-deflate; client_max_window_bits',
                //'Sec-WebSocket-Key': '6veMtyTXgZW1z7Y4Ja65bA==',
                'Sec-WebSocket-Protocol': 'Chat-1.0',
                //'Sec-WebSocket-Version': '13',
                //'Upgrade': 'websocket',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36'
              },
        }
    );

    // socket open
    ws.on('open', async () => {
        console.log('✅ Connected to WebSocket server');

        startPing(ws);

        await sendClientLoginReq(ws, root, agent, deviceId, gameId, account);
        await sendDivisionActivityReq(ws, root, gameId);
    });

    // socket message
    ws.on('message', async (message) => {
        try {
            var data = await receiveMessage(root, message);
            if (data) {
                const { cmd, route, response } = data;
    
                if (route != "com_protocol.BroadCastPrizePoolTotalAmount")
                    console.log(JSON.stringify(response));

                switch (route) {
                    case "com_protocol.ClientLoginSingleGameRsp":{
                        initPattern = JSON.stringify(response);
                        await sendSpinDragonTreasureStartReq(ws, root, sendSpinCmd, sendSpinRoute, minChip, totalRound);
                        break;
                    }
                    case receiveSpinRoute: {
                        let pattern = JSON.parse(JSON.stringify(response));
                        if (pattern.gameDataInfo.playerGold){
                            userBalance = pattern.gameDataInfo.playerGold;
                        } else{
                            userBalance -= minChip;
                        }
                        if (pattern.gameDataInfo.mainCard.length > 1) {
                            await saveSpin(Model, pattern, big, gameCode, minChip, userBalance);
                        }
                        big++;
                        await delay(200);
                        //totalRound--;

                        if (big <= maxCount || true) {
                            await sendSpinDragonTreasureStartReq(ws, root, sendSpinCmd, sendSpinRoute, minChip, totalRound);
                            break;
                        }
                    }
                }
            }
        } catch (err) {
            console.error("🔥 Error processing message:", err);
        }
    });

    // socket error
    ws.on('error', (err) => {
        console.error('⚠️ WebSocket error:', err);
    });

    // socket close
    ws.on('close', () => {
        console.log('❌ Connection closed');
        stopPing();
    });
}



