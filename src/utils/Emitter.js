"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const listeners = [];
EventsEmitter: TypeEmitter = {
    add: (name, cb) => {
        if (typeof name !== "string")
            throw new SyntaxError("type of name must only be string");
        if (typeof cb !== "function")
            throw new SyntaxError("type of cb must only be function");
        for (const listen of listeners) {
            if (listen.name == name)
                throw new ReferenceError(`${name} was already declared`);
        }
        listeners.push({ name, cb });
    }
};
{
    let index = 0;
    listeners.forEach((d, i) => {
        if (d.name == name) {
            index = i;
        }
    });
    listeners[index].cb = cb;
}
check(name, string);
{
    for (const data of listeners) {
        if (data.name == name)
            return true;
    }
    return false;
}
emit(name, string, data, any);
{
    for (const list of listeners) {
        if (list.name == name)
            list.cb(data);
    }
}
