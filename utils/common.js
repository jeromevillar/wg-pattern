const db = require('../models');
const {getRouteForCmd} = require("../utils/cmdMap");
const {aesEncryptECB, aesDecryptECB} = require("../utils/crypto");
const { atob } = require("node:buffer"); // Node.js 16+ or use polyfill
const WebSocket = require('ws');

const AES_KEY = '3D334C30D5E6CEDD';
let pingTimer = null;
let count = 0

const SPIN_RESPONSE_ROUTES = [
    "com_protocol.CommonElecBetRsp",
    "com_protocol.FortuneToucanStartRsp",
    "com_protocol.FestivalSaintsStartRsp",
    "com_protocol.MrTurtleStartRsp",
    "com_protocol.QueenOfBountyStartRsp",
    "com_protocol.WildBountyShowdownStartRsp",
    "com_protocol.MahjongWaysStartRsp",
    "com_protocol.PiratesTreasureStartRsp",
    "com_protocol.CrazyStartRsp",
    "com_protocol.DragonTreasureStartRsp",
    "com_protocol.DragonTreasure2StartRsp",
    "com_protocol.SambaDanceStartRsp",
    "com_protocol.TreasureMarmosetsStartRsp",
    "com_protocol.DragonVsTigerStartRsp",
    "com_protocol.WorldCupStartRsp",
    "com_protocol.WuKongStartRsp",
    "com_protocol.AnimalKingDomStartRsp",
    "com_protocol.DragonTreasure2StartRsp",
    "com_protocol.FortuneDragonStartRsp",
    "com_protocol.TreasureBowlStartRsp",
    "com_protocol.FishingMasterBetInfoRsp",
    "com_protocol.SuperAceStartRsp",
    "com_protocol.CocosRichesGetGameScreenRsp",
    "com_protocol.SuperFruitStartRsp"
]

exports.delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

exports.sendMessage = async (ws, { cmd, route }, payload, root) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
        console.error("WGNetwork: WebSocket not connected =>", cmd);
        return;
    }

    console.log(`✅ [${count}] [Request] [${cmd}] [${route}] => ${payload ? JSON.stringify(payload) : ""}`);

    let encoded = null;
    if (payload && Object.keys(payload).length > 0) {
        const MessageType = root.lookupType(route);
        const message = MessageType.create(payload);
        encoded = MessageType.encode(message).finish(); // Uint8Array
    }

    const bodyLength = encoded ? encoded.length : 0;
    const buffer = new ArrayBuffer(4 + bodyLength);
    const view = new DataView(buffer);
    view.setUint32(0, cmd, true); // little-endian

    const fullMessage = new Uint8Array(buffer);
    if (encoded) fullMessage.set(encoded, 4);

    const base64 = Buffer.from(fullMessage).toString('base64');
    const encrypted = aesEncryptECB(base64, AES_KEY);

    const encryptedBytes = new Uint8Array(Buffer.from(encrypted, 'utf8'));
    const totalLength = 2 + encryptedBytes.length;

    const finalBuffer = new ArrayBuffer(totalLength);
    const finalView = new DataView(finalBuffer);
    finalView.setUint16(0, totalLength, true);

    const finalPacket = new Uint8Array(finalBuffer);
    finalPacket.set(encryptedBytes, 2);

    ws.send(finalPacket);
}

