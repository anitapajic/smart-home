import { Device } from "../Device";

export interface SolarPanelSystem extends Device{
    numOfPanels : number;
    isOn: boolean;
    timestamp: Date;
    electricityGenerated: number;
}