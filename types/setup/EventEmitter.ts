import { EventsStorage } from "./constant";
export const Emitter = (new class Emitter {
    private Events: EventsStorage[] = [];
    add(name: string, cb: Function) {
        if (typeof name == "undefined" || name == "") throw new ReferenceError("the 'name' must be filled")
        if (typeof cb == "undefined") throw new ReferenceError("the type of 'cb' must only be function")
        this.Events.push({name,cb})
    }
    update(name: string, cb: Function) {
        if (typeof name == "undefined" || name == "") throw new ReferenceError("the 'name' must be filled")
        if (typeof cb == "undefined") throw new ReferenceError("the type of 'cb' must only be function")
        for (const event of this.Events) {
            if (event.name == name) {
                event.cb = cb
                break
            }
        }
    }
    check(name: string) {
        if (typeof name == "undefined" || name == "") throw new ReferenceError("the 'name' must be filled")
        const event = this.Events.filter((i: EventsStorage) =>i.name==name)
        return Boolean(event)
    }
    emit(name: string, ...data: null | any) {
        if (typeof name == "undefined" || name == "") throw new ReferenceError("the 'name' must be filled")
        for (const event of this.Events) {
            if (event.name == name) {
                event.cb(...data)
            }
        }
    }
})