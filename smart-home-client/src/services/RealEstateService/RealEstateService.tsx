import { NRealEstate, RealEstateStatusChange } from "../../models/RealEstate";
import customAxios from "../AxiosInterceptor/AxiosInterceptor";

class RealEstateService {
    addRealEstate(newRealEstate: NRealEstate) {
        return customAxios.post(`/user/real_estate`, newRealEstate);
    }
    getAllRealEstates() {
        return customAxios.get(`/user/real_estate`);
    }
    getAllRealEstatePending() {
        return customAxios.get(`/user/real_estate_pending`);
    }
    getUserRealEstate(userId: number) {
        return customAxios.get(`/user/user_real_estate/${userId}`);
    }
    getUserRealEstatePending(userId: number) {
        return customAxios.get(`/user/user_real_estate_pending/${userId}`);
    }

    changeRealEstateStatus(changeRequest: RealEstateStatusChange) {
        return customAxios.put(`/user/real_estate_status`, changeRequest);
    }

    getAllCountries() {
        return customAxios.get(`/user/countries`);
    }
    getCities(countryId: string) {
        return customAxios.get(`/user/cities/${countryId}`);
    }

    getRealEstates(){
        return customAxios.get(`/user/realEstates`);
    }

    getCitiesRE(){
        return customAxios.get(`/user/cities`);
    }

    getRealEstateById(id:number){
        return customAxios.get(`/user/realEstate/${id}`);
    }

}
export default new RealEstateService();