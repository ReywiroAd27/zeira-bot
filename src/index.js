"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBot = void 0;
const Pino = __importStar(require("pino"));
const baileys_1 = __importStar(require("baileys"));
const functions = {
    use: makeUseFunction(),
    on: function (name, callback) {
        Emitter.add(name, callback);
    },
    remove: function (name, callback) {
        Emitter.update(name, callback);
    },
    plugin: makePluginLogic(),
    onConnection: function (name, callback) {
    }
};
const createBot = function createBot(conf) {
    var _a, _b;
    const logger = Pino().child({
        level: (_a = conf.logger.level) !== null && _a !== void 0 ? _a : "silent",
        stream: (_b = conf.logger.stream) !== null && _b !== void 0 ? _b : "store"
    });
    const store = (0, baileys_1.makeInMemoryStore)({});
    const sessionName = conf.session ? conf.session : "main";
    return {
        run: async function () {
            var _a, _b, _c;
            try {
                let usePairing = conf.loginWith == "pairing" || conf.loginWith == "code", scanQr = conf.loginWith == "qrcode" || conf.loginWith == "qr", useMobile = conf.loginWith == "mobile";
                if (conf.loginWith && !useMobile && !scanQr && !usePairing)
                    throw new ReferenceError("Your intended login method was not found");
                const { state, saveCreds } = await (0, baileys_1.useMultiFileAuthState)("../databases/session/" + sessionName);
                const { version } = await (0, baileys_1.fetchLatestBaileysVersion)();
                const database = Database(conf.database);
                database.load();
                if (!conf.loginWith) {
                    const result = await Console.select({
                        colored: true,
                        header: true,
                        optionsType: "number",
                        multiSelect: false
                    }, `Welcome to Zhour Setup Preview%red%!%c

                        For the first step you must select the login method: `, "With Qr-Code", "Use Pairing-Code", "Use Mobile");
                    scanQr = result(0);
                    usePairing = result(1);
                    useMobile = result(2);
                }
                const socket = (0, baileys_1.default)((_a = conf.baileys) !== null && _a !== void 0 ? _a : {
                    version,
                    printQRInTerminal: scanQr,
                    generateHighQualityLinkPreview: true,
                    auth: {
                        creds: state.creds,
                        keys: (0, baileys_1.makeCacheableSignalKeyStore)(state.keys, Pino({
                            level: "silent"
                        }))
                    },
                    logger: Pino({
                        level: (_b = conf.logger.level) !== null && _b !== void 0 ? _b : "silent"
                    }),
                    browser: (_c = conf.browser) !== null && _c !== void 0 ? _c : ["Windows", "chrome", version.join(".")]
                });
                store.readFromFile("../databases/session/store.json");
                setInterval(async () => {
                    await store.writeToFile("../databases/session/store.json");
                }, 10000);
                store.bind(socket.ev);
                if (!sock.authState.creds.registered) {
                    if (usePairing) {
                        if (useMobile)
                            throw new ReferenceError("Cannot use pairing code with mobile api");
                        const phoneNumber = await Console.input({
                            colored: true
                        }, "please enter your whatsapp number:\n> %yellow%");
                        const code = await socket.requestPairingCode(phoneNumber);
                        Console.log({
                            colored: true
                        }, "Your pairing code: %yellow%" + code);
                    }
                    if (useMobile) {
                        /* mobile api */
                    }
                }
                socket.ev.on('connection.update', (conn) => {
                    var _a, _b;
                    const { connection, qr, lastDisconnect } = conn;
                    if (connection == "open") {
                        listeners.emit("conn_open", {});
                    }
                    else if (connection == "close") {
                        const reason = (_b = (_a = lastDisconnect === null || lastDisconnect === void 0 ? void 0 : lastDisconnect.error) === null || _a === void 0 ? void 0 : _a.output) === null || _b === void 0 ? void 0 : _b.statusCode;
                        listeners.emit("conn_close", reason);
                    }
                    else if (connection == "connecting") {
                        listeners["connection"].emit("connecting");
                    }
                });
                socket.ev.on("creds.update", async () => await saveCreds);
                socket.ev.on("call", (e) => listeners.emit("call", e));
                socket.ev.on("messages.upsert", async (msgs) => {
                    for (const msg of msgs.messages) {
                        const m = await Serialize(socket, msg);
                        Emitter.emit("message", sock, m);
                    }
                });
                database.write({
                    loop: true,
                    delay: 5000
                });
            }
            catch (e) {
                Console.error(e);
            }
        },
        ...functions
    };
};
exports.createBot = createBot;
exports.default = exports.createBot;
