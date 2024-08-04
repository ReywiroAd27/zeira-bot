export function isSame(data1: any, data2: any) {
    if (typeof data1 !== typeof data2) return false
    if (Array.isArray(data1) !== Array.isArray(data2)) return false
    if ((data1 instanceof RegExp) !== (data2 instanceof RegExp)) return false
    if (data1 instanceof RegExp && String(data1) !== String(data2)) return false
    if (data1 instanceof RegExp && String(data1) === String(data2)) return true
    if (data1 === data2) return true
    if (Array.isArray(data1)) {
        if (data1.length !== data2.length) return false
        for (let i = 0; i < data1.length; i++) {
            if (data1[i] !== data2[i]) return false
        }
        return true
    } else if (typeof data1 == "object") {
        for (const v in data1) {
            if (typeof data2[v] === "undefined") return false
            if (data1[v] !== data2[v]) return false
        }
        for (const v in data2) {
            if (typeof data1[v] === "undefined") return false
        }
        return true
    }
}
