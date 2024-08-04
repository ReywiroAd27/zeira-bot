import * as chalk from "chalk";
import * as Pino from "pino";
import * as fs from "fs";
import * as path from "path";
import * as NodeCache from "node-cache";
import * as moment from "moment-timezone";
import { Boom } from "@hapi/boom";
import { Conf, iDatabase } from "./setup/constant";
import { makeUseFunction, makePluginLogic } from "./setup/system";
import { Console } from "./utils/console";
import makeWASocket, {
    useMultiFileAuthState,
    DisconnectReason,
    makeInMemoryStore,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    jidNormalizedUser
} from "baileys";

const functions = {
    use: makeUseFunction(),
    on: function on(name: string, callback: Function) {
        Emitter.add(name, callback);
    },
    remove: function remove(name: string, callback: Function) {
        Emitter.update(name, callback);
    },
    plugin: makePluginLogic(),
    onChat: function onChat(callback: Function) {
      
    },
    onConnection: function onConnection(name: string, callback: Function) {
      
    }
};

export const createBot = function createBot(conf: Conf) {
    const logger = Pino().child({
        level: conf.logger.level ?? "silent",
        stream: conf.logger.stream ?? "store"
    });
    const store = makeInMemoryStore({});
    const sessionName = conf.session ? conf.session : "main";
    return {
        run: async function () {
            try {
                let usePairing =
                        conf.loginWith == "pairing" || conf.loginWith == "code",
                    scanQr =
                        conf.loginWith == "qrcode" || conf.loginWith == "qr" || !useMobile || !usePairing,
                    useMobile = conf.loginWith == "mobile";
                if (conf.loginWith && !useMobile && !scanQr && !usePairing)
                    throw new ReferenceError(
                        "Your intended login method was not found"
                    );
                const { state, saveCreds } = await useMultiFileAuthState(
                    "../databases/session/" + sessionName
                );

                const { version } = await fetchLatestBaileysVersion();

                const database: iDatabase = Database(conf.database);
                database.load();

                if (!conf.loginWith) {
                    const result = await Console.select(
                        {
                            colored: true,
                            listStyle: "number",
                            multi: false,
                            options: ["With Qr-Code", "Use Pairing-Code", "Use Mobile"]
                        },
                        `Welcome to Zhour Setup Preview%red%!%c

                        For the first step you must select the login method: `
                    );
                    scanQr = result(0);
                    usePairing = result(1);
                    useMobile = result(2);
                }

                const socket = makeWASocket(
                    conf.baileys ?? {
                        version,
                        printQRInTerminal: scanQr,
                        generateHighQualityLinkPreview: true,
                        auth: {
                            creds: state.creds,
                            keys: makeCacheableSignalKeyStore(
                                state.keys,
                                Pino({
                                    level: "silent"
                                })
                            )
                        },
                        logger: Pino({
                            level: conf.logger.level ?? "silent"
                        }),
                        browser: conf.browser ?? [
                            "Windows",
                            "chrome",
                            version.join(".")
                        ]
                    }
                );

                store.readFromFile("../databases/session/store.json");
                setInterval(async () => {
                    await store.writeToFile("../databases/session/store.json");
                }, 10000);
                store.bind(socket.ev);

                if (!sock.authState.creds.registered) {
                    if (usePairing) {
                        if (useMobile)
                            throw new ReferenceError(
                                "Cannot use pairing code with mobile api"
                            );
                        const phoneNumber = await Console.input(
                            {
                                colored: true
                            },
                            "please enter your whatsapp number:\n> %yellow%"
                        );
                        const code =
                            await socket.requestPairingCode(phoneNumber);
                        Console.log(
                            {
                                colored: true
                            },
                            "Your pairing code: %yellow%" + code
                        );
                    }

                    if (useMobile) {
                        /* mobile api */
                    }
                }

                socket.ev.on("connection.update", conn => {
                    const { connection, qr, lastDisconnect } = conn;
                    if (connection == "open") {
                        listeners.emit("conn_open", {});
                    } else if (connection == "close") {
                        const reason = (lastDisconnect?.error as Boom)?.output
                            ?.statusCode;
                        listeners.emit("conn_close", reason);
                    } else if (connection == "connecting") {
                        listeners["connection"].emit("connecting");
                    }
                });

                socket.ev.on("creds.update", async () => await saveCreds);

                socket.ev.on("call", (e: any) => listeners.emit("call", e));

                socket.ev.on("messages.upsert", async (msgs: any) => {
                    for (const msg of msgs.messages) {
                        const m = await Serialize(socket, msg);
                        Emitter.emit("message", sock, m);
                    }
                });
                database.write({
                    loop: true,
                    delay: 10000
                });
            } catch (e: any) {
                Console.error(e);
            }
        },
        ...functions
    };
};

export default createBot;
