import { Period } from "../../../models/Measure";
import customAxios from "../../AxiosInterceptor/AxiosInterceptor";

class OnlineStatusService {

    getAllOnlineStatus(deviceId: number, period: Period) {
        return customAxios.post(`/devices/onlineStatus/${deviceId}`, period);
    }

}

export default new OnlineStatusService();