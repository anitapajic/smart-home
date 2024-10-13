import customAxios from "../../AxiosInterceptor/AxiosInterceptor";


class SprinklerService {
    switchSprinklerOnOf(id: number) {
        return customAxios.get(`/devices/spu/sprinkler/switch/${id}`);
    }
    switchSprinklerMode(id: number) {
        return customAxios.get(`/devices/spu/sprinkler/switchMode/${id}`);
    }
}
export default new SprinklerService();