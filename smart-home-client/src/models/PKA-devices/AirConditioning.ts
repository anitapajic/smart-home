import { Device } from "../Device";


export interface AirConditioning extends Device{
   
}

export interface ACAutoModeDTO {
    "id"?: number,
	"acId": number,
	"from" : string,
	"to": string,
	"mode": string,
	"temperature": number,

	"condition": boolean,
	"conditionTemperature": number
}


export interface ACAutoMode {
    "id": number,
	"acId": number,
	"fromTime" : string,
	"toTime": string,
	"mode": string,
	"temperature": number,

	"condition": boolean,
	"conditionTemperature": number
}