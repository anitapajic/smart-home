import customAxios from "../../AxiosInterceptor/AxiosInterceptor";

export default class LampService {

    getLampById(id:number) {
        return customAxios.get(`/devices/spu/lamp/${id}`);
    }
    
    getAllLamps() {
        return customAxios.get(`/devices/spu/lamp`);
    }

    switchLamp(id:number){
        return customAxios.get(`/devices/spu/lamp/switch/${id}`);
    }
    switchLampMode(id: number) {
        return customAxios.get(`/devices/spu/lamp/switchMode/${id}`);
    }
}