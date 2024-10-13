/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { Device, NewDevice } from "../../models/Device";
import DeviceService from "../../services/DeviceService/DeviceService";
import { useNavigate, useParams } from "react-router-dom";
import DeviceList from "../../components/device/deviceList/DeviceList";
import { BottomSection, Title1, Title2, TitleNo, TopSection } from "../../components/shared/styled/SharedStyles.styled";
import DeviceForm from "../../components/device/deviceForm/DeviceForm";
import Modal from "../../components/shared/modal/Modal";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { CustomButton, RealEstateContainer } from "../UserHomePage/UserHomePage.styled";
import { CustomButton2, SearchInput, StyledFontAwesomeIcon2, StyledInputSearch } from "./RealEstateDevicesPage.styled";
import { Frame, over } from 'stompjs';
import SockJS from 'sockjs-client';
import { Measure } from "../../models/Measure";
import { StyledFontAwesomeIcon } from "../NewRealEstatePage/NewRealEstatePage.styled";
import { ErrorPage } from "../ErrorPage/ErrorPage";

export default function RealEstateDevicesPage() {
    const stompClient = over(new SockJS('http://localhost:8085/ws'));
    stompClient.debug = () => { };

    const [isError, setIsError] = useState(false);
    const [searchInput2, setSearchInput2] = useState('');
    const [devices, setDevices] = useState<Device[]>([]);
    const { id } = useParams();
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
    const navigate = useNavigate();

    useEffect(() => {

        DeviceService.getAllDevices(Number(id)).then(response => {
            setDevices(response.data);
        }).catch(error => {
            console.error("Error fetching real estates' devices: ", error);
            setIsError(true);
        });
    }, [id]);

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
    }, [])


    const onConnected = () => {
        const baseTopic = `${id}/`;
        stompClient.subscribe(`${baseTopic}isOnline`, onMessageReceiveIsOnline);
    }

    const onMessageReceiveIsOnline = (message: Frame) => {
        const newMeasure: Measure = JSON.parse(message.body)
        setDevices(prevDevices => {
            return prevDevices.map(device => {
                if (newMeasure.deviceId === device.id) {
                    if (!newMeasure.online){
                        return {
                            ...device,
                            isOnline: newMeasure.online,
                            lampIsOn: false,
                            isGateOn: false,
                            isOn: false
                        };
                    }else{
                        return {
                            ...device,
                            isOnline: newMeasure.online
                        };
                    }
                    
                    

                }
                return device;
            });
        });

    }

    const handleButtonClick = () => {
        setIsModalVisible(true);
    }

    const handleButton2Click = () => {
        navigate(`/energy-consumption/${id}`)
    }

    const handleFormCancel = () => {
        setIsModalVisible(false);
    }

    const handleFormSubmit = (device: NewDevice) => {

        DeviceService.addDevice(device).then(response => {
            setDevices(prevDevices => [...prevDevices, response.data]);
            console.log(response.data);
        }).catch(error => {
            console.error("Error creating device: ", error);
        });

        setIsModalVisible(false);

    }
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

    const filteredDevices = devices.filter(device => {
        const matchesSearch = device.name.toLowerCase().includes(searchInput2.toLowerCase()) ||
            device.variant.toLowerCase().includes(searchInput2.toLowerCase()) ||
            device.type.toLowerCase().includes(searchInput2.toLowerCase());
        return matchesSearch;
    });

    return isError ? (
        <ErrorPage />
    ) : (

        <RealEstateContainer>
            <TopSection>
                <Title1>Your Real Estate's devices</Title1>
                {devices.length > 0 ? (
                    <Title2>you can see all your real estate's devices here</Title2>
                ) : (
                    <TitleNo>You have zero registered devices in this real estate!</TitleNo>
                )}
                <CustomButton onClick={handleButtonClick}>
                    <StyledFontAwesomeIcon icon={faPlus} />
                    Add new device
                </CustomButton>
                {devices.length > 0 && (
                <CustomButton2 onClick={handleButton2Click}>
                    Energy consumption
                </CustomButton2>
                )}
                {devices.length > 0 && (
                    <SearchInput>
                        <StyledFontAwesomeIcon2 icon={faSearch} />
                        <StyledInputSearch
                            type="text"
                            placeholder="Search devices"
                            value={searchInput2}
                            onChange={(e) => setSearchInput2(e.target.value)}

                        />
                    </SearchInput>
                )}
            </TopSection>
            <BottomSection>
                {devices.length > 0 && (
                    <DeviceList devices={filteredDevices} onOnlineSwitchIcon={handleOnlineSwitchIcon} onDetails={handleDetails} searchInput={searchInput2} isPermissionVisible={true} />
                )}
            </BottomSection>
            <Modal isVisible={isModalVisible} onClose={handleFormCancel}>
                <DeviceForm onSubmit={handleFormSubmit} onCancel={handleFormCancel} realEstateId={Number(id)} />
            </Modal>
        </RealEstateContainer>
    )
}