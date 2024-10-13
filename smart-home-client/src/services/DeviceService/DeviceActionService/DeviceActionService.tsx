import customAxios from "../../AxiosInterceptor/AxiosInterceptor";

class DeviceActionService{  
    
    getAllActions(deviceId : number) {
        return customAxios.get(`/devices/actions/byDevice/${deviceId}`);
    }

}

export default new DeviceActionService();