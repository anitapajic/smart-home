import { Device } from "./Device";
import { RealEstate } from "./RealEstate";
import { User } from "./User";

export interface Permission {
    id : number,
    user : User,
    device : Device,
    estate: RealEstate
}

export interface NewPermission {
    id : number,
    username : string,
    deviceId : number,
    estateId: number
}