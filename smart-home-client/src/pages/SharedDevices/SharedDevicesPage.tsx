import { useEffect, useState } from "react"
import { Device } from "../../models/Device";
import DeviceService from "../../services/DeviceService/DeviceService";
import { useNavigate, useParams } from "react-router-dom";
import DeviceList from "../../components/device/deviceList/DeviceList";
import { BottomSection, Title1, Title2, TopSection } from "../../components/shared/styled/SharedStyles.styled";
import { RealEstateContainer } from "../UserHomePage/UserHomePage.styled";
import { Frame, over } from 'stompjs';
import SockJS from 'sockjs-client';
import { Measure } from "../../models/Measure";
import PermissionService from "../../services/PermissionService/PermissionService";
import useUser from "../../utils/UserContext/useUser";
import { ErrorPage } from "../ErrorPage/ErrorPage";
import { Permission } from "../../models/Permission";

export default function SharedDevicesPage() {
    const stompClient = over(new SockJS('http://localhost:8085/ws'));
    stompClient.debug = () => { };

    const [isError, setIsError] = useState(false);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [devices, setDevices] = useState<Device[]>([]);
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useUser();

    useEffect(() => {

        PermissionService.getAllDevices(user?.id!, Number(id)).then(response => {
            setDevices(response.data);
        }).catch(error => {
            console.error("Error fetching real estates' devices: ", error);
            setIsError(true);
        });
    }, [id, user?.id, refresh]);

    useEffect(() => {
        stompClient.connect({}, onConnected, () => {
            console.log("Error..");
        });

        // Cleanup function
        return () => {
            if (stompClient.connected) {
                stompClient.disconnect(() => {
                });
            }
        };
    }, [devices])


    const onConnected = () => {
        stompClient.subscribe("**/isOnline", onMessageReceiveIsOnline);
        stompClient.subscribe("new-permission", onNewPermissionReceive);
        stompClient.subscribe("new-permissions", onNewPermissionsReceive);
        stompClient.subscribe("delete-permissions", onDeletePermissionReceive);
    }

    const onMessageReceiveIsOnline = (message: Frame) => {
        const newMeasure: Measure = JSON.parse(message.body)
        setDevices(prevDevices => {
            return prevDevices.map(device => {
                if (newMeasure.deviceId === device.id) {
                    return {
                        ...device,
                        isOnline: newMeasure.online,
                    };
                }
                return device;
            });
        });

    }

    const onNewPermissionReceive = (message: Frame) => {
        const newPermission: Permission = JSON.parse(message.body)
        if (newPermission.user.id === user?.id) {
            setRefresh(!refresh)
        }
    };

    const onNewPermissionsReceive = (message: Frame) => {
        const newPermissions: Permission[] = JSON.parse(message.body)
        if (newPermissions[0].user.id === user?.id) {
            setRefresh(!refresh)
        }
    };

    const onDeletePermissionReceive = (message: Frame) => {
        const newPermissions: Permission[] = JSON.parse(message.body)
        if (newPermissions[0].user.id === user?.id) {
            setRefresh(!refresh)
        }
    };



    const handleOnlineSwitchIcon = (deviceId: number) => {
        DeviceService.switchIsOnlineDevice(deviceId).then(response => {
            setDevices(prevDevices => prevDevices.map(device =>
                device.id === deviceId ? response.data : device
            ));
        }).catch(error => {
            console.error("Error switching device online status: ", error);
        });
    }



    const handleDetails = (device: Device) => {
        navigate(`/devices/${device.id}`)
    };

    return isError ? (
        <ErrorPage />
    ) : (

        <RealEstateContainer>
            <TopSection>
                <Title1>Shared Real Estate's devices</Title1>
                <Title2>you can see all shared real estate's devices here</Title2>
            </TopSection>
            <BottomSection>
                <DeviceList devices={devices} onOnlineSwitchIcon={handleOnlineSwitchIcon} onDetails={handleDetails} isPermissionVisible={false} />
            </BottomSection>
        </RealEstateContainer>
    )
}