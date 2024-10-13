import { useCallback, useEffect, useState } from "react";
import { Frame } from "stompjs";
import { Device } from "../../models/Device";
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import DeviceCard from "../../components/device/deviceCard/DeviceCard";
import { useParams } from "react-router";
import DeviceService from "../../services/DeviceService/DeviceService";
import { AllInputContainer, CardContainer, ClearDatesButton, CustomInputLabel, InputContainer, LeftDiv, Name, ResponsiveContainer, RightDiv, TableCardContainer } from "./DeviceDetailsPage.styled";
import { Action } from "../../models/Action";
import DeviceActionTable from "../../components/device/deviceActionTable/DeviceActionTable";
import { StyledInput } from "../../components/shared/styled/SharedStyles.styled";
import { StyledFontAwesomeIcon } from "../HomePage/HomePage.styled";
import { faRefresh, faSearch, faTrash, } from "@fortawesome/free-solid-svg-icons";
import DeviceActionService from "../../services/DeviceService/DeviceActionService/DeviceActionService";
import SolarPanelSystemService from "../../services/DeviceService/SolarPanelSystemService/SolarPanelSystemService";
import DeviceGraph from "../../components/device/deviceGraph/DeviceGraph";
import { Measure, MeasureString } from "../../models/Measure";
import { ACAutoMode, ACAutoModeDTO } from "../../models/PKA-devices/AirConditioning";
import Modal from "../../components/shared/modal/Modal";
import NewACAutoModeForm from "../../components/device/newACAutoMode/ACAutoMode";
import { Button } from "../../components/shared/button/Button.styled";
import { ScrollableContainer, StyledTable } from "../../components/device/deviceActionTable/DeviceActionTable.styled";
import { StyledFontAwesomeIcon3, StyledInputSearch } from "../AdminEnergyPage/AdminEnergyPage.styled";
import NewSprinklerAutoModeForm from "../../components/device/newSprinklerAutoMode/SprinklerAutoMode";
import { SprinklerAutoMode, SprinklerAutoModeDTO } from "../../models/SPU-devices/Sprinkle";
import OnlineStatusGraph from "../../components/realEstate/OnlineStatusGraph/OnlineStatusGraph";
import { WashingMachineAutoDTO, WashingMachineAutoMode } from "../../models/PKA-devices/WashingMachine";
import NewWMAutoModeForm from "../../components/device/newWMAutoMode/WMAutoMode";
import { ErrorPage } from "../ErrorPage/ErrorPage";
import IconButton from "../../components/shared/iconButton/IconButton";
import GateService from "../../services/DeviceService/GateService/GateService";
import { Vehicle } from "../../models/Vehicle";


const initialDeviceState: Device = {
    id: 0,
    name: "",
    isOnline: false,
    picture: "",
    type: "",
    variant: "",
    modes: [],
    airConditioningAutos: [],
    sprinklerAutos: [],
    washingMachineAutos: []
};


export default function DeviceDetailsPage() {
    const stompClient = over(new SockJS('http://localhost:8085/ws'));
    stompClient.debug = () => { };

    const [isError, setIsError] = useState(false);
    const [device, setDevice] = useState<Device>(initialDeviceState);
    const { deviceId } = useParams();
    const [tableData, setTableData] = useState<Action[]>([]);
    const [searchInput, setSearchInput] = useState('');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const [isModalVisible, setIsModalVisible] = useState(false);

    const fetchTableData = useCallback(() => {
        DeviceActionService.getAllActions(Number(deviceId)).then(response => {
            setTableData(response.data);

        }).catch(error => {
            console.error("Error fetching device's actions: ", error);
        });
    }, [deviceId]);

    const filteredActions = tableData.filter(action => {
        const matchesSearch = action.username.toLowerCase().includes(searchInput.toLowerCase()) ||
            action.actionName.toLowerCase().includes(searchInput.toLowerCase());


        const actionDate = new Date(action.timestamp);
        const isWithinDateRange = (!startDate || actionDate >= startDate) &&
            (!endDate || actionDate <= endDate);

        return matchesSearch && isWithinDateRange;
    });

    const handelLampModeSwitch = () => {
        setDevice(prevDevice => {
            return { ...prevDevice, lampMode: !device.lampMode };
        });
    }
    const handelGateModeSwitch = () => {
        setDevice(prevDevice => {
            return { ...prevDevice, gateMode: !device.gateMode };
        });
    }
    const handelLampSwitch = () => {
        setDevice(prevDevice => {
            return { ...prevDevice, lampIsOn: !device.lampIsOn };
        });
    }
    const handelSprinklerModeSwitch = () => {
        setDevice(prevDevice => {
            return { ...prevDevice, sprinklerMode: !device.sprinklerMode };
        });
    }
    const handelGateSwitch = () => {
        setDevice(prevDevice => {
            return { ...prevDevice, isGateOn: !device.isGateOn };
        });
    }
    const handelSprinklerSwitch = () => {
        setDevice(prevDevice => {
            return { ...prevDevice, isSprinklerOn: !device.isSprinklerOn };
        });
    }
    useEffect(() => {
        if (device.brightnessLevel !== undefined && device.lampMode === true) {
            setDevice(prevDevice => {
                return { ...prevDevice, lampIsOn: device.brightnessLevel! < 60 };
            });

        }
    }, [device.brightnessLevel])

    const [allVehicleRegistrations, setAllVehicleRegistrations] = useState<Vehicle[]>([]);
    const [refresh, setRefresh] = useState<boolean>(false);
    useEffect(() => {
        GateService.getAllVehicles()
            .then(response => {
                // Assuming the response is an array of Vehicle objects
                const vehicles: Vehicle[] = response.data;
                console.log(vehicles)
                setAllVehicleRegistrations(vehicles);
            })
            .catch(error => {
                console.error('Error fetching vehicle registrations:', error);
            });
    }, [refresh]);

    const handleRefresh = () => {
        setRefresh(!refresh);
    };


    useEffect(() => {

        if (device.gateMode) {
            setDevice(prevDevice => {
                let isGateOn = false;
                
                if (allVehicleRegistrations.some(vehicle => vehicle.registration === device.registration)) {
                    isGateOn = true;
                    console.log(device.registration)
                }

                return { ...prevDevice, isGateOn };
            });

            const timer = setTimeout(() => {
                setDevice(prevDevice => ({ ...prevDevice, isGateOn: false }));
            }, 2000);

            return () => clearTimeout(timer);
        }
        else if (!device.gateMode) {
            setDevice(prevDevice => ({ ...prevDevice, isGateOn: true }));

            const timer = setTimeout(() => {
                setDevice(prevDevice => ({ ...prevDevice, isGateOn: false }));
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [device.registration, device.gateMode]);



    useEffect(() => {
        DeviceService.getDeviceById(Number(deviceId)).then(response => {
            setDevice(response.data);
            if (checkVariant(response.data.variant) === 'table') {
                fetchTableData();
            }
        }).catch(error => {
            console.error("Error fetching device: ", error);
            setIsError(true);
        });

    }, [fetchTableData]);

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
    }, [tableData, device.realEstate?.id])



    const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const newDate = value ? new Date(value) : null;
        setStartDate(newDate);

        // Adjust the end date if necessary
        if (endDate && newDate && endDate < newDate) {
            setEndDate(newDate);
        }
    };

    const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setEndDate(value ? new Date(value) : null);
    };


    const onConnected = () => {
        if (device.realEstate) {
            const baseTopic = `${device.realEstate.id}/`;
            stompClient.subscribe(`${baseTopic}temperature`, onMessageReceiveDHT);
            stompClient.subscribe(`${baseTopic}humidity`, onMessageReceiveDHT);
            stompClient.subscribe(`${baseTopic}solarPanels`, onMessageReceiveSolarPanels);
            stompClient.subscribe(`${baseTopic}lamps`, onMessageReceiveLamp);
            stompClient.subscribe(`${baseTopic}gates`, onMessageReceiveGate);
            stompClient.subscribe(`actions`, onMessageReceiveActions);
            stompClient.subscribe(`${baseTopic}isOnline`, onMessageReceiveIsOnline);
        }

    }

    const onMessageReceiveDHT = (message: Frame) => {
        const topic = (message.headers as any).destination
        const newMeasure: Measure = JSON.parse(message.body)
        if (newMeasure.deviceId === Number(deviceId)) {
            if (topic.match("temperature")) {
                setDevice(prevDevice => {
                    return { ...prevDevice, temperature: newMeasure.value };
                });
            }
            else if (topic.match("humidity")) {
                setDevice(prevDevice => {
                    return { ...prevDevice, humidity: newMeasure.value };
                });
            }
        }
    };

    const onMessageReceiveSolarPanels = (message: Frame) => {
        const topic = (message.headers as any).destination
        const newMeasure: Measure = JSON.parse(message.body)
        newMeasure.topic = topic;
        if (newMeasure.deviceId === Number(deviceId)) {
            setDevice(prevDevice => {
                return { ...prevDevice, electricityGenerated: newMeasure.value };
            });

        }
    }

    const onMessageReceiveLamp = (message: Frame) => {
        const topic = (message.headers as any).destination
        const newMeasure: Measure = JSON.parse(message.body)
        newMeasure.topic = topic;
        if (newMeasure.deviceId === Number(deviceId)) {
            setDevice(prevDevice => {
                return { ...prevDevice, brightnessLevel: newMeasure.value };
            });


        }
    }
    const onMessageReceiveGate = (message: Frame) => {
        const topic = (message.headers as any).destination
        const newMeasure: MeasureString = JSON.parse(message.body)
        newMeasure.topic = topic;

        if (newMeasure.deviceId === Number(deviceId)) {
            setDevice(prevDevice => {
                return { ...prevDevice, registration: newMeasure.registrationNumber };
            });

        }
    }


    const onMessageReceiveActions = (message: Frame) => {
        const action: Action = JSON.parse(message.body)
        if (Number(deviceId) === action.deviceId) {
            const updatedActions = tableData ? [...tableData, action] : [action];
            setTableData(updatedActions);
        }
    }

    const onMessageReceiveIsOnline = (message: Frame) => {
        const newMeasure: Measure = JSON.parse(message.body)
        // console.log(newMeasure)
        if (newMeasure.deviceId === Number(deviceId)) {
            setDevice(prevDevice => {
                return { ...prevDevice, isOnline: newMeasure.online };
            });
            if(!newMeasure.online){
                setDevice(prevDevice => {
                    return { ...prevDevice, isOn: false,
                                            lampIsOn: false,
                                            isGateOn:false };
                });
            }

        }
    }


    const handleOnlineSwitchIcon = (deviceId: number) => {
        DeviceService.switchIsOnlineDevice(deviceId).then(response => {
            setDevice(response.data);
        }).catch(error => {
            console.error("Error switching device online status: ", error);
        });
    }


    const clearDateFilters = () => {
        setStartDate(null);
        setEndDate(null);
    };


    const handleToggleDevice = (switchParam: Boolean) => {
        DeviceService.switchDevice(Number(deviceId))
            .then(response => {
                if (response) {
                    if (switchParam) {
                        const updatedDevice = { ...device, isOn: !device.isOn };
                        setDevice(updatedDevice);
                    }
                }
            }).catch(error => {
                console.error("Error fetching real estates' devices: ", error);
            });
    };


    const handleACChange = () => {
        // device.isOn = !device.isOn
        // setDevice(prevDevice => {
        //     return { ...prevDevice, isOn: device.isOn };
        // });

        DeviceService.setAC(device).then(response => {
        }).catch(error => {
            console.error("Error: ", error);
        })

    }
    const handleWMChange = () => {
        // device.isOn = !device.isOn
        // setDevice(prevDevice => {
        //     return { ...prevDevice, isOn: device.isOn };
        // });

        DeviceService.setWM(device).then(response => {
        }).catch(error => {
            console.error("Error: ", error);
        })

    }
    const handleACModeChange = (selected: string) => {
        setDevice(prevDevice => {
            return { ...prevDevice, currentMode: selected };
        });
    };

    const handleWMModeChange = (selected: number) => {
        const selectedMode = device.wmmodes?.find(mode => mode.id === selected);
        setDevice(prevDevice => {
            return { ...prevDevice, wmcurrentMode: selectedMode };
        });
    };


    const handleACTempChange = (value: string) => {
        setDevice(prevDevice => {
            return { ...prevDevice, currentTemperature: (Number(value)) };
        });
    };



    function checkVariant(variant: string) {
        if (variant.match("TH_SENSOR") || variant.match("LAMP")) {
            return "graph"
        }
        return "table"
    }

    const handleFormCancel = () => {
        setIsModalVisible(false);
    };
    const handleACFormSubmit = (newMode: ACAutoModeDTO) => {

        DeviceService.addACMode(newMode).then(resposne => {
            const newMode: ACAutoMode = resposne.data;
            const updatedAutos = device.airConditioningAutos ? [...device.airConditioningAutos, newMode] : [newMode]
            setDevice(prevDevice => {
                return { ...prevDevice, airConditioningAutos: updatedAutos };
            });
        }).catch(error => {
            console.error(error)
        })
        setIsModalVisible(false);
    };

    const handleFormSubmitSprinkler = (newMode: SprinklerAutoModeDTO) => {
        DeviceService.addSprinklerMode(newMode).then(resposne => {
            const newMode: SprinklerAutoMode = resposne.data;
            const updatedAutos = device.sprinklerAutos ? [...device.sprinklerAutos, newMode] : [newMode]
            setDevice(prevDevice => {
                return { ...prevDevice, sprinklerAutos: updatedAutos };
            });
        }).catch(error => {
            console.error(error)
        })
        setIsModalVisible(false);
    };

    const handleWMFormSubmit = (newMode: WashingMachineAutoDTO) => {

        DeviceService.addWMMode(newMode).then(resposne => {
            const newMode: WashingMachineAutoMode = resposne.data;
            const updatedAutos = device.washingMachineAutos ? [...device.washingMachineAutos, newMode] : [newMode]
            setDevice(prevDevice => {
                return { ...prevDevice, washingMachineAutos: updatedAutos };
            });
        }).catch(error => {
            console.error(error)
        })
        setIsModalVisible(false);
    };

    const handleModalButtonClick = () => {
        setIsModalVisible(true);
    };

    const handleRemoveACAutoMode = (index: number) => {
        DeviceService.deleteACMode(index).then(resposne => {
            console.log(resposne.data)

        }).catch(error => {
            console.error(error)
        })
        const updatedAutos = device.airConditioningAutos!.filter((mode) => mode.id !== index);
        setDevice(prevDevice => {
            return { ...prevDevice, airConditioningAutos: updatedAutos };
        });
    };

    const handleRemoveAutoModeSprinkler = (index: number) => {
        DeviceService.deleteSprinklerMode(index).then(resposne => {
            console.log(resposne.data)

        }).catch(error => {
            console.error(error)
        })
        const updatedAutos = device.sprinklerAutos!.filter((mode) => mode.id !== index);
        setDevice(prevDevice => {
            return { ...prevDevice, sprinklerAutos: updatedAutos };
        });
    };

    const handleRemoveWMAutoMode = (index: number) => {
        DeviceService.deleteWMMode(index).then(resposne => {
            console.log(resposne.data)

        }).catch(error => {
            console.error(error)
        })
        const updatedAutos = device.washingMachineAutos!.filter((mode) => mode.id !== index);
        setDevice(prevDevice => {
            return { ...prevDevice, washingMachineAutos: updatedAutos };
        });
    };

    return isError ? (
        <ErrorPage />
    ) : (
        <ResponsiveContainer>
            <LeftDiv>
                <DeviceCard setVehicleRefresh={handleRefresh} device={device} onPowerOffIcon={handleOnlineSwitchIcon} showMore={true} onToggleDevice={handleToggleDevice} onModeChange={handelLampModeSwitch} onLampSwitch={handelLampSwitch} onGateModeChange={handelGateModeSwitch} onSprinklerModeChange={handelSprinklerModeSwitch} onSprinklerSwitch={handelSprinklerSwitch} onGateSwitch={handelGateSwitch} isPermissionVisible={false} onACChange={handleACChange} onACModeChange={handleACModeChange} onWMChange={handleWMChange} onWMModeChange={handleWMModeChange} onTempChange={handleACTempChange} />
                <OnlineStatusGraph device={device} />
            </LeftDiv >

            <RightDiv>
                {checkVariant(device.variant) === "table" ? (
                    <>
                            <TableCardContainer>
                                <Name>Actions</Name>
                                <AllInputContainer>
                                    <StyledFontAwesomeIcon3 icon={faSearch} />
                                    <StyledInputSearch
                                        type="text"
                                        placeholder="Search actions"
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                    />

                                    <InputContainer>
                                        <CustomInputLabel>From: </CustomInputLabel>
                                        <StyledInput
                                            type="date"
                                            value={startDate ? startDate.toISOString().split("T")[0] : ""}
                                            onChange={handleStartDateChange}
                                            placeholder="Choose start date"
                                            isValid={true}
                                        />
                                    </InputContainer>
                                    <InputContainer>
                                        <CustomInputLabel>To: </CustomInputLabel>
                                        <StyledInput
                                            type="date"
                                            value={endDate ? endDate.toISOString().split("T")[0] : ""}
                                            onChange={handleEndDateChange}
                                            min={startDate ? startDate.toISOString().split("T")[0] : ""}
                                            placeholder="Choose end date"
                                            isValid={true}
                                        />
                                    </InputContainer>
                                    <ClearDatesButton onClick={clearDateFilters}>{<StyledFontAwesomeIcon icon={faRefresh} />} </ClearDatesButton>
                                </AllInputContainer>
                            <DeviceActionTable actions={filteredActions} searchInput={searchInput} />
                        </TableCardContainer>

                    </>
                ) : (

                    <DeviceGraph device={device} />
                )}


                {device.variant === "AIR_CONDITIONING" && (
                        <TableCardContainer style={{ marginTop: "20px" }}>
                            <Name>Mode</Name>
                            < >
                            <ScrollableContainer>
                                <StyledTable>
                                    <thead>
                                        <tr>
                                            <th>Mode</th>
                                            <th>Temperature</th>
                                            <th>From</th>
                                            <th>To</th>
                                            <th>Condtion</th>
                                            <th>Condition temperature</th>
                                            <th>Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                    </tbody>
                                    {device.airConditioningAutos ? device.airConditioningAutos.map((autoMode: ACAutoMode) => (
                                        <tr key={autoMode.id}>
                                            <td>{autoMode.mode}</td>
                                            <td>{autoMode.temperature}</td>
                                            <td>{autoMode.fromTime}</td>
                                            <td>{autoMode.toTime}</td>
                                            <td>Turn on when temperature is {autoMode.condition ? "below " : " above"} condition temperature</td>
                                            <td>{autoMode.conditionTemperature}</td>
                                            <td>
                                                <IconButton
                                                    style={{ marginRight: 2 }}
                                                    icon={faTrash}
                                                    onClick={(event) => { event.preventDefault(); handleRemoveACAutoMode(autoMode.id!) }}
                                                />
                                            </td>


                                        </tr>
                                    )) :
                                        <>{device.airConditioningAutos}</>}
                                </StyledTable>
                            </ScrollableContainer>

                            <Button style={{bottom: "2%", right: "40%" }} onClick={handleModalButtonClick}>ADD AUTO MODE</Button>


                            <Modal isVisible={isModalVisible} onClose={handleFormCancel}>
                                <NewACAutoModeForm onSubmit={handleACFormSubmit} ac={device}></NewACAutoModeForm>
                            </Modal>
                        </>

                    </TableCardContainer>

                )}
                {device.variant === "WASHING_MACHINE" && (
                    <TableCardContainer style={{ marginTop: "20px" }}>
                        <Name>Mode</Name>    
                        < >
                            <ScrollableContainer>
                                <StyledTable>
                                    <thead>
                                        <tr>
                                            <th>Mode</th>
                                            <th>Time</th>
                                            <th>Date</th>
                                            <th>Duration(min)</th>
                                            <th>Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                    </tbody>
                                    {device.washingMachineAutos ? device.washingMachineAutos.map((autoMode: WashingMachineAutoMode) => (
                                        <tr key={autoMode.id}>
                                            <td>{autoMode.mode.name + autoMode.mode.temperature}</td>
                                            <td>{autoMode.time}</td>
                                            <td>{autoMode.date}</td>
                                            <td>{autoMode.mode.duration}</td>
                                            <td>
                                                <button style={{ marginRight: 2 }} onClick={(event) => { event.preventDefault(); handleRemoveWMAutoMode(autoMode.id!) }}>
                                                    x</button>
                                            </td>


                                        </tr>
                                    )) :
                                        <>{device.washingMachineAutos}</>}
                                </StyledTable>
                            </ScrollableContainer>

                            <Button style={{bottom: "2%", right: "40%" }} onClick={handleModalButtonClick}>ADD AUTO MODE</Button>


                            <Modal isVisible={isModalVisible} onClose={handleFormCancel}>
                                <NewWMAutoModeForm onSubmit={handleWMFormSubmit} wm={device}></NewWMAutoModeForm>
                            </Modal>
                        </>

                    </TableCardContainer>

                )}
                {device.variant === "SPRINKLER" && (
                    <TableCardContainer style={{ marginTop: "20px" }}>
                        <Name>Automatic mode</Name>
                        < >
                            <ScrollableContainer>
                                <StyledTable>
                                    <thead>
                                        <tr>
                                            <th>From</th>
                                            <th>To</th>
                                            <th>Repeat</th>
                                            <th>Condtion</th>
                                            <th>Delete</th>
                                        </tr >
                                    </thead >
                                    <tbody>

                                    </tbody>
                                        {
                                            device.sprinklerAutos ? device.sprinklerAutos.map((autoMode: SprinklerAutoMode) => {
                                                const repeatText =
                                                    autoMode.repeat === 7 ? "Every day" :
                                                        autoMode.repeat === 8 ? "Only once" :
                                                            autoMode.repeat !== undefined && autoMode.repeat >= 0 && autoMode.repeat <= 6 ?
                                                                ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][autoMode.repeat] :
                                                                "Invalid repeat value";

                                                return (
                                                    <tr key={autoMode.id}>
                                                        <td>{autoMode.fromTime}</td>
                                                        <td>{autoMode.toTime}</td>
                                                        <td>{repeatText}</td>
                                                        <td>Turn {autoMode.condition ? "ON " : " OFF"} when it's time</td>
                                                        <td>
                                                            <IconButton
                                                                style={{ marginRight: 2 }}
                                                                icon={faTrash}
                                                                onClick={(event) => { event.preventDefault(); handleRemoveAutoModeSprinkler(autoMode.id!) }}
                                                            />
                                                        </td>
                                                    </tr>
                                                );
                                            }) :
                                                <>{device.sprinklerAutos}</>
                                        }

                                </StyledTable>
                            </ScrollableContainer>

                            <Button style={{bottom: "2%", right: "40%" }} onClick={handleModalButtonClick}>ADD AUTO MODE</Button>


                            <Modal isVisible={isModalVisible} onClose={handleFormCancel}>
                                <NewSprinklerAutoModeForm onSubmit={handleFormSubmitSprinkler} ac={device}></NewSprinklerAutoModeForm>
                            </Modal >
                        </>

                    </TableCardContainer >

                )}


            </RightDiv >
        </ResponsiveContainer >
    )
}