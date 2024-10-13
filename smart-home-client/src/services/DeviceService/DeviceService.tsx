import { Device, NewDevice } from "../../models/Device";
import { Period } from "../../models/Measure";
import { ACAutoMode, ACAutoModeDTO } from "../../models/PKA-devices/AirConditioning";
import { SprinklerAutoModeDTO } from "../../models/SPU-devices/Sprinkle";
import { WashingMachineAutoDTO } from "../../models/PKA-devices/WashingMachine";
import customAxios from "../AxiosInterceptor/AxiosInterceptor";

class DeviceService {

    addDevice(newDevice: NewDevice) {
        return customAxios.post(`/devices`, newDevice);
    }
    
    getAllDevices(realEstateId : number) {
        return customAxios.get(`/devices/${realEstateId}`);
    }

    switchIsOnlineDevice(id : number){
        return customAxios.get(`/devices/switchOnline/${id}`);
    }
    getDeviceById(id : number){
        return customAxios.get(`/devices/byId/${id}`);
    }
    getDeviceMeasures(id : number, period : Period){
        return customAxios.post(`/devices/measurement/${id}`, period);
    }

    setAC(acDTO : Device){
        return customAxios.post(`devices/pka/ac`, acDTO);

    }

    setWM(wmDTO : Device){
        return customAxios.post(`devices/pka/wm`, wmDTO);

    }
    addACMode(newMode : ACAutoModeDTO){
        return customAxios.post(`devices/pka/ac/create`, newMode);

    }

    deleteACMode(modeId : number){
        return customAxios.post(`devices/pka/ac/delete/${modeId}`);

    }
    addSprinklerMode(newMode: SprinklerAutoModeDTO) {
        return customAxios.post(`devices/spu/sprinkler/create`, newMode);

    }
    deleteSprinklerMode(modeId: number) {
        return customAxios.post(`devices/spu/sprinkler/delete/${modeId}`);

    }

    addWMMode(newMode : WashingMachineAutoDTO){
        return customAxios.post(`devices/pka/wm/create`, newMode);

    }

    deleteWMMode(modeId : number){
        return customAxios.post(`devices/pka/wm/delete/${modeId}`);

    }


    switchDevice(deviceId:number){
        return customAxios.get(`/devices/switch/${deviceId}`);
    }

}
export default new DeviceService();