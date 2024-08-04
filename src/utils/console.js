"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Console = void 0;
const functions_1 = require("./functions");
const colors = {
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
exports.Console = {
    error(...args) {
        for (const arg of args) {
            console.log(colors.red + arg + colors.default);
        }
    },
    warn(...args) {
        for (const arg of args) {
            console.log(colors.yellow + arg + colors.default);
        }
    },
    info(...args) {
        for (const arg of args) {
            console.log(arg, 1, Array.isArray(arg));
        }
    },
    debug(...args) {
        for (const arg of args) {
            console.log((0, functions_1.toStringDisplay)(arg));
        }
    },
    colors
};
