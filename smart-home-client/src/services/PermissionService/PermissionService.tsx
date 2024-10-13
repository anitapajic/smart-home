import { NewPermission, Permission } from "../../models/Permission";
import customAxios from "../AxiosInterceptor/AxiosInterceptor";

class PermissionService {
    getAllRealEstatePermissions(estateId : number) {
        return customAxios.get(`/permission/estate/${estateId}` );
    }
    
    getAllDevicePermissions(deviceId : number) {
        return customAxios.get(`/permission/device/${deviceId}` );
    }
    
    
    getAllRealEstates(userId : number) {
        return customAxios.get(`/permission/${userId}` );
    }
    getAllDevices(userId : number ,estateId : number) {
        return customAxios.get(`/permission/${userId}/${estateId}` );
    }



    addRealEstatePermission(permission: NewPermission) {
        return customAxios.put(`/permission/${permission.username}/${permission.estateId}`, );
    }
    addDevicePermission(permission: NewPermission) {
        return customAxios.put(`/permission/${permission.username}/${permission.estateId}/${permission.deviceId}`, );
    }



    removeRealEstatePermission(permission: NewPermission) {
        return customAxios.delete(`/permission/${permission.username}/${permission.estateId}`, );
    }
    removeDevicePermission(permission: NewPermission) {
        return customAxios.delete(`/permission/${permission.username}/${permission.estateId}/${permission.deviceId}`, );
    }

}
export default new PermissionService();