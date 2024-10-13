import { RealEstateContainer, CustomButton, StyledFontAwesomeIcon, SearchInput } from "./UserHomePage.styled";
import { useNavigate } from 'react-router-dom';
import { BottomSection, Title1, Title2, TitleNo, TopSection } from "../../components/shared/styled/SharedStyles.styled";
import { useEffect, useState } from "react";
import RealEstateService from "../../services/RealEstateService/RealEstateService";
import { RealEstate } from "../../models/RealEstate";
import useUser from "../../utils/UserContext/useUser";
import RealEstateList from "../../components/realEstate/realEstateList/RealEstateList";
import { ButtonContainer, StyledFontAwesomeIcon2, StyledInputSearch } from "../RealEstateDevicesPage/RealEstateDevicesPage.styled";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { ErrorPage } from "../ErrorPage/ErrorPage";
import { Frame, over } from 'stompjs';
import SockJS from 'sockjs-client';

export default function UserHomePage() {
    const stompClient = over(new SockJS('http://localhost:8085/ws'));
    stompClient.debug = () => { };

    const navigate = useNavigate();
    const [realEstateList, setrealEstateList] = useState<RealEstate[]>([]);
    const { user } = useUser();
    const [searchInput2, setSearchInput2] = useState('');

    const [isError, setIsError] = useState(false);

    useEffect(() => {
        RealEstateService.getUserRealEstate(user?.id!).then(response => {
            // console.log(response.data)
            setrealEstateList(response.data);
        }).catch(error => {
            console.error("Error fetching real estates: ", error);
            setIsError(true);
        });
    }, [user?.id]);

    useEffect(() => {
        if (!stompClient.connected) {
            stompClient.connect({}, onConnected, () => {
                console.log("Error connecting to WebSocket");
            });
        }

        return () => {
            if (stompClient.connected) {
                stompClient.disconnect(() => {
                });
            }
        };
    },[user?.id])

    const onConnected = () => {
        stompClient.subscribe("new-re", onNewREReceive);
     }


     const onNewREReceive = (message : Frame) => {
        const newRE: RealEstate = JSON.parse(message.body)
        if (newRE.userId?.id === user?.id){
            setrealEstateList(prevList => [...prevList, newRE]);
        }
    };
    const handleClick = () => {
        navigate('/new-real-estate');
    };

    const handleDetails = (realEstate: RealEstate) => {
        navigate(`/real-estate/${realEstate.id}/devices`);
    };

    const filteredRealEstates = realEstateList.filter(realEstate => {
        const matchesSearch = realEstate.name.toLowerCase().includes(searchInput2.toLowerCase()) ||
            realEstate.address.city.toLowerCase().includes(searchInput2.toLowerCase()) ||
            realEstate.address.country.toLowerCase().includes(searchInput2.toLowerCase()) ||
            realEstate.address.location.toLowerCase().includes(searchInput2.toLowerCase());
        return matchesSearch;
    });

    return isError ? (
        <ErrorPage />
    ) : (
        <>
            <RealEstateContainer>
                <TopSection>
                    <Title1>Your Real Estates</Title1>
                    {realEstateList.length > 0 ? (
                        <Title2>you can see all your real estate here</Title2>
                    ) : (
                        <TitleNo>You have zero registered real estates!</TitleNo>
                    )}
                    <ButtonContainer>
                        <CustomButton onClick={handleClick}> New Real Estate
                            <StyledFontAwesomeIcon icon="arrow-right" />
                        </CustomButton>
                    </ButtonContainer>
                    {realEstateList.length > 0 && (
                        <SearchInput>
                            <StyledFontAwesomeIcon2 icon={faSearch} />
                            <StyledInputSearch
                                type="text"
                                placeholder="Search real estates"
                                value={searchInput2}
                                onChange={(e) => setSearchInput2(e.target.value)}

                            />
                        </SearchInput>
                    )}
                </TopSection>
                <BottomSection>
                    {realEstateList.length > 0 && (
                        <RealEstateList realEstates={filteredRealEstates} isAdmin={false} onDetails={handleDetails} searchInput={searchInput2} isPermissionVisible={true} />
                    )}
                </BottomSection>
            </RealEstateContainer>

        </>
    )
}