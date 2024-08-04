import {
    makeWASocket as socket,
    UserFacingSocketConfig,
    DisconnectReason,
    WASocket
} from "@whiskeysockets/baileys"
import { Boom } from "@hapi/boom"
import { readObjOrArray, Console, EventEmitter as listener} from "../utils"
import { ConfigType } from "./config"

export function makeSocket(conf: UserFacingSocketConfig) {
    return socket(conf)
}

export async function  connectionStatus(sock: WASocket, conf: ConfigType) {
    sock.ev.on("connection.update", async (ev) => {
            console.log(readObjOrArray(ev))
            const { connection, lastDisconnect, qr } = ev
            if (connection) {
                Console.info(connection)
            }
            
            if (connection == "close") {
                const reason = (lastDisconnect?.error as Boom)?.output.statusCode
                if (reason === DisconnectReason.badSession) {
                     Console.error(`Bad Session File, Please Delete Session and Scan Again`)
                    process.send('reset')
                 } else if (reason === DisconnectReason.connectionClosed) {
                    Console.error("Connection closed, reconnecting....")
                await process.send("restart")
                 } else if (reason === DisconnectReason.connectionLost) {
                    Console.error("Connection Lost from Server, reconnecting...")
                    await process.send("restart")
                 } else if (reason === DisconnectReason.connectionReplaced) {
                    Console.error("Connection Replaced, Another New Session Opened, Please Close Current Session First")
                    process.exit(1)
             } else if (reason === DisconnectReason.loggedOut) {
                    Console.error(`Device Logged Out, Please Scan Again And Run.`)
                    process.exit(1)
             } else if (reason === DisconnectReason.restartRequired) {
                    Console.error("Restart Required, Restarting...")
                    await process.send("restart")
             } else if (reason === DisconnectReason.timedOut) {
                    Console.error("Connection TimedOut, Reconnecting...")
                    process.send('reset')
             } else if (reason === DisconnectReason.multideviceMismatch) {
                    Console.error("Multi device mismatch, please scan again")
                    process.exit(0)
             } else {
                Console.error(reason)
                process.send('reset')
             }
          }

          if (connection === "open" && conf.sendTest) {
             sock.sendMessage(conf.numbers[0] + "@s.whatsapp.net", {
                text: `${sock?.user?.name || conf.name} has Connected...`,
             })
          }
    })
}

export function connectionEvents(sock: WASocket, conf: ConfigType, name: string, callback: (event: any) => any) {
    if (conf.setup == "manual") {
        if (!listener.check(name)) {
            listener.add(name, callback)
            return
        }
        listener.update(name, callback)
    } else if (conf.setup == "auto") {
        listener.update(name, callback)
    }
}