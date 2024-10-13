import { Device } from "../Device";

export interface HomeBattery extends Device{
    energyFromPanels: number;
    capacity: number;
}