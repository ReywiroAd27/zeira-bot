import {
    isSame
} from "./tools"
import {
    Consoles,
    ConsoleOptions
} from "./../setup/constant"
import { createInterface } from "readline";

const colors: any = {
    default: "\x1b[0m",
    black: "\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
    bgBlack: "\x1b[40m",
    bgRed: "\x1b[41m",
    bgGreen: "\x1b[42m",
    bgYellow: "\x1b[43m",
    bgBlue: "\x1b[44m",
    bgMagenta: "\x1b[45m",
    bgCyan: "\x1b[46m",
    bgWhite: "\x1b[47m"
};

const interfaceInput = createInterface({
  input: process.stdin,
  output: process.stdout
})

function generateList(o: string[], t: "number" | "char" | null = "number") {
  let text: string = "\n",
  i: number = 0,
  char: string[] | string = []
  if (t == "char") {
    char = "abcdefghijklmnopqrstuvwxyz"
    if (o.length > char.length) {
      const t: string[] = []
      let index: number = 0
      while (i < o.length-1) {
        for (const v in char) {
          t.push(v+index)
        }
        index++
      }
      char = t
    }
  }
  for (const v of o) {
    i++
    text += `${t === "char" ? char[i] : i}. ${v}\n`
  }
  return text
}
export const Console: Consoles = {
    error(...args: string[]) {
        const fArg = args[0],
        lArg = args[args.length-1]
        args[0] = typeof args[0] == "string" ? colors.bgRed+args[0]: "!@/$1&@7&20&=,?8*!"
        args = args[0] == "!@/$1&@7&20&=,?8*!" ? args.map((v, i)=> i == 0 ? colors.bgRed: i == 2 ? fArg: args[i-1]): args
        if (args.length > 1 && !isSame(args[args.length-1], lArg)) args.push(typeof lArg == "string" ? lArg+colors.default: lArg)
        if (args.length <= 1 && !isSame(args[args.length-1], fArg)) args.push(colors.default)
        if (isSame(args[args.length-1], lArg)) args.push(colors.default)
        console.log(...args)
    },
    async input(text: string) {
      return new Promise<string>((resolve) => interfaceInput.question(text, resolve))
    },
    async select(opts: ConsoleOptions | string, text: string | ConsoleOptions) {
      let use1arg = false
      if (typeof opts === "string" && typeof text === "string") use1arg = true
      if (typeof opts === "object" && (Array.isArray(opts) || opts instanceof RegExp) || typeof opts === "boolean" || typeof opts === "number") throw new ReferenceError("invalid arg type")
      if (typeof text === "object" && (Array.isArray(text) || text instanceof RegExp) || typeof text === "boolean" || typeof text === "number") throw new ReferenceError("invalid arg type")
      if (typeof opts === "object" && typeof text === "object") throw new ReferenceError("invalid arg type")
      if (typeof opts === "string" && typeof text === "object") {
        let t = [opts, text]
        opts = t[1]
        text = t[0]
      }
      if (typeof opts?.options === "undefined") throw new ReferenceError("Can't find the options list")
      let fullText: string = text,
      result: string = "";
      fullText += await generateList(opts.options, opts?.listType ?? "number")
      fullText += opts?.multiSelect ? "you can select more than one option (use ',' or '&' to select more than one option)" : "please select one of the options"
      do {
        result = await this.input(fullText)
        if (result === "cancel" || result === "0") return null
        result = isFinite(result) ? opts.options[parseInt(result)] : result
        if (!opts.options.includes(result)) console.log("the option isn't on list, please select the true option")
      } while (!opts.options.includes(result))
      interfaceInput.close()
      return result
    },
    info(...args: string[]) {
        for (const arg of args) {
            console.log(arg, 1, Array.isArray(arg))
        }
    },
    debug(...args: any[]) {
        for (const arg of args) {
            //console.log(toStringDisplay(arg,))
        }
    },
    colors
}

Console.error(generateList(["tezt"]))