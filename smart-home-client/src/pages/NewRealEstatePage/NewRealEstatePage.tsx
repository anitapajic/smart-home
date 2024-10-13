import React, { useEffect, useState } from "react";
import { renderFileInputSection } from "../../components/shared/picture/Picture";
import { CustomInput, CustomInputLabel, FormContainer, FormFieldsContainer, InputContainer, MapContainer, RealEstateContainer, StyledFontAwesomeIcon } from "./NewRealEstatePage.styled";
import { NRealEstate } from "../../models/RealEstate";
import { Button } from "../../components/shared/button/Button.styled";
import RealEstateService from "../../services/RealEstateService/RealEstateService";
import { convertToBase64 } from "../../utils/functions/convertToBase64";
import { Address, City, Country } from "../../models/Address";
import { BottomSection, CenteredDiv, DropDownManu, Title1, Title2, TopSection } from "../../components/shared/styled/SharedStyles.styled";
import { showToast } from "../../components/shared/toast/CustomToast";
import { validateImageRE, validateNumberRE, validateSelectRE, validateStringLenRE } from "../../utils/functions/validations";
import useUser from "../../utils/UserContext/useUser";
import MapComponent from "../../components/map/Map";
import { ButtonContainer } from "../RealEstateDevicesPage/RealEstateDevicesPage.styled";
import { CustomButton } from "../HomePage/HomePage.styled";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';

export interface Props {
    active?: boolean;
}

