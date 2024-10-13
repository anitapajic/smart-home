import { ACAutoMode } from "./PKA-devices/AirConditioning";
import { SprinklerAutoMode } from "./SPU-devices/Sprinkle";
import { WMMode, WashingMachineAutoMode } from "./PKA-devices/WashingMachine";
import { RealEstate } from "./RealEstate";
import { DeviceType } from "./enums/DeviceType";
import { DeviceVariant } from "./enums/DeviceVariant";

export interface NewDevice{
    realEstateId : number;
    name : string;
    picture : string;
    type : DeviceType | string;
    variant: DeviceVariant | string;
    powerStrenght? : number;
    isOn? : boolean;

    // Solar panel
    numOfSolarPanels? : number;
    sizeOfOneSolarPanel? : number;
    solarPanelEfficiency? : number;
    // Home battery
    homeBatteryCapacity? : number;
    // Car Charger
    chargerStrength? : number;
    vehicleCapacity? : number;
    // Air conditioner
    minTemperature? : number;
    maxTemperature? : number;
    currentTemperature? : number;
    currentMode?: string;
    modes? : string[]

    // Washing machine
    wmcurrentMode?: WMMode;
    wmmodes? : WMMode[]
}

export interface Device{
    id : number;
    name : string;
    realEstate? : RealEstate;
    isOnline : boolean;
    picture : string;
    type : DeviceType | string;
    variant: DeviceVariant | string;
    powerStrenght? : number;
    isOn? : boolean;

    //DHT
    humidity?: number;
    temperature?: number;
    //SOLAR PANELS
    numOfPanels? : number;
    size? : number;
    solarPanelEfficiency? : number;
    electricityGenerated? : number;
    // Home battery
    homeBatteryCapacity?: number;
    // Car charger
    chargerStrength? : number;
    vehicleCapacity? : number;
    //Lamp
    lampIsOn?: boolean;
    brightnessLevel?: number;
    lampMode?: boolean;
    //Gate
    isGateOn?: boolean;
    gateMode?: boolean;
    registration?: string;
    //Sprinkler
    isSprinklerOn?: boolean;
    sprinklerAutos?: SprinklerAutoMode[];
    sprinklerMode?: boolean;
    // Air conditioner
    minTemperature? : number;
    maxTemperature? : number;
    currentTemperature? : number;
    modes?: string[];
    currentMode?: string;
    airConditioningAutos?: ACAutoMode[];

    // Washing machine
    wmmodes?: WMMode[];
    wmcurrentMode?: WMMode;
    washingMachineAutos?: WashingMachineAutoMode[];

}

export enum AirConditionerMode{
    COOL = "COOL", 
    HEAT = "HEAT", 
    AUTO = "AUTO", 
    FAN = "FAN"
}


