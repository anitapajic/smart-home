
export interface SolarPanel{
    id: number;
    size: number;
    efficiency: number;
    timestamp: Date;
    isOn: boolean;
    electricityGenerated: number;
    solarSystemId:  number;
}