exports.receiveMessage = async (root, message) => {
    const data = new Uint8Array(message);
    if (data.byteLength < 6) {
        console.warn("❌ WGNetwork: Wrong message length");
        return;
    }
    const sliced = data.slice(2, 2 + data.byteLength);
    let encryptedStr = '';
    const iterator = sliced[Symbol.iterator]();
    let result;
    while (!(result = iterator.next()).done) {
        encryptedStr += String.fromCharCode(result.value);
    }
    const decryptedBase64 = aesDecryptECB(encryptedStr, AES_KEY);
    if (!decryptedBase64) {
        console.error("❌ AES decryption failed");
        return;
    }
    const rawBytes = Uint8Array.from(atob(decryptedBase64), c => c.charCodeAt(0));
    
    const dataView = new DataView(rawBytes.buffer);
    const cmd = dataView.getUint32(0, true);

    if (cmd == 0) {
        //console.log(`📤 Received Pong`);
    } else {
        const body = rawBytes.slice(4);
        const route = getRouteForCmd(cmd);
        if (!route) {
            console.warn("⚠️ Unknown cmd:", cmd);
            return;
        }
        if (!root) {
            console.warn("⏳ Proto root not loaded yet");
            return;
        }

        if (route != "com_protocol.BroadCastPrizePoolTotalAmount")
            console.log(`✅ [${count}] [Response] [${cmd}] [${route}]`);

        if (SPIN_RESPONSE_ROUTES.includes(route))
            count ++;
            
        const MessageType = root.lookupType(route);
        const decoded = MessageType.decode(body);
        const response = MessageType.toObject(decoded, {
            longs: String,
            enums: String,
            bytes: String,
        });
        
        // if (route != "com_protocol.BroadCastPrizePoolTotalAmount"){
        //     console.log(`✅ [Response] [${cmd}] [${route}] =>`, response);
        // }

        return {
            cmd: cmd,
            route: route,
            response: response
        };
    }
}

exports.startPing = (ws) => {
    const PING_INTERVAL = 3000; // 3 seconds
    const PING_MESSAGE = Buffer.from("GgBuT0VQZXRVZkM4eUlRdklYaUlDOXR3PT0=", "base64");

    if (pingTimer) clearInterval(pingTimer);

    pingTimer = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
            //console.log("📤 Sending Ping");
            let data = Buffer.from(PING_MESSAGE);
            ws.send(data);
        } else {
            console.warn("❌ Cannot send ping, WebSocket not open");
            clearInterval(pingTimer);
        }
    }, PING_INTERVAL);
}

exports.stopPing = () => {
    if (pingTimer) clearInterval(pingTimer);
}

exports.sendClientLoginReq = async (ws, root, agent, deviceId, gameId, account) => {
    const cmd = 11;
    const route = getRouteForCmd(cmd);
    if (!route) {
        console.warn("Unknown cmd:", cmd);
        return;
    }
    let reqData = {
        "agentCode": agent,
        "clientType": 5,
        "deviceId": deviceId,
        "gameType": gameId,
        "loginType": 0,
        "roomId": "undefined",
        "tableId": 0,
        "username": account,
    };
    await this.sendMessage(ws, { cmd: cmd, route: route }, reqData, root);
}

exports.sendDivisionActivityReq = async (ws, root, gameId) => {
    const cmd = 207;
    const route = getRouteForCmd(cmd);
    if (!route) {
        console.warn("Unknown cmd:", cmd);
        return;
    }
    let reqData = {
        "gameType": gameId,
    };
    await this.sendMessage(ws, { cmd: cmd, route: route }, reqData, root);
}

exports.sendSpin = async (ws, root, cmd, route, betAmount, totalRound)  => {
    let reqData = {
        "betRateIdx": 0,
        "clientBetValue": betAmount,
        "currRound": false,
        "index": 0,
        "totalRound": totalRound,
    };
    await this.sendMessage(ws, { cmd: cmd, route: route }, reqData, root);
}

exports.sendSpinCommonElecBetReq = async (ws, root, cmd, route, betAmount, totalRound)  => {
    let reqData = {
        "autoInfo": null,
        "betIdx": 0,
        "betTimesIdx": 0,
        "clientBetValue": betAmount,
    };
    await this.sendMessage(ws, { cmd: cmd, route: route }, reqData, root);
}

exports.sendSpinMahjongWaysStartReq = async (ws, root, cmd, route, betAmount, totalRound)  => {
    let reqData = {
        "betRateIdx": 0,
        "clientBetValue": betAmount,
        "currRound": false,
        "index": 0,
        "totalRound": totalRound,
    };
    await this.sendMessage(ws, { cmd: cmd, route: route }, reqData, root);
}

