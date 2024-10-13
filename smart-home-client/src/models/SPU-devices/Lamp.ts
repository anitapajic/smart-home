import { Device } from "../Device";

export interface Lamp extends Device{
    isOn : boolean;
    timestamp : Date;
    brightnessLevel : number;
}