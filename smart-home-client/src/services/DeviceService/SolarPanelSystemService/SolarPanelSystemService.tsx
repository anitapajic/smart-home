import customAxios from "../../AxiosInterceptor/AxiosInterceptor";

class SolarPanelSystemService{  

    switchSolarPanelSystem(systemId:number){
        return customAxios.get(`/devices/veu/solarPanels/switch/${systemId}`);
    }

}

export default new SolarPanelSystemService();