import { RealEstateContainer } from "./AdminHomePage.styled";
import { BottomSection, Title1, Title2, TitleNo, TopSection } from "../../components/shared/styled/SharedStyles.styled";
import { useEffect, useState } from "react";
import { RealEstate } from "../../models/RealEstate";
import RealEstateService from "../../services/RealEstateService/RealEstateService";
import { showToast } from "../../components/shared/toast/CustomToast";
import RealEstateList from "../../components/realEstate/realEstateList/RealEstateList";
import { RealEstateStatus } from "../../models/enums/RealEstateStatus";
import Modal from "../../components/shared/modal/Modal";
import DeclineRealEstateForm from "../../components/realEstate/declineRealEstateForm/declineRealEstateForm";
import { ErrorPage } from "../ErrorPage/ErrorPage";
import { Frame, over } from 'stompjs';
import SockJS from 'sockjs-client';
export default function AdminHomePage() {

    const stompClient = over(new SockJS('http://localhost:8085/ws'));
    stompClient.debug = () => { };

    const [realEstateList, setRealEstateList] = useState<RealEstate[]>([]);
    const [realEstate, setRealEstate] = useState<RealEstate>();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        RealEstateService.getAllRealEstatePending().then(response => {
            setRealEstateList(response.data);
        }).catch(error => {
            console.error("Error fetching movies: ", error);
            setIsError(true);
        });
    }, []);

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
    }, [])

    const onConnected = () => {
        stompClient.subscribe("new-re-request", onNewREReceive);
    }


    const onNewREReceive = (message: Frame) => {
        const newRE: RealEstate = JSON.parse(message.body)
        console.log(newRE);
        setRealEstateList(prevList => [...prevList, newRE]);
    };

    const handleAcceptRealEstate = (realEstate: RealEstate) => {

        RealEstateService.changeRealEstateStatus({ id: realEstate.id, status: RealEstateStatus.ACCEPTED, reason: "" }).then(response => {
            setRealEstateList(prevRE => prevRE.filter(re => re.id !== realEstate.id))
            showToast(`Accepted ${realEstate.name} real estate`)

        }).catch(error => {
            console.error("Error: ", error)

        })
    };

    const handleDeclineRealEstate = (realEstate: RealEstate) => {
        setRealEstateList(prevRE => prevRE.filter(re => re.id !== realEstate.id))
        setIsModalVisible(false);
        setRealEstate(undefined)
    };

    const handleDeclineClick = (realEstate: RealEstate) => {
        setRealEstate(realEstate)
        setIsModalVisible(true);

    };
    const handleFormCancel = () => {
        setIsModalVisible(false);
    };

    return isError ? (
        <ErrorPage />
    ) : (
        <>
            <RealEstateContainer>
                <TopSection>
                    <Title1>Pending Real Estates</Title1>
                    {realEstateList.length > 0 ? (
                        <Title2>you can see all real estate requests here</Title2>
                    ) : (
                        <TitleNo>There are no real estate requests!</TitleNo>
                    )}
                </TopSection>
                <BottomSection>
                    <Modal isVisible={isModalVisible} onClose={handleFormCancel}>
                        <DeclineRealEstateForm onSubmit={handleDeclineRealEstate} realEstate={realEstate!}></DeclineRealEstateForm>
                    </Modal>
                    {realEstateList.length > 0 && (
                        <RealEstateList realEstates={realEstateList} isAdmin={true} onAcceptRealEstate={handleAcceptRealEstate} onDeclineRealEstate={handleDeclineClick}
                            isPermissionVisible={false}
                        />
                    )}
                </BottomSection>
            </RealEstateContainer>

        </>
    )
}