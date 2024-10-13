import React, { useEffect, useState } from "react";
import RealEstatesTable from "../../components/energyConsumption/realEstatesTable/RealEstatesTable";
import CitiesTable from "../../components/energyConsumption/citiesTable/CitiesTable";
import { ResponsiveContainer } from "../DeviceDetailsPage/DeviceDetailsPage.styled";
import { LeftDiv, RightDiv, StyledFontAwesomeIcon3, StyledInputSearch } from "./AdminEnergyPage.styled";
import RealEstateService from "../../services/RealEstateService/RealEstateService";
import { RealEstate } from "../../models/RealEstate";
import { CityDTO } from "../../models/CityDTO";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { StyledPage } from "../RealEstateEnergyConsumptionPage/RealEstateEnergyConsumptionPage.styled";

export default function AdminEnergyPage() {
    const [realEstates, setRealEstates] = useState<RealEstate[]>([]);
    const [cities, setCities] = useState<CityDTO[]>([]);

    const [searchInput, setSearchInput] = useState('');
    const [searchInput2, setSearchInput2] = useState('');

    useEffect(() => {
        RealEstateService.getRealEstates().then(response => {
            setRealEstates(response.data);
        }).catch(error => {
            console.error("Error fetching real estates: ", error);
        });

        RealEstateService.getCitiesRE().then(response => {
            setCities(response.data);
        }).catch(error => {
            console.error("Error fetching cities: ", error);
        });

    }, []);

    const filteredRealEstates = realEstates.filter(realEstate => {
        const matchesSearch = realEstate.name.toLowerCase().includes(searchInput2.toLowerCase()) ||
        realEstate.address.city.toLowerCase().includes(searchInput2.toLowerCase()) ||
        realEstate.address.country.toLowerCase().includes(searchInput2.toLowerCase());
        return matchesSearch;
    });

    const filteredCities = cities.filter(city => {
        const matchesSearch = city.numOfRE.toString().includes(searchInput) ||
        city.city.toLowerCase().includes(searchInput.toLowerCase());
        return matchesSearch;
    });



    return (
        <StyledPage>
            <h1>Energy Consumption Page</h1>
            <ResponsiveContainer>
                <LeftDiv>
                    <StyledFontAwesomeIcon3 icon={faSearch} />
                    <StyledInputSearch
                        type="text"
                        placeholder="Search real estates"
                        value={searchInput2}
                        onChange={(e) => setSearchInput2(e.target.value)}
                    />
                    <RealEstatesTable realEstates={filteredRealEstates} searchInput={searchInput2}/>
                </LeftDiv>
                <RightDiv>
                    <StyledFontAwesomeIcon3 icon={faSearch} />
                    <StyledInputSearch
                        type="text"
                        placeholder="Search cities"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                    <CitiesTable cities={filteredCities} searchInput={searchInput}/>
                </RightDiv>
            </ResponsiveContainer>
        </StyledPage>
    )
}