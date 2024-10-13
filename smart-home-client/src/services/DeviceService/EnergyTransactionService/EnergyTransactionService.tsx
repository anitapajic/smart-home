import { Period } from "../../../models/Measure";
import customAxios from "../../AxiosInterceptor/AxiosInterceptor";

class EnergyTransactionService {

    getEnergyTransactionsToGrid(id:number, period: Period){
        return customAxios.post(`/energyTransactions/toGrid/${id}`, period);
    }
    getEnergyTransactionsFromGrid(id:number, period: Period){
        return customAxios.post(`/energyTransactions/fromGrid/${id}`, period);
    }
    getEnergyTransactionsToGridByCity(city:string, period: Period){
        return customAxios.post(`/energyTransactions/toGridByCity/${city}`, period);
    }
    getEnergyTransactionsFromGridByCity(city:string, period: Period){
        return customAxios.post(`/energyTransactions/fromGridByCity/${city}`, period);
    }


}
export default new EnergyTransactionService();