export type Consoles = {
    error: Function;
    debug: Function;
    info: Function;
    warn: Function;
    input: Function;
    select: Function;
    colors: any;
}
export type Consoles = {
  colored: bool;
  options: string[];
  multi: bool;
  
}

export type EventsStorage = {
  name: string;
  cb: Function;
}

export type PluginSetup = {
  _1m$e: string;
  _e2$c: Function;
  _c4$a: string | string[];
  _$f1o: string;
  _l$U7: number;
  _r$2o: "group" | "private" | "all";
  $_c3t: bool;
  $_D_: string;
}