import { Vehicle } from "../../../models/Vehicle";
import customAxios from "../../AxiosInterceptor/AxiosInterceptor";



class GateService {
    switchGateOnOf(id: number) {
        return customAxios.get(`/devices/spu/gate/switch/${id}`);
    }
    
    switchGateMode(id: number) {
        return customAxios.get(`/devices/spu/gate/switchMode/${id}`);
    }
    getAllVehicles() {
        return customAxios.get(`/vehicles/getVehicles`);
    }
}
export default new GateService();