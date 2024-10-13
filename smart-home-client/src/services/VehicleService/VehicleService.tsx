
import { Vehicle } from "../../models/Vehicle";
import customAxios from "../AxiosInterceptor/AxiosInterceptor";

class VehicleService{
    addVehicle(vehicle: Vehicle) {
        return customAxios.post(`/vehicles/addVehicle`, vehicle);
    }
}
export default new VehicleService();