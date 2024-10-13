import { faBolt, faWifi, faTachometerAlt, faStream, faHome, faIndustry, faQuestionCircle, faHouseUser, faTemperatureHalf, faDroplet, faListNumeric, faRulerCombined, faPercentage, faSun, faCamera, faLock, faMagic, faPowerOff, faTemperature0, faTemperature2, faTemperature4, faList } from "@fortawesome/free-solid-svg-icons";
import { Device } from "../../../models/Device"
import Picture from "../../shared/picture/Picture";
import { Button2, CardContainer, CustomInput2, ImageContainer, InfoContainer, InfoLabels, Name, StyledFontAwesomeIcon, ToggleACButton, ToggleButton, ToggleButtonContainer, ToggleContainer, ToggleInput, ToggleSlider } from "./DeviceCard.styled";
import { useEffect, useState } from "react";
import LampService from "../../../services/DeviceService/LampService/LampService";
import DeviceService from "../../../services/DeviceService/DeviceService";
import { Vehicle } from "../../../models/Vehicle";
import Modal from "../../shared/modal/Modal";
import AddVehicleForm from "../../vehicle/addVehicleForm";
import GateService from "../../../services/DeviceService/GateService/GateService";
import { FilterSelect } from "../deviceGraph/DeviceGraph.styled";
import SprinklerService from "../../../services/DeviceService/SprinklerService/SprinklerService";
import Button from "../../shared/button/Button";
import { Button as StyledButton } from "../../shared/button/Button.styled";
import { PermissionButtonContainer } from "../../shared/styled/SharedStyles.styled";
import PermissionForm from "../../permission/Permission";
import { Frame, over } from 'stompjs';
import SockJS from 'sockjs-client';
import { Sprinkle } from "../../../models/SPU-devices/Sprinkle";

export type DeviceCardProps = {
    device: Device;
    onPowerOffIcon(deviceId: number): void;
    onDetails?: (device: Device) => void;
    showMore: boolean;
    isPermissionVisible: boolean;
    onToggleDevice?: (switchParam: boolean) => void; 
    setVehicleRefresh? : () => void;
    onModeChange?: () => void;
    onLampSwitch?: () => void;
    onGateModeChange?: () => void;
    onSprinklerModeChange?: () => void;
    onGateSwitch?: () => void;
    onSprinklerSwitch?: () => void;
    onTempChange?: (value: string) => void;
    onACModeChange?: (selected: string) => void;
    onWMModeChange?: (selected: number) => void;
    onACChange?: () => void;
    searchInput?: string;
    onWMChange?: () => void;
}

export type ToggleButtonProps = {
    isDeviceOn?: boolean;
    onClick: () => void;
};


export function getDeviceTypeIcon(type: string) {
    switch (type) {
        case 'PKA':
            return faHome;
        case 'SPU':
            return faHouseUser;
        case 'VEU':
            return faIndustry;
        default:
            return faQuestionCircle;
    }
}



export default function DeviceCard({setVehicleRefresh, device, isPermissionVisible, onPowerOffIcon, onDetails, showMore, onToggleDevice, onACChange, onWMChange, onModeChange, onTempChange, onACModeChange, onWMModeChange, onGateModeChange, onGateSwitch, onLampSwitch, onSprinklerSwitch, onSprinklerModeChange, searchInput}: DeviceCardProps) {
    
    const stompClient = over(new SockJS('http://localhost:8085/ws'));
    stompClient.debug = () => { };
    
    const [acChange, setAcChange] = useState<boolean>(false);
    const [wmChange, setWmChange] = useState<boolean>(false);
    const [isPermissionModalVisible, setIsPermissionModalVisible] = useState(false);
    const handleOnDetails = () => {
        if (onDetails) {
            onDetails(device);
        }
    }

    const onAddPermission = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation(); // Stop the propagation of the click event
        setIsPermissionModalVisible(true);

    }

    const handlePermissionFormCancel = () => {
        setIsPermissionModalVisible(false);
    }

    const handleACChange = () => {
        setAcChange(false)
        handleToggleDevice()
        onACChange!()
    }

    const handleWMChange = () => {
        setWmChange(false)
        handleToggleDevice()

       onWMChange!()
    }

    const handleACModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setAcChange(true)
        onACModeChange!(event.target.value)
    };

    const handleWMModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setWmChange(true)
        onWMModeChange!(parseInt(event.target.value));
    };

    const handleACTempChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAcChange(true)

        onTempChange!(event.target.value)
    };

    const handleSubmitAC = () => {
        setAcChange(false)

        DeviceService.setAC(device).then(response => {
            console.log(response.status)
        }).catch(error => {
            console.error("Error: ", error);
        })

    }

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
    },[device.realEstate?.id])

    const onConnected = () => {
        const baseTopic = `${device.realEstate?.id}/`;
        stompClient.subscribe(`${baseTopic}sprinkler-state`, onSprinkleStateReceive);
    }

    const onSprinkleStateReceive = (message : Frame) => {
        const sprinkle: Sprinkle = JSON.parse(message.body)
        console.log(sprinkle, "AAAAAAAA")
        if (sprinkle.id === device?.id && device.isSprinklerOn !== sprinkle.isSprinklerOn && onSprinklerSwitch){
            onSprinklerSwitch(); 
        }
    };
    // const handleSubmitWM = () => {
    //     setWmChange(false)

    //     DeviceService.setWM(device).then(response => {
    //         console.log(response.status)
    //     }).catch(error => {
    //         console.error("Error: ", error);
    //     })

    // }

    const handleToggleDevice = (switchParam?: boolean) => {
        var switchP = switchParam===false ? switchParam : true;
        onToggleDevice?.(switchP);
    };

    const lampService = new LampService();
    const [lamp, setLamp] = useState(device);

    useEffect(() => {
        DeviceService.getDeviceById(Number(device.id))
            .then(response => {
                const deviceData = response.data;
                setLamp(deviceData);

                // Postavite `lamp` stanje na osnovu podataka o uređaju
                setLamp(deviceData);
            })
            .catch(error => {
                console.error("Error fetching real estates' devices: ", error);
            });
    }, [device.id]);




    const handleOnOffLamp = (deviceId: number) => {
        handleToggleDevice(false)
        // lampService.switchLamp(deviceId)
        //     .then(response => {

        //     })
        //     .catch(error => {
        //         console.error('Error switching lamp status', error);
        //     });

        onLampSwitch!()

    };

    const handleOnOffGate = (deviceId: number) => {
        handleToggleDevice(false)

        // GateService.switchGateOnOf(deviceId)
        //     .then(response => {

        //     })
        //     .catch(error => {
        //         console.error('Error switching gate status', error);
        //     });

       onGateSwitch!()
    };

    const handleOnOffSprinkler = (deviceId: number) => {
        handleToggleDevice(false)

        SprinklerService.switchSprinklerOnOf(deviceId)
            .then(response => {

            })
            .catch(error => {
                console.error('Error switching sprinkler status', error);
            });

        onSprinklerSwitch!()
    };

    const [isAutoMode, setIsAutoMode] = useState(false);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isPrivateMode, setIsPrivateMode] = useState(false);


    const handleFormCancel = () => {
        setIsModalVisible(false);
    };

    const handleAddVehicleForm = (vehicle: Vehicle) => {
        console.log(vehicle);
    
        setVehicleRefresh!();
        setIsModalVisible(false);
    };

    const handleAutoModeChange = (deviceId: number) => {
        lampService.switchLampMode(deviceId)
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                console.error('Error switching lamp status', error);
            });

        onModeChange!()
        setIsAutoMode(!isAutoMode)


    };

    const handleAutoModeSprinklerChange = (deviceId: number) => {
        SprinklerService.switchSprinklerMode(deviceId)
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                console.error('Error switching lamp status', error);
            });

        onSprinklerModeChange!()


    };
    const handleGateModeChange = (deviceId: number) => {
        GateService.switchGateMode(deviceId)
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                console.error('Error switching lamp status', error);
            });

        onGateModeChange!()
        setIsPrivateMode(!isPrivateMode)


    };

    const highlightText = (text: string, search: string | undefined) => {
        if (!search?.trim()) {
            return text;
        }

        const regex = new RegExp(`(${search})`, 'gi');
        const parts = text.split(regex);

        return parts.map((part, index) =>
            regex.test(part) ? <span key={index} style={{ backgroundColor: 'yellow' }}>{part}</span> : part
        );
    };


    return (
        <>
            <CardContainer onClick={handleOnDetails} style={{
                boxShadow: isAutoMode
                    ? (device.lampIsOn ? "10px 12px 20px rgba(239, 237, 100, 0.747)" : "10px 12px 20px rgba(0, 0, 0, 0.1)")
                    : (device.lampIsOn ? "10px 12px 20px rgba(239, 237, 100, 0.747)" : "10px 12px 20px rgba(0, 0, 0, 0.1)")
            }}>
                <InfoContainer>
                    <Name>{highlightText(device.name, searchInput)}</Name>
                    <InfoLabels> <StyledFontAwesomeIcon icon={getDeviceTypeIcon(device.type)} /><b>Type:</b> {highlightText(device.type, searchInput)} </InfoLabels>
                    <InfoLabels> <StyledFontAwesomeIcon icon={faStream} /><b>Variant:</b> {highlightText(device.variant.valueOf().replace(/_/g, ' '), searchInput)} </InfoLabels>
                    {device.variant !== "SOLAR_PANELS" && device.variant !== "HOME_BATTERY" && (
                        <>
                            <InfoLabels> <StyledFontAwesomeIcon icon={faTachometerAlt} /><b>Power Strength:</b> {device.powerStrenght}V</InfoLabels>
                        </>
                    )}

                    <InfoLabels style={{ color: device.isOnline ? 'green' : 'red' }}>
                        <StyledFontAwesomeIcon
                            icon={faWifi}
                            onClick={() => onPowerOffIcon(device.id)}
                            style={{ cursor: 'pointer', color: device.isOnline ? 'green' : 'red' }}
                        />
                        {device.isOnline ? "Online" : "Offline"}
                    </InfoLabels>
                    {/* ako je DHT */}
                    {showMore && (
                        <>
                            {device.variant === "TH_SENSOR" && (
                                <>
                                    <InfoLabels><StyledFontAwesomeIcon icon={faTemperatureHalf} /><b>Temperature:</b> {device.temperature} °C</InfoLabels>
                                    <InfoLabels><StyledFontAwesomeIcon icon={faDroplet} /><b>Humidity:</b>  {device.humidity} %</InfoLabels>
                                </>
                            )}
                            {device.variant === "SOLAR_PANELS" && (
                                <>
                                    <InfoLabels><StyledFontAwesomeIcon icon={faListNumeric} /><b> Number of solar panels : </b>{device.numOfPanels} </InfoLabels>
                                    <InfoLabels><StyledFontAwesomeIcon icon={faRulerCombined} /><b> Size of one solar panel :</b> {device.size} m&sup2;</InfoLabels>
                                    <InfoLabels><StyledFontAwesomeIcon icon={faPercentage} /><b> Efficiency of one solar panel :</b> {device.solarPanelEfficiency} %</InfoLabels>
                                    <InfoLabels><StyledFontAwesomeIcon icon={faBolt} /><b> Energy generated :</b> {device.electricityGenerated} kWh</InfoLabels>
                                    {device.isOnline && (

                                        <>
                                            <ToggleContainer>
                                                <ToggleInput
                                                    type="checkbox"
                                                    checked={device.isOn}
                                                    onChange={() => handleToggleDevice()}
                                                />
                                                <ToggleSlider />
                                            </ToggleContainer>

                                            <label style={{ margin: '7px', fontSize: '18px', verticalAlign: 'middle' }}><b>{device.isOn ? 'On' : 'Off'}</b></label>

                                        </>
                                        
                                    )}

                                </>
                            )}
                            {device.variant === "CAR_CHARGER" && (
                                <>
                                    <InfoLabels><StyledFontAwesomeIcon icon={faListNumeric} /><b>Number of supported vehicles :</b> {device.vehicleCapacity} </InfoLabels>
                                    <InfoLabels><StyledFontAwesomeIcon icon={faBolt} /><b>Charger strength :</b> {device.chargerStrength} kW</InfoLabels>
                                    
                                </>
                            )}
                            {device.variant === "AIR_CONDITIONING" && (
                                <>
                                    <InfoLabels><StyledFontAwesomeIcon icon={faTemperature0} /><b>Minimal temperature :</b> {device.minTemperature} </InfoLabels>
                                    <InfoLabels><StyledFontAwesomeIcon icon={faTemperature4} /><b>Maximal temperature :</b> {device.maxTemperature} </InfoLabels>
                                    {device.isOnline && (
                                        <>
                                            
                                            <ToggleContainer>
                                                <ToggleInput
                                                    type="checkbox"
                                                    checked={device.isOn}
                                                    onChange={() => handleACChange()}
                                                />
                                                <ToggleSlider />
                                            </ToggleContainer>

                                            <label style={{ margin: '7px', fontSize: '18px', verticalAlign: 'middle' }}><b>{device.isOn ? 'On' : 'Off'}</b></label>


                                            {/* <InfoLabels>
                                                <ToggleButtonContainer>
                                                    <ToggleACButton isDeviceOn={device.isOn} onClick={handleACChange}>
                                                        <StyledFontAwesomeIcon icon={faPowerOff} />
                                                    </ToggleACButton>
                                                    <label style={{ margin: '7px' }}><b>{device.isOn ? 'Turn Off' : 'Turn On'}</b></label>
                                                </ToggleButtonContainer>
                                            </InfoLabels> */}
                                            {device.isOn && (
                                                <>
                                                    <InfoLabels><StyledFontAwesomeIcon icon={faTemperature2} /><b>Temperature :</b>
                                                        <CustomInput2
                                                            type="number"
                                                            placeholder=""
                                                            name="homeBatteryCapacity"
                                                            value={device.currentTemperature}
                                                            onChange={handleACTempChange}
                                                            min={device.minTemperature}
                                                            max={device.maxTemperature}
                                                        />

                                                    </InfoLabels>
                                                    <InfoLabels><StyledFontAwesomeIcon icon={faStream} /><b>Mode :</b>
                                                        <FilterSelect id="acModeDropDown" value={device.currentMode!.valueOf()} onChange={handleACModeChange}>
                                                            {device.modes!.map((mode) => (
                                                                <option value={mode} >
                                                                    {mode}
                                                                </option>
                                                            ))}
                                                        </FilterSelect>
                                                    </InfoLabels>
                                                    <StyledButton disabled={!acChange} onClick={handleSubmitAC}>
                                                        Apply change
                                                    </StyledButton>
                                                </>
                                            )}
                                        </>
                                    )}

                                </>
                            )}

                            {device.variant === "WASHING_MACHINE" && (
                                <>
                                    {device.isOnline && (
                                        <>
                                            <ToggleContainer>
                                                <ToggleInput
                                                    type="checkbox"
                                                    checked={device.isOn}
                                                    onChange={() => handleWMChange()}
                                                />
                                                <ToggleSlider />
                                            </ToggleContainer>

                                            <label style={{ margin: '7px', fontSize: '18px', verticalAlign: 'middle' }}><b>{device.isOn ? 'On' : 'Off'}</b></label>

                                            {/* <InfoLabels>
                                                <ToggleButtonContainer>
                                                    <ToggleACButton isDeviceOn={device.isOn} onClick={handleWMChange}>
                                                        <StyledFontAwesomeIcon icon={faPowerOff} />
                                                    </ToggleACButton>
                                                    <label style={{ margin: '7px' }}><b>{device.isOn ? 'Turn On' : 'Turn Off'}</b></label>
                                                </ToggleButtonContainer>
                                            </InfoLabels> */}
                                            {!device.isOn && (
                                                <>
                                                    <InfoLabels><StyledFontAwesomeIcon icon={faStream} /> Mode :
                                                        <FilterSelect id="wmModeDropDown" value={device.wmcurrentMode!.id} onChange={handleWMModeChange}>
                                                            {device.wmmodes!.map((mode) => (
                                                                <option value={mode.id} >
                                                                    {mode.name + ' ' + mode.temperature}
                                                                </option>
                                                            ))}
                                                        </FilterSelect>
                                                    </InfoLabels>
                                                    {/* <Button disabled={!wmChange} onClick={handleSubmitWM}>
                                                    Apply change
                                                </Button> */}
                                                </>
                                            )}
                                            

                                        </>
                                    )}
                                </>
                            )}
                            {device.variant === "LAMP" && (
                                <>
                                    <InfoLabels><StyledFontAwesomeIcon icon={faSun} /><b>Brightness level :</b> {device.brightnessLevel} </InfoLabels>
                                    {/* ako ne radi zamijeni device.lampMode sa isAutoMode */}
                                    <InfoLabels>
                                        <StyledFontAwesomeIcon icon={faMagic} /><b>
                                            Automatic Mode:</b>
                                        <input
                                            type="checkbox"
                                            checked={device.lampMode}
                                            onChange={() => handleAutoModeChange(device.id)}
                                        />
                                    </InfoLabels>
                                    <>
                                        {/* ako ne radi zamijeni device.lampMode sa isAutoMode */}
                                        <ToggleContainer>
                                            <ToggleInput
                                                type="checkbox"
                                                checked={device.lampIsOn}
                                                onChange={() => handleOnOffLamp(device.id)}
                                                disabled={device.lampMode}
                                            />
                                            <ToggleSlider />
                                        </ToggleContainer>

                                        <label style={{ margin: '7px', fontSize: '18px', verticalAlign: 'middle' }}><b>{device.lampIsOn ? 'On' : 'Off'}</b></label>
                                    </>


                                </>

                            )}
                            {device.variant === "GATE" && (
                                <>
                                    <InfoLabels>
                                        <StyledFontAwesomeIcon icon={faCamera} /><b>
                                            Registration:</b> {device.registration}
                                    </InfoLabels>
                                    <>
                                        {/* ako ne radi zamijeni device.lampMode sa isAutoMode */}
                                        <ToggleContainer>
                                            <ToggleInput
                                                type="checkbox"
                                                checked={device.isGateOn}
                                                onChange={() => handleOnOffGate(device.id)}
                                            // disabled={device.gateMode}
                                            />
                                            <ToggleSlider />
                                        </ToggleContainer>
                                        <label>{device.isGateOn ? 'Open' : 'Closed'}</label>
                                    </>
                                    <InfoLabels style={{ marginTop: '13px'}}>
                                        <StyledFontAwesomeIcon icon={faLock} /><b>
                                            Private Mode:</b>
                                        <input
                                            type="checkbox"
                                            checked={device.gateMode}
                                            onChange={() => handleGateModeChange(device.id)}
                                        />
                                    </InfoLabels>
                                    {device.gateMode && (
                                        <>
                                            <Button2 onClick={() => setIsModalVisible(true)}>Add Vehicle</Button2>
                                            {isModalVisible && (
                                                <Modal isVisible={isModalVisible} onClose={handleFormCancel}>
                                                    <AddVehicleForm onSubmit={handleAddVehicleForm} device={device}></AddVehicleForm>
                                                </Modal>
                                            )}
                                        </>
                                    )}


                                </>

                            )}

                            {device.variant === "SPRINKLER" && (

                                <>
                                    <InfoLabels>
                                        <StyledFontAwesomeIcon icon={faMagic} /><b>
                                            Automatic Mode:</b>
                                        <input
                                            type="checkbox"
                                            checked={device.sprinklerMode}
                                            onChange={() => handleAutoModeSprinklerChange(device.id)}
                                        />
                                    </InfoLabels>
                                    {/* ako ne radi zamijeni device.lampMode sa isAutoMode */}
                                    <ToggleContainer>
                                        <ToggleInput
                                            type="checkbox"
                                            checked={device.isSprinklerOn}
                                            onChange={() => handleOnOffSprinkler(device.id)}
                                            disabled={device.sprinklerMode}
                                        />
                                        <ToggleSlider />
                                    </ToggleContainer>

                                    <label style={{ margin: '7px', fontSize: '18px', verticalAlign: 'middle' }}><b>{device.isSprinklerOn ? 'On' : 'Off'}</b></label>
                                </>


                            )}

                        </>
                    )}
                    {isPermissionVisible && (
                        <>
                            <PermissionButtonContainer >
                                <Button
                                    icon={faList}
                                    text="Permissions"
                                    onClickHandler={onAddPermission}
                                />
                            </PermissionButtonContainer>
                        </>
                    )}
                </InfoContainer>
                
                <ImageContainer>
                    <Picture src={`http://localhost:84/images/devices/${device.picture}`}  />
                </ImageContainer>
            </CardContainer>



            <Modal isVisible={isPermissionModalVisible} onClose={handlePermissionFormCancel}>
                <PermissionForm realEstate={device.realEstate?.id!} device={device.id} />
            </Modal>
        </>
    )
}