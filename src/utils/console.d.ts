type Consoles = {
    error: (...args: string[]) => void;
    debug: (...args: any[]) => void;
    info: (...args: string[]) => void;
    warn: (...args: string[]) => void;
    color: any;
};
export declare const Console: Consoles;
export {};
