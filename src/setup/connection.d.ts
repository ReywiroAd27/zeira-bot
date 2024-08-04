import { UserFacingSocketConfig, WASocket } from "@whiskeysockets/baileys";
import { ConfigType } from "./config";
export declare function makeSocket(conf: UserFacingSocketConfig): any;
export declare function connectionStatus(sock: WASocket, conf: ConfigType): Promise<void>;
export declare function connectionEvents(sock: WASocket, conf: ConfigType, name: string, callback: (event: any) => any): void;
