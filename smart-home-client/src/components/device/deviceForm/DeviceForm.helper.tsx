import { Device, NewDevice } from "../../../models/Device";

export const createInitialDeviceState = (initialDevice: Device | null | undefined): NewDevice => ({
    realEstateId: initialDevice ? initialDevice.realEstate?.id! : 0,
    name: initialDevice ? initialDevice.name : "",
    picture: initialDevice ? initialDevice.picture : "",
    type: initialDevice ? initialDevice.type : "",
    variant: initialDevice ? initialDevice.variant: "",
    powerStrenght: initialDevice ? initialDevice.powerStrenght : 0,
    minTemperature : initialDevice ? initialDevice.minTemperature : 17,
    maxTemperature: initialDevice? initialDevice.maxTemperature : 30,
    modes: []
});