exports.sendSpinFestivalSaintsStartReq = async (ws, root, cmd, route, betAmount, totalRound)  => {
    let reqData = {
        "betRateIdx": 0,
        "clientBetValue": betAmount,
        "currRound": 0,
        "index": 0,
        "totalRound": totalRound,
    };
    await this.sendMessage(ws, { cmd: cmd, route: route }, reqData, root);
}

exports.sendSpinCrazyStartReq = async (ws, root, cmd, route, betAmount, totalRound)  => {
    let reqData = {
        "betRateIdx": 0,
        "clientBetValue": betAmount,
        "currRound": totalRound,
        "index": 0,
        "totalRound": totalRound,
    };
    await this.sendMessage(ws, { cmd: cmd, route: route }, reqData, root);
}


exports.sendSpinDragonTreasureStartReq = async (ws, root, cmd, route, betAmount, totalRound)  => {
    let reqData = {
        "amountIdx": 0,
        "autoRound": 0,
        "clientBetValue": betAmount,
        "rateIdx": 0,
    };
    await this.sendMessage(ws, { cmd: cmd, route: route }, reqData, root);
}

exports.sendSpinDragonTreasure2StartReq = async (ws, root, cmd, route, betAmount, totalRound)  => {
    let reqData = {
        "amountIdx": 0,
        "autoFirst": true,
        "autoRound": totalRound,
        "clientBetValue": betAmount,
        "rateIdx": 0,
    };
    await this.sendMessage(ws, { cmd: cmd, route: route }, reqData, root);
}

exports.sendSpinTreasureBowlStartReq = async (ws, root, cmd, route, betAmount, totalRound)  => {
    let reqData = {
        "amountIdx": 0,
        "autoFirst": true,
        "autoRound": totalRound,
        "bgMode": false,
        "bgRate": 1,
        "clientBetValue": betAmount,
        "rateIdx": 0,
    };
    await this.sendMessage(ws, { cmd: cmd, route: route }, reqData, root);
}

exports.sendSpinFishingMasterBetInfoReq = async (ws, root, cmd, route, betAmount, totalRound)  => {
    let reqData = {
        "autoGameNum": totalRound,
        "betSum": betAmount,
        "curGameNum": 9999,
    };
    await this.sendMessage(ws, { cmd: cmd, route: route }, reqData, root);
}

exports.sendSpinFortuneDragonStartReq = async (ws, root, cmd, route, betAmount, totalRound)  => {
    let reqData = {
        "betRateIdx": 0,
        "clientBetValue": betAmount,
        "currRound": 9999,
        "index": 0,
        "openWin": false,
        "totalRound": totalRound,
    };
    await this.sendMessage(ws, { cmd: cmd, route: route }, reqData, root);
}

exports.sendSpinAnimalKingDomStartReq = async (ws, root, cmd, route, betAmount, totalRound)  => {
    let reqData = {
        "betRateIdx": 0,
        "clientBetValue": betAmount,
        "currRound": 9999,
        "index": 0,
        "totalRound": totalRound,
    };
    await this.sendMessage(ws, { cmd: cmd, route: route }, reqData, root);
}

exports.sendSpinWuKongStartReq = async (ws, root, cmd, route, betAmount, totalRound)  => {
    let reqData = {
        "betRateIdx": 0,
        "clientBetValue": betAmount,
        "index": 0,
        "totalRound": totalRound,
    };
    await this.sendMessage(ws, { cmd: cmd, route: route }, reqData, root);
}

exports.sendSpinDragonVsTigerStartReq = async (ws, root, cmd, route, betAmount, totalRound)  => {
    let reqData = {
        "betRateIdx": 0,
        "clientBetValue": betAmount,
        "currRound": true,
        "index": 0,
        "selectedArea": [1, 2],
        "totalRound": totalRound,
    };
    await this.sendMessage(ws, { cmd: cmd, route: route }, reqData, root);
}

