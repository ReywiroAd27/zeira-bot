"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeSocket = makeSocket;
exports.connectionStatus = connectionStatus;
exports.connectionEvents = connectionEvents;
const baileys_1 = require("@whiskeysockets/baileys");
const utils_1 = require("../utils");
function makeSocket(conf) {
    return (0, baileys_1.makeWASocket)(conf);
}
async function connectionStatus(sock, conf) {
    sock.ev.on("connection.update", async (ev) => {
        var _a, _b;
        console.log((0, utils_1.readObjOrArray)(ev));
        const { connection, lastDisconnect, qr } = ev;
        if (connection) {
            utils_1.Console.info(connection);
        }
        if (connection == "close") {
            const reason = (_a = lastDisconnect === null || lastDisconnect === void 0 ? void 0 : lastDisconnect.error) === null || _a === void 0 ? void 0 : _a.output.statusCode;
            if (reason === baileys_1.DisconnectReason.badSession) {
                utils_1.Console.error(`Bad Session File, Please Delete Session and Scan Again`);
                process.send('reset');
            }
            else if (reason === baileys_1.DisconnectReason.connectionClosed) {
                utils_1.Console.error("Connection closed, reconnecting....");
                await process.send("restart");
            }
            else if (reason === baileys_1.DisconnectReason.connectionLost) {
                utils_1.Console.error("Connection Lost from Server, reconnecting...");
                await process.send("restart");
            }
            else if (reason === baileys_1.DisconnectReason.connectionReplaced) {
                utils_1.Console.error("Connection Replaced, Another New Session Opened, Please Close Current Session First");
                process.exit(1);
            }
            else if (reason === baileys_1.DisconnectReason.loggedOut) {
                utils_1.Console.error(`Device Logged Out, Please Scan Again And Run.`);
                process.exit(1);
            }
            else if (reason === baileys_1.DisconnectReason.restartRequired) {
                utils_1.Console.error("Restart Required, Restarting...");
                await process.send("restart");
            }
            else if (reason === baileys_1.DisconnectReason.timedOut) {
                utils_1.Console.error("Connection TimedOut, Reconnecting...");
                process.send('reset');
            }
            else if (reason === baileys_1.DisconnectReason.multideviceMismatch) {
                utils_1.Console.error("Multi device mismatch, please scan again");
                process.exit(0);
            }
            else {
                utils_1.Console.error(reason);
                process.send('reset');
            }
        }
        if (connection === "open" && conf.sendTest) {
            sock.sendMessage(conf.numbers[0] + "@s.whatsapp.net", {
                text: `${((_b = sock === null || sock === void 0 ? void 0 : sock.user) === null || _b === void 0 ? void 0 : _b.name) || conf.name} has Connected...`,
            });
        }
    });
}
function connectionEvents(sock, conf, name, callback) {
    if (conf.setup == "manual") {
        if (!utils_1.EventEmitter.check(name)) {
            utils_1.EventEmitter.add(name, callback);
            return;
        }
        utils_1.EventEmitter.update(name, callback);
    }
    else if (conf.setup == "auto") {
        utils_1.EventEmitter.update(name, callback);
    }
}
