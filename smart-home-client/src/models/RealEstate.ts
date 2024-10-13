import { Address } from "./Address";
import { LoginUser} from "./User";
import { RealEstateStatus } from "./enums/RealEstateStatus";



export interface RealEstate {
    id: number;
    name: string;
    address: Address;
    userId: LoginUser | null;
    quadrature: number;
    floors: number;
    picture: string;
    status: RealEstateStatus;
}

export interface NRealEstate {
    name: string;
    address: Address;
    userId: LoginUser | null;
    quadrature: number;
    floors: number;
    picture: string;
}


export interface RealEstateStatusChange {
    id: number;
    status: RealEstateStatus;
    reason: string

}