exports.sendSpinTreasureMarmosetsStartReq = async (ws, root, cmd, route, betAmount, totalRound)  => {
    let reqData = {
        "betRateIdx": 0,
        "clientBetValue": betAmount,
        "currRound": 0,
        "index": 0,
        "totalRound": totalRound,
    };
    await this.sendMessage(ws, { cmd: cmd, route: route }, reqData, root);
}

exports.sendSpinTreasureMarmosetsFreeGameEnd = async (ws, root, cmd, route, betAmount, totalRound)  => {
    let reqData = {
    };
    await this.sendMessage(ws, { cmd: cmd, route: route }, reqData, root);
}

exports.sendSpinSambaDanceStartReq = async (ws, root, cmd, route, betAmount, totalRound)  => {
    let reqData = {
        "betRateIdx": 0,
        "clientBetValue": betAmount,
        "currRound": 0,
        "index": 0,
        "isExMode": false,
        "totalRound": totalRound,
    };
    await this.sendMessage(ws, { cmd: cmd, route: route }, reqData, root);
}

exports.sendSpinWorldCupStartReq = async (ws, root, cmd, route, betAmount, totalRound)  => {
    let reqData = {
        "betRateIdx": 0,
        "clientBetValue": betAmount,
        "currRound": 0,
        "index": 0,
        "totalRound": totalRound,
    };
    await this.sendMessage(ws, { cmd: cmd, route: route }, reqData, root);
}

exports.sendSpinSuperFruitStartReq = async (ws, root, cmd, route, betAmount, totalRound)  => {
    let reqData = {
        "areaBet": {
            "betRateIdx": 0,
            "betType": 0,
            "index": 0
        },
        "clientBetValue": betAmount,
    };
    await this.sendMessage(ws, { cmd: cmd, route: route }, reqData, root);
}

exports.sendSpinWaterMarginStartReq = async (ws, root, cmd, route, betAmount, totalRound)  => {
    let reqData = {
        "areaBet": {
            "betRateIdx": 0,
            "betType": 0,
            "index": 0
        },
        "clientBetValue": betAmount,
    };
    await this.sendMessage(ws, { cmd: cmd, route: route }, reqData, root);
}

exports.sendSpinSuperAceStartReq = async (ws, root, cmd, route, betAmount, totalRound)  => {
    let reqData = {
        "betRateIdx": 0,
        "index": 0,
        "clientBetValue": betAmount,
        "totalRound": totalRound
    };
    await this.sendMessage(ws, { cmd: cmd, route: route }, reqData, root);
}

exports.sendSpinSuperAceGetGameScreenReq = async (ws, root, cmd, route, curSpin, curRound)  => {
    let reqData = {
        "curSpin": curSpin,
        "curRound": curRound
    };
    await this.sendMessage(ws, { cmd: cmd, route: route }, reqData, root);
}

exports.sendSpinCocosRichesGetGameScreenReq = async (ws, root, cmd, route, curSpin, curRound)  => {
    let reqData = {
        "curSpinNum": curSpin,
        "curRoundNum": curRound
    };
    await this.sendMessage(ws, { cmd: cmd, route: route }, reqData, root);
}


exports.sendSpinCocosRichesStartReq = async (ws, root, cmd, route, betAmount, totalRound)  => {
    let reqData = {
        "betRateIdx": 0,
        "index": 0,
        "clientBetValue": betAmount,
        "totalRound": totalRound
    };
    await this.sendMessage(ws, { cmd: cmd, route: route }, reqData, root);
}

exports.sendSpinFortuneSnakeStartReq = async (ws, root, cmd, route, betAmount, totalRound)  => {
    let reqData = {
        "betRateIdx": 0,
        "clientBetValue": betAmount,
        "currRound": false,
        "index": 0,
        "totalRound": totalRound,
    };
    await this.sendMessage(ws, { cmd: cmd, route: route }, reqData, root);
}

