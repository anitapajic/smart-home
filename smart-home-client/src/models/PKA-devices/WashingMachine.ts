import { Device } from "../Device";

export interface WashingMachine extends Device{
    
}

export interface WashingMachineAutoDTO {
    "id"?: number,
	"wmId": number,
	"time" : string,
	"date" : string,
	"mode": WMMode,
}


export interface WashingMachineAutoMode {
    "id": number,
	"wmId": number,
	"time" : string,
	"date" : string,
	"mode": WMMode,
}

export interface WMMode {
	"id"?: number,
	"name" : string,
	"duration": number,
	"temperature": number

}