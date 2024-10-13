import { useParams } from "react-router-dom";
import EnergyGraph from "../../components/realEstate/EnergyGraph/EnergyGraph";
import { useEffect, useState } from "react";
import RealEstateService from "../../services/RealEstateService/RealEstateService";
import { RealEstate } from "../../models/RealEstate";
import { ErrorPage } from "../ErrorPage/ErrorPage";
import { StyledPage } from "./RealEstateEnergyConsumptionPage.styled";

export default function RealEstateEnergyConsumptionPage() {
    const { id } = useParams();
    const [realEstate, setRealEstate] = useState<RealEstate>();
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        RealEstateService.getRealEstateById(Number(id)).then(response => {
            setRealEstate(response.data);
        }).catch(error => {
            console.error("Error fetching devices measures: ", error);
            setIsError(true)
        })
    }, [id])

    return isError ? (
        <ErrorPage />
      ) :(
        <StyledPage>
            <h1>Energy consumption for {realEstate?.name}</h1>
            <EnergyGraph />
             
        </StyledPage>
    )
}