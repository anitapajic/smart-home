import { Device } from "../Device";

export interface Sprinkle extends Device{
    
}

export interface SprinklerAutoModeDTO {
    "id"?: number,
    "sprinklerId": number,
    "from": string,
    "to": string,

    "condition": boolean,
    "repeat": number,
}

export interface SprinklerAutoMode {
    "id"?: number,
    "sprinklerId": number,
    "fromTime": string,
    "toTime": string,

    "condition": boolean,
    "repeat": number,
}