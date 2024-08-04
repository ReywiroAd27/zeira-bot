type SystemMsg = {
    
}

export type ConfigType = {
    name: string;
    version: string;
    rank: string[] | {limit?: number[] | "infinity", status: string[]}
    setup: string;
    sendTest: bool;
    menuList: {name: string, category: string, rank: number | string}[]
    type: string;
    loginWith: string;
    addons: any[];
    dbType: string;
    messages: SystemMsg;
}