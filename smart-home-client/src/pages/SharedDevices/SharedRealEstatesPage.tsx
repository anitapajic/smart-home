import { useNavigate } from 'react-router-dom';
import { BottomSection, Title1, Title2, TitleNo, TopSection } from "../../components/shared/styled/SharedStyles.styled";
import { useEffect, useState } from "react";
import { RealEstate } from "../../models/RealEstate";
import useUser from "../../utils/UserContext/useUser";
import RealEstateList from "../../components/realEstate/realEstateList/RealEstateList";
import { RealEstateContainer } from '../UserHomePage/UserHomePage.styled';
import PermissionService from '../../services/PermissionService/PermissionService';
import { ErrorPage } from '../ErrorPage/ErrorPage';
import { Frame, over } from 'stompjs';
import SockJS from 'sockjs-client';
import { Permission } from '../../models/Permission';

export default function SharedRealEstatesPage() {
    
    const stompClient = over(new SockJS('http://localhost:8085/ws'));
    stompClient.debug = () => { };
    
    const navigate = useNavigate();
    const [realEstateList, setrealEstateList] = useState<RealEstate[]>([]);
    const { user } = useUser();
    const [isError, setIsError] = useState(false);
    const [refresh, setRefresh] = useState<boolean>(false);


    useEffect(() => {
        PermissionService.getAllRealEstates(user?.id!).then(response => {
            setrealEstateList(response.data);
        }).catch(error => {
            console.error("Error fetching real estates: ", error);
            setIsError(true);
        });


    }, [user?.id, refresh]);

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
    })

    const onConnected = () => {
        stompClient.subscribe("new-permission", onNewPermissionReceive);
        stompClient.subscribe("new-permissions", onNewPermissionsReceive);
        stompClient.subscribe("delete-permissions", onDeletePermissionReceive);
    }


    const onNewPermissionReceive = (message : Frame) => {
        const newPermission: Permission = JSON.parse(message.body)
        if (newPermission.user.id === user?.id){
            setRefresh(!refresh)
        }
    };

    const onNewPermissionsReceive = (message : Frame) => {
        const newPermissions: Permission[] = JSON.parse(message.body)
        if (newPermissions[0].user.id === user?.id){
            setRefresh(!refresh)
        }
    };

    const onDeletePermissionReceive = (message : Frame) => {
        const newPermissions: Permission[] = JSON.parse(message.body)
        if (newPermissions[0].user.id === user?.id){
            setRefresh(!refresh)
        }

    };

    const handleDetails = (realEstate : RealEstate) => {
        navigate(`/shared-real-estates/${realEstate.id}/devices`);
    };

    return isError ? (
        <ErrorPage />
      ) :(
        <>
            <RealEstateContainer>
                <TopSection>
                    <Title1>Real Estates shared with you</Title1>
                    {realEstateList.length > 0 ? (
                        <Title2>you can see all shared real estates with you here</Title2>
                    ) : (
                        <TitleNo>No one has shared their real estate with you!</TitleNo>
                    )}
                </TopSection>
                <BottomSection>
                    <RealEstateList realEstates={realEstateList} isAdmin={false} onDetails={handleDetails} isPermissionVisible={false}/>
                </BottomSection>
            </RealEstateContainer>

        </>
    )
}