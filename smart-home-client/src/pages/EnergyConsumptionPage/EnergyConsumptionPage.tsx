import { useParams } from "react-router-dom";
import EnergyCityGraph from "../../components/energyConsumption/EnergyCityGraph/EnergyCityGraph";
import { StyledPage } from "../RealEstateEnergyConsumptionPage/RealEstateEnergyConsumptionPage.styled";

export default function EnergyConsumptionPage() {

    const { city } = useParams<{ city: string | undefined }>();
    const decodedCity = city ? city.replace(/%20/g, " ") : '';

    return (
        <StyledPage>
            <h1>Energy consumption for {decodedCity}</h1>
            <EnergyCityGraph />
        </StyledPage>
    )
}