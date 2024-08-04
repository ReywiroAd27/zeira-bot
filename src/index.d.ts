import { Conf, Callback } from "./setup/constant";
export declare const createBot: (conf: Conf) => {
    use: any;
    on: (name: string, callback: Callback) => void;
    remove: (name: string, callback: Callback) => void;
    plugin: any;
    onConnection: (name: string, callback: Callback) => void;
    run: () => Promise<void>;
};
export default createBot;