export default function NewRealEstate() {
    const markers = [
        { id: 1, lat: 37.7749, lng: -122.4194, title: 'San Francisco' },
        { id: 2, lat: 40.7128, lng: -74.0060, title: 'New York City' },
    ];

    const [isVisible, setIsVisible] = useState(true)
    const [isValidName, setIsValidName] = useState(true);
    const [isValidLocation, setIsValidLocation] = useState(true);
    const [isValidQuadrature, setIsValidQuadrature] = useState(true);
    const [isValidFloor, setIsValidFloor] = useState(true);
    const [isValidCountry, setIsValidCountry] = useState(true);
    const [isValidCity, setIsValidCity] = useState(true);
    const [isValidImage, setIsValidImage] = useState(true);
    const [countries, setCountries] = useState<Country[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [realPicture, setRealPicture] = useState<File>();
    const [base64Picture, setBase64Picture] = useState<string>('');
    const { user } = useUser();
    const [address] = useState<Address>({
        location: "",
        city: "",
        country: "",
        longitude: 0,
        latitude: 0,

    })
    const [newRE, setnewRE] = useState<NRealEstate>({
        name: "",
        address: address,
        userId: user,
        quadrature: 0,
        floors: 0,
        picture: "",
    });
    const handleInputChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setnewRE((prevState) => ({
            ...prevState,
            [name]: value,
        }));
        setIsValidName(validateStringLenRE(name, value, "name"))
    };
    const handleInputChangeLocation = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setnewRE((prev) => ({
            ...prev,
            address: { ...prev.address, [name]: value },
        }));

        switch (name) {
            case 'location':
                setIsValidLocation(validateStringLenRE(name, value, 'location'))
                break;
            case 'country':
                setIsValidCountry(validateStringLenRE(name, value, 'country'))
                break;
            case 'city':
                setIsValidCity(validateStringLenRE(name, value, 'city'))
                break;

        }
        if (value.length === 0) {
            setnewRE((prev) => ({
                ...prev,
                address: { ...prev.address, city: "", country: "", location: "" },
            }));
            setIsVisible(true)
            setIsValidCity(true)
            setIsValidCountry(true)
        }

    };
    const handleInputChangeFloors = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setnewRE((prevState) => ({
            ...prevState,
            [name]: value,
        }));
        setIsValidFloor(validateNumberRE(name, value, "floors"))

    };
    const handleInputChangeQuadrature = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setnewRE((prevState) => ({
            ...prevState,
            [name]: value,
        }));
        setIsValidQuadrature(validateNumberRE(name, value, "quadrature"))

    };
    const handleSubmit = async (event : React.FormEvent) => {
        event.preventDefault()
        const formData = new FormData();
        formData.append('file', realPicture!)
        try{
            const response = await fetch(`http://localhost:84/images/upload/real-estates`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': user?.token!,
                },            
            })
            if(response.ok){
                console.log('FIle uploaded')
            }else {
                console.log('FIle not uploaded')

            }
        }catch (error){
            console.log(error)
        }

        console.log("newRE: ", newRE)
        const isNameEmpty = newRE.name.trim() === '';
        const isLocationEmpty = newRE.address.location.trim() === '';
        const isFloorEmpty = newRE.floors === 0;
        const isQuadratureEmpty = newRE.quadrature === 0;
        const isCountryEmpty = newRE.address.country.trim() === '';
        const isCityEmpty = newRE.address.city.trim() === '';
        const isImageEmpty = newRE.picture.trim() === '';
        console.log(isCountryEmpty)
        console.log(isCityEmpty)
        if (isNameEmpty || isLocationEmpty || isFloorEmpty || isQuadratureEmpty || isCountryEmpty || isCityEmpty || isImageEmpty) {
            showToast("Please fill in all required fields.");
            setIsValidName(!isNameEmpty);
            setIsValidLocation(!isLocationEmpty);
            setIsValidFloor(!isFloorEmpty);
            setIsValidQuadrature(!isQuadratureEmpty);
            setIsValidCountry(!isCountryEmpty)
            setIsValidCity(!isCityEmpty)
            setIsValidImage(!isImageEmpty)

        } else if (isValidName && isValidLocation && isValidQuadrature && isValidFloor) {
            RealEstateService.addRealEstate(newRE)
                .then((response) => {
                    console.log("Estate:", response.data);
                    showToast("New Real Estate created!");
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        } else {
            showToast("Form is not valid!");
        }
    };
    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const base64Image = await convertToBase64(file);
                setRealPicture(file)
                setBase64Picture(base64Image);
                setnewRE((prev) => ({
                    ...prev,
                    picture: file.name,
                }))
                setIsValidImage(validateImageRE(file.name))
            } catch (error) {
                console.error("Error converting image:", error);
            }
        }
    };
    const handleCountryChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCountryId = e.target.options[e.target.selectedIndex].id;
        const selectedCountry = e.target.value;
        setnewRE((prev) => ({
            ...prev,
            address: {
                ...prev.address,
                country: selectedCountry,
            },
        }));
        setIsValidCountry(validateSelectRE(selectedCountry))
        const response = await RealEstateService.getCities(selectedCountryId);
        const sortedCountries = response.data.sort((a: City, b: City) => a.name.localeCompare(b.name));
        setCities(sortedCountries);
    };
    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCity = e.target.value;

        setnewRE((prev) => ({
            ...prev,
            address: {
                ...prev.address,
                city: selectedCity,
            },
        }));
        setIsValidCity(validateSelectRE(selectedCity))
    };
    const handleAddressOnClick = (address: Address) => {
        // Do something with the selected address, e.g., update state or perform an action
        setIsVisible(false)
        setIsValidCity(true)
        setIsValidCountry(true)
        setnewRE((prev) => ({
            ...prev,
            address: address
        }));
    };

    useEffect(() => {

        const fetchCountries = async () => {
            const response = await RealEstateService.getAllCountries();
            const sortedCountries = response.data.sort((a: Country, b: Country) => a.name.localeCompare(b.name));
            setCountries(sortedCountries);
        };

        fetchCountries();
    }, []);

    const navigate = useNavigate();

    const handleGoToUserHomePage = () => {
        navigate('/user-home-page');
    };
    return (
        <>
            <RealEstateContainer>
                <TopSection>
                    <Title1>Create New Real Estates</Title1>
                    <Title2>you can make your real estate's here</Title2>
                    <ButtonContainer>
                        <CustomButton onClick={handleGoToUserHomePage}> 
                            <StyledFontAwesomeIcon icon={faArrowLeft} />
                            Real Estate
                        </CustomButton>
                    </ButtonContainer>
                </TopSection>
                <BottomSection>
                    <FormContainer>
                        <FormFieldsContainer>
                            <InputContainer>
                                <CustomInput
                                    type="text"
                                    placeholder=" "
                                    name="name"
                                    value={newRE.name}
                                    onChange={handleInputChangeName}
                                    className={isValidName ? '' : 'invalidInput'} // Apply invalidInput class if the location is invalid

                                />
                                <CustomInputLabel>Name</CustomInputLabel>
                            </InputContainer>

                            {isVisible ? (<DropDownManu name="country" onChange={handleCountryChange} className={isValidCountry ? '' : 'invalidInput'}>
                                <option value="" disabled selected hidden>Country</option>
                                {countries.map((country) => (
                                    <option id={country.id.toString()} value={country.name}>
                                        {country.name}
                                    </option>
                                ))}

                            </DropDownManu>) : (
                                <InputContainer>
                                    <CustomInput
                                        type="text"
                                        placeholder=" "
                                        name="country"
                                        value={newRE.address.country}
                                        onChange={handleInputChangeLocation}
                                        className={isValidCountry ? '' : 'invalidInput'}

                                    />
                                    <CustomInputLabel>Country</CustomInputLabel>
                                </InputContainer>)}

                            {isVisible ? (<DropDownManu name="city" onChange={handleCityChange} className={isValidCity ? '' : 'invalidInput'}>
                                <option value="" disabled selected hidden>City</option>
                                {cities.map((city) => (
                                    <option id={city.id.toString()} value={city.name}>
                                        {city.name}
                                    </option>
                                ))}
                            </DropDownManu>) :
                                (

                                    <InputContainer>
                                        <CustomInput
                                            type="text"
                                            placeholder=" "
                                            name="city"
                                            value={newRE.address.city}
                                            onChange={handleInputChangeLocation}
                                            className={isValidCity ? '' : 'invalidInput'}

                                        />
                                        <CustomInputLabel>City</CustomInputLabel>
                                    </InputContainer>
                                )}




                            <InputContainer>
                                <CustomInput
                                    type="text"
                                    placeholder=" "
                                    name="location"
                                    value={newRE.address.location}
                                    onChange={handleInputChangeLocation}
                                    className={isValidLocation ? '' : 'invalidInput'}

                                />
                                <CustomInputLabel>Location</CustomInputLabel>
                            </InputContainer>
                            
                                    <InputContainer>
                                        <CustomInput
                                            type="number"
                                            placeholder=" "
                                            name="floors"
                                            value={newRE.floors !== 0 ? newRE.floors : ""}
                                            onChange={handleInputChangeFloors}
                                            className={isValidFloor ? '' : 'invalidInput'}
                                            min="0"

                                        />
                                        <CustomInputLabel>Floors</CustomInputLabel>
                                    </InputContainer>
                               
                                    <InputContainer>
                                        <CustomInput
                                            type="number"
                                            placeholder=" "
                                            name="quadrature"
                                            value={newRE.quadrature !== 0 ? newRE.quadrature : ""}
                                            onChange={handleInputChangeQuadrature}
                                            className={isValidQuadrature ? '' : 'invalidInput'}
                                            min="0"

                                        />
                                        <CustomInputLabel> Quadrature</CustomInputLabel>
                                    </InputContainer>
                               
                            {renderFileInputSection({
                                handleChange: handleImageChange,
                                fileSource: base64Picture,
                                altText: 'Selected Image',
                                isValid: isValidImage,
                            })}

                            <CenteredDiv>
                                <Button onClick={handleSubmit}>
                                    Submit
                                </Button>
                            </CenteredDiv>
                        </FormFieldsContainer>
                        <MapContainer>
                            <MapComponent markers={markers} handleAddressOnClick={handleAddressOnClick} />
                        </MapContainer>
                    </FormContainer>
                </BottomSection>
            </RealEstateContainer>
        </>
    )
}