exports.sendSpinFortuneSnakeGetGameScreenReq = async (ws, root, cmd, route, curRoundNum)  => {
    let reqData = {
        "curRoundNum": curRoundNum
    };
    await this.sendMessage(ws, { cmd: cmd, route: route }, reqData, root);
}

exports.sendSpinSuperFruitSlot2StartReq = async (ws, root, cmd, route, betAmount, totalRound)  => {
    let reqData = {
        "betRateIdx": 0,
        "clientBetValue": betAmount,
        "index": 0,
        "totalRound": totalRound,
    };
    await this.sendMessage(ws, { cmd: cmd, route: route }, reqData, root);
}

exports.sendSpinQueenOfBountyStartReq = async (ws, root, cmd, route, betAmount, totalRound)  => {
    let reqData = {
        "betRateIdx": 0,
        "clientBetValue": betAmount,
        "index": 0,
        "totalRound": totalRound,
    };
    await this.sendMessage(ws, { cmd: cmd, route: route }, reqData, root);
}

exports.sendSpinWildBountyShowdownStartReq = async (ws, root, cmd, route, betAmount, totalRound)  => {
    let reqData = {
        "betRateIdx": 0,
        "buyFreeGame": false,
        "clientBetValue": betAmount,
        "currRound": 0,
        "index": 0,
        "totalRound": totalRound,
    };
    await this.sendMessage(ws, { cmd: cmd, route: route }, reqData, root);
}

exports.saveSpin = async (Model, data, big, gameCode, betAmount, userBalance) => {
    await Model.create({
        gameCode: gameCode,
        pType: data.gameDataInfo.finishGold ? 'base-win' : 'base-zero',
        type: 'spin',
        gameDone: 1,
        big,
        small: 1,
        win: data.gameDataInfo.finishGold ? data.gameDataInfo.finishGold.toFixed(2) : 0,
        totalWin: data.gameDataInfo.finishGold ? data.gameDataInfo.finishGold.toFixed(2) : 0,
        totalBet: betAmount.toFixed(2),
        virtualBet: betAmount.toFixed(2),
        rtp: data.gameDataInfo.finishGold ? (data.gameDataInfo.finishGold / betAmount * 100).toFixed(2) : 0,
        balance: userBalance.toFixed(2).toString(),
        pattern: JSON.stringify(data)
    });
}

exports.saveSpin1 = async (Model, data, gameDone, big, small, gameCode, betAmount, userBalance, win, pType, type) => {
    await Model.create({
        gameCode: gameCode,
        pType: pType,
        type: type,
        gameDone: gameDone,
        big,
        small: small,
        win: parseFloat(win).toFixed(2),
        totalWin: data.gameDataInfo.finishGold ? data.gameDataInfo.finishGold.toFixed(2) : 0,
        totalBet: betAmount.toFixed(2),
        virtualBet: betAmount.toFixed(2),
        rtp: gameDone? (data.gameDataInfo.finishGold ? (data.gameDataInfo.finishGold / betAmount * 100).toFixed(2) : 0) : 0,
        balance: userBalance.toFixed(2).toString(),
        pattern: JSON.stringify(data)
    });
}

exports.saveSpinCommonElecBetRsp = async (Model, data, big, gameCode, betAmount, userBalance) => {
    await Model.create({
        gameCode: gameCode,
        pType: (data.win && (data.win + betAmount) > 0) ? 'base-win' : 'base-zero',
        type: 'spin',
        gameDone: 1,
        big,
        small: 1,
        win: data.win ? (data.win + betAmount).toFixed(2) : 0,
        totalWin: data.win ? (data.win + betAmount).toFixed(2) : 0,
        totalBet: betAmount.toFixed(2),
        virtualBet: betAmount.toFixed(2),
        rtp: data.win ? (((data.win + betAmount)) / betAmount * 100).toFixed(2) : 0,
        balance: userBalance.toFixed(2).toString(),
        pattern: JSON.stringify(data)
    });
}