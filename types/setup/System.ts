import {
    readFileSync,
    writeFileSync,
    existsSync,
    stat,
    statSync,
    readdirSync
} from "fs";
import { createHash } from "crypto"
import { Console } from "../utils/console"
import { PluginSetup } from "./constant";

export function isNullArray(a: any[], r: any) {
  if (!Array.isArray(a)) throw new Error("the type of input must only be array")
  if (a.length < 1) return r
  else return a
}

export function Formatter()

export class LoadError extends Error {
    constructor(m: string) {
        super(m);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export function hash(d: string) {
  return crypto.createHash("sha256").update(d).digest("hex")
}

export function makeUseFunction(t: any) {
    return function use(i: any) {
      if (typeof i !== "function") return Console.error("Can't use the System")
    };
}

export function makePluginLogic() {
    function readdirs(url: string) {
        let plugins: PluginSetup[] = [];
        const d = readdirSync(url);
        for (const item of d) {
            const s = statSync(url + "/" + item);
            if (s.isDirectory()) {
                const d = readdir(url + "/" + item);
                plugins.concat(d);
            } else if (s.isFile()) {
                if (
                    !(
                        item.endsWith(".js") ||
                        item.endsWith(".mjs") ||
                        item.endsWith(".cjs")
                    )
                ) continue;
                const data = import(url + "/" + item);
                if (
                    !(
                        data.hasOwnProperty("name") &&
                        data.hasOwnProperty("exec") &&
                        data.hasOwnProperty("category")
                    )
                ) continue;
                plugins.push({
                    _1m$e: data.name,
                    _e2$c: data.exec,
                    _c4$a: data.category,
                    _$f1o: data?.for || "all",
                    _l$U7: data?.useLimit || 0,
                    _r$2o: data?.room || "all",
                    $_c3t: data?.editable || false,
                    $_D_: url + "/" + item
                });
            }
        }
        return plugins;
    }
    return function plugin(l: string) {
        if (typeof m !== "string") throw new ReferenceError(
                "unexpected type of location, it should be of type string but why is it of type: " +
                    typeof m
            );
        const dir: string = l.startsWith("./")
                ? l.replace(/^\.\//, __dirname)
                : l.startsWith(__dirname)
                ? l
                : __dirname + l,
            plugins: PluginSetup[] = [];
        if (!existsSync(dir)) throw new LoadError("can't load plugins at directory: '" + m + "'");
        stat(dir, async (_, s) => {
            if (s.isDirectory()) {
                const d = readdirSync(dir);
                for (const item of d) {
                    const s = statSync(dir + "/" + item);
                    if (s.isDirectory()) {
                        const d = readDir(dir + "/" + item);
                        plugins.concat(d);
                    } else if (s.isFile()) {
                        if (
                            !(
                                item.endsWith(".js") ||
                                item.endsWith(".mjs") ||
                                item.endsWith(".cjs")
                            )
                        ) continue;
                        const data = import(dir + "/" + item);
                        if (
                            !(
                                data.hasOwnProperty("name") &&
                                data.hasOwnProperty("exec") &&
                                data.hasOwnProperty("category")
                            )
                        )
                            continue;
                        plugins.push({
                            _1m$e: data.name,
                            _e2$c: data.exec,
                            _c4$a: data.category,
                            _$f1o: data?.for || "all",
                            _l$U7: data?.useLimit || 0,
                            _r$2o: data?.room || "all",
                            $_c3t: data?.editable || false,
                            $_D_: dir + "/" + item
                        });
                    }
                }
            } else if (s.isFile()) {
                if (
                    !(
                        item.endsWith(".js") ||
                        item.endsWith(".mjs") ||
                        item.endsWith(".cjs")
                    )
                ) continue;
                const data = import(dir + "/" + item);
                if (
                    !(
                        data.hasOwnProperty("name") &&
                        data.hasOwnProperty("exec") &&
                        data.hasOwnProperty("category")
                    )
                ) continue;
                plugins.push({
                    _1m$e: data.name,
                    _e2$c: data.exec,
                    _c4$a: data.category,
                    _$f1o: data?.for || "all",
                    _l$U7: data?.useLimit || 0,
                    _r$2o: data?.room || "all",
                    $_c3t: data?.editable || false,
                    $_D_: dir + "/" + item
                });
            }
        });
        return function pluginLoad(bot,libs) {

          bot.onChat(async function(chat)=>{
            let isSkip = false
            libs.chatLogger(chat,bot.conf)
            libs.Emitter.emit("filter", chat)
            libs.Emitter.add("onFilter", ()=>{
              isSkip = true
            })
            if (isSkip) {
              return Console.info("chat has been filtered")
            }
            if (libs.isCommand(chat?.text||chat?.caption),{prefix: bot.conf.prefix||"#"}) {
              libs.getPlugins = ()=>plugins
              for (const plugin of plugins) {
                  if (libs.db&&bot.conf.rank&&plugin?.for) {
                    const userDb = libs.db.get(chat.sender),
                    idb = bot.conf.rank.indexOf(userDb?.status),
                    ipr = bot.conf.rank.indexOf(plugin?.for)
                    if (userDb?.status !== plugin?.for && idb < ipr) {
                      if (bot.conf.sendCondition) bot.sendText(Formatter(bot.conf.msg.rank, {pRank: plugin.for, uRank: userDb.status}))
                      return
                    }
                    if (plugin?.room&&plugin.room !== "all"&&plugin.room !== chat.room) {
                      if (bot.conf.sendCondition) bot.sendText(Formatter(bot.conf.msg.room,{room: chat.room}))
                      return
                    }
                }
                await _e2$c(chat,bot,libs)
              }
            }
          })
          return function filter(targets: string[] | string) {
            libs.Emitter.add("filter",(chat)=>{
              if (typeof targets === "string"&&(chat.sender === targets || chat.id === targets || chat?.text?.includes(targets) || chat?.caption?.includes(targets))) {
                  libs.Emitter.emit("onFilter")
                  return
              }
              if (!Array.isArray(targets)) throw new Error("can't filter the chat")
              for (const target of targets) {
                if (chat.sender === target || chat.id === target || chat?.text?.includes(target) || chat?.caption?.includes(target)) {
                  libs.Emitter.emit("onFilter")
                }
              }
            })
          }
        }
    };
}
