import React, { useState } from "react";
import { CenteredDiv, DropDownManu, HeaderWrapper, Title3 } from "../../shared/styled/SharedStyles.styled";
import { specificPkaDevices, specificSpuDevices, specificVeuDevices } from "../../../utils/data";
import { CustomInput, CustomInputLabel, InputContainer } from "../../../pages/NewRealEstatePage/NewRealEstatePage.styled";
import { renderFileInputSection } from "../../shared/picture/Picture";
import { convertToBase64 } from "../../../utils/functions/convertToBase64";
import { Device, NewDevice } from "../../../models/Device";
import { DeviceType } from "../../../models/enums/DeviceType";
import { Button } from "../../shared/button/Button.styled";
import { DeviceVariant } from "../../../models/enums/DeviceVariant";
import { createInitialDeviceState } from "./DeviceForm.helper";
import { AddButton, DeviceFormFieldsContainer, StyledDeviceForm } from "./DeviceForm.styled";
import { validateNameInput } from "../../../utils/functions/validations";
import { Header, Item } from "semantic-ui-react";
import { AllInputContainer } from "../deviceGraph/DeviceGraph.styled";
import { WMMode } from "../../../models/PKA-devices/WashingMachine";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import IconButton from "../../shared/iconButton/IconButton";
import useUser from "../../../utils/UserContext/useUser";

export type DeviceFormProps = {
    realEstateId: number;
    onSubmit: (type: NewDevice) => void;
    onCancel: () => void;
    initialDevice?: Device | null;
}


export interface DeviceValidationState {
    name: boolean;
    powerStrenght: boolean;
}

export default function DeviceForm({ onSubmit, onCancel, initialDevice, realEstateId }: DeviceFormProps) {
    const [currentMode, setCurrentMode] = useState('');
    const [modesList, setModesList] = useState<string[]>([]);
    const [realPicture, setRealPicture] = useState<File>();
    const [base64Picture, setBase64Picture] = useState<string>('');
    const [wmcurrentMode, setWmcurrentMode] = useState({
        name: "",
        duration: 0,
        temperature: 0
    });
    const [wmmodesList, setWmodesList] = useState<WMMode[]>([]);

    const [specificDevices, setSpecificDevices] = useState<string[]>([]);
    const [isValidName, setIsValidName] = useState(true);
    const [newDevice, setNewDevice] = useState<NewDevice>(
        createInitialDeviceState(initialDevice)
    );
    const {user} = useUser();
    const handleDeviceTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const type = event.target.value as DeviceType;
        setNewDevice(prev => ({ ...prev, type }));
        switch (type) {
            case DeviceType.PKA:
                setSpecificDevices(specificPkaDevices);
                
                break;
            case DeviceType.SPU:
                setSpecificDevices(specificSpuDevices);
                break;
            case DeviceType.VEU:
                setSpecificDevices(specificVeuDevices);
                break;
            default:
                setSpecificDevices([]);
        }
    };
    const handleDeviceVariantChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const variant = event.target.value as DeviceVariant;
        setNewDevice(prev => ({ ...prev, variant }));
        console.log(variant)
    }
    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const base64Image = await convertToBase64(file);
                setRealPicture(file)
                setBase64Picture(base64Image);
                setNewDevice((prev) => ({
                    ...prev,
                    picture: file.name,
                }))
            } catch (error) {
                console.error("Error converting image:", error);
            }
        }
    };
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        const isNumeric = name === "powerStrenght";
        setNewDevice(prev => ({
            ...prev,
            [name]: isNumeric ? Number(value) : value
        }));
        if (name === 'name') {
            setIsValidName(validateNameInput(value));
        }
    };
    const handleModeInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setCurrentMode(value);

    };
    const handleWMModeInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setWmcurrentMode((prev) => ({
            ...prev,
            [name]: value,
        }))
        console.log(wmcurrentMode)
    };
    const handleAddMode = () => {
        if (currentMode.trim() !== '') {
            setModesList((prevModes) => [...prevModes, currentMode.trim()]);
            setCurrentMode(''); // Reset currentMode after adding a mode
        }
    };
    const handleAddWMMode = () => {
        setWmodesList((prevModes) => [...prevModes, wmcurrentMode]);
        setWmcurrentMode({
            name: "",
            duration: 0,
            temperature: 0
        }); // Reset currentMode after adding a mode

    };

    const handleRemoveMode = (index: number) => {
        setModesList((prevModes) => prevModes.filter((_, i) => i !== index));
    };

    const handleRemoveWMMode = (index: number) => {
        setWmodesList((prevModes) => prevModes.filter((_, i) => i !== index));
    };


    const handleSubmit = async (event : React.FormEvent) => {
        event.preventDefault()
        const formData = new FormData();
        formData.append('file', realPicture!)
        try{
            await fetch(`http://localhost:84/images/upload/devices`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': user?.token!,
                },            })

        }catch (error){
            // console.log(error)
        }

        const addDevice: NewDevice = {
            realEstateId: realEstateId,
            name: newDevice.name,
            picture: newDevice.picture,
            type: newDevice.type,
            variant: newDevice.variant,
            powerStrenght: newDevice.powerStrenght,
            numOfSolarPanels: newDevice.numOfSolarPanels,
            sizeOfOneSolarPanel: newDevice.sizeOfOneSolarPanel,
            solarPanelEfficiency: newDevice.solarPanelEfficiency,
            homeBatteryCapacity: newDevice.homeBatteryCapacity,
            vehicleCapacity: newDevice.vehicleCapacity,
            chargerStrength: newDevice.chargerStrength,
            minTemperature: newDevice.minTemperature,
            maxTemperature: newDevice.maxTemperature,
            currentTemperature: newDevice.minTemperature,
            currentMode: modesList.length > 0 ? modesList[0] : undefined,
            modes: modesList,
            wmcurrentMode: wmmodesList.length > 0 ? wmmodesList[0] : undefined,
            wmmodes: wmmodesList
        }
        if (newDevice.variant === "AIR_CONDITIONING" && modesList.length < 1) {

        }
        console.log(addDevice);
        onSubmit(addDevice);
    }

    return (
        <CenteredDiv>
            <StyledDeviceForm>
                <HeaderWrapper>
                    <Title3>Add new device</Title3>
                </HeaderWrapper>
                <DeviceFormFieldsContainer>
                    <DropDownManu name="deviceTypeMenu" value={newDevice.type} onChange={handleDeviceTypeChange}>
                        <option value="" disabled hidden>Select type of device</option>
                        <option value="PKA">PKA</option>
                        <option value="SPU">SPU</option>
                        <option value="VEU">VEU</option>
                    </DropDownManu>
                    {newDevice.type && (
                        <DropDownManu name="deviceVariant" value={newDevice.variant} onChange={handleDeviceVariantChange}>
                            <option value="" disabled hidden>Select specific device</option>
                            {specificDevices.map((device, index) => (
                                <option key={index} value={device.toUpperCase().replace(/\s+/g, '_')}>
                                    {device}
                                </option>
                            ))}
                        </DropDownManu>
                    )}
                    {newDevice.variant && (
                        <>
                            <InputContainer>
                                <CustomInput
                                    type="text"
                                    placeholder=" "
                                    name="name"
                                    onChange={handleInputChange}
                                    className={isValidName ? '' : 'invalidInput'}
                                />
                                <CustomInputLabel>Name</CustomInputLabel>
                                {!isValidName && <small className="error-text">Invalid name</small>}
                            </InputContainer>
                            {newDevice.variant === "HOME_BATTERY" && (
                                <>
                                    <InputContainer>
                                        <CustomInput
                                            type="number"
                                            placeholder=" "
                                            name="homeBatteryCapacity"
                                            value={newDevice.homeBatteryCapacity !== 0 ? newDevice.homeBatteryCapacity : ""}
                                            onChange={handleInputChange}
                                            min="0"
                                        />
                                        <CustomInputLabel>Home battery capacity in kWh</CustomInputLabel>
                                    </InputContainer>

                                </>
                            )}
                            {newDevice.variant !== "HOME_BATTERY" && newDevice.variant !== "SOLAR_PANELS" && (
                                <>
                                    <InputContainer>
                                        <CustomInput
                                            type="number"
                                            placeholder=" "
                                            name="powerStrenght"
                                            value={newDevice.powerStrenght !== 0 ? newDevice.powerStrenght : ""}
                                            onChange={handleInputChange}
                                            min="0"
                                        />
                                        <CustomInputLabel>Power strength</CustomInputLabel>
                                    </InputContainer>
                                </>
                            )}
                            {newDevice.variant === "SOLAR_PANELS" && (
                                <>
                                    <InputContainer>
                                        <CustomInput
                                            type="number"
                                            placeholder=" "
                                            name="numOfSolarPanels"
                                            value={newDevice.numOfSolarPanels !== 0 ? newDevice.numOfSolarPanels : ""}
                                            onChange={handleInputChange}
                                            min="0"
                                        />
                                        <CustomInputLabel>Number od solar panels</CustomInputLabel>
                                    </InputContainer>
                                    <InputContainer>
                                        <CustomInput
                                            type="number"
                                            placeholder=" "
                                            name="sizeOfOneSolarPanel"
                                            value={newDevice.sizeOfOneSolarPanel !== 0 ? newDevice.sizeOfOneSolarPanel : ""}
                                            onChange={handleInputChange}
                                            min="0"
                                        />
                                        <CustomInputLabel>Size of one solar panel in m&sup2;</CustomInputLabel>
                                    </InputContainer>
                                    <InputContainer>
                                        <CustomInput
                                            type="number"
                                            placeholder=" "
                                            name="solarPanelEfficiency"
                                            value={newDevice.solarPanelEfficiency !== 0 ? newDevice.solarPanelEfficiency : ""}
                                            onChange={handleInputChange}
                                            min="0"
                                        />
                                        <CustomInputLabel>Efficiency of panels in %</CustomInputLabel>
                                    </InputContainer>
                                </>
                            )}
                            {newDevice.variant === "CAR_CHARGER" && (
                                <>
                                    <InputContainer>
                                        <CustomInput
                                            type="number"
                                            placeholder=" "
                                            name="chargerStrength"
                                            value={newDevice.chargerStrength !== 0 ? newDevice.chargerStrength : ""}
                                            onChange={handleInputChange}
                                            min="0"
                                        />
                                        <CustomInputLabel>Charger strength</CustomInputLabel>
                                    </InputContainer>
                                    <InputContainer>
                                        <CustomInput
                                            type="number"
                                            placeholder=" "
                                            name="vehicleCapacity"
                                            value={newDevice.vehicleCapacity !== 0 ? newDevice.vehicleCapacity : ""}
                                            onChange={handleInputChange}
                                            min="0"
                                        />
                                        <CustomInputLabel>Vehicle Capacity</CustomInputLabel>
                                    </InputContainer>
                                </>
                            )}
                            {newDevice.variant === "AIR_CONDITIONING" && (
                                <>
                                    <InputContainer>
                                        <CustomInput
                                            type="number"
                                            placeholder=" "
                                            name="minTemperature"
                                            value={newDevice.minTemperature ? newDevice.minTemperature : 17}
                                            onChange={handleInputChange}
                                            min="15"
                                            max="20"
                                        />
                                        <CustomInputLabel>Minimal air conditioner temperature</CustomInputLabel>
                                    </InputContainer>
                                    <InputContainer>
                                        <CustomInput
                                            type="number"
                                            placeholder=" "
                                            name="maxTemperature"
                                            value={newDevice.maxTemperature ? newDevice.maxTemperature : 30}
                                            onChange={handleInputChange}
                                            min="20"
                                            max="30"
                                        />
                                        <CustomInputLabel>Maximal air conditioner temperature</CustomInputLabel>
                                    </InputContainer>
                                    <InputContainer>
                                        <CustomInput
                                            type="text"
                                            placeholder=""
                                            name="maxTemperature"
                                            className={modesList.length > 0 ? '' : 'invalidInput'}
                                            value={currentMode}
                                            onChange={handleModeInputChange}
                                            onKeyDown={(event) => {
                                                if (event.key === 'Enter') {
                                                    event.preventDefault(); // Prevent default behavior of the Enter key in the text input
                                                    handleAddMode();
                                                }
                                            }}
                                        />
                                        <CustomInputLabel >Air condotion modes</CustomInputLabel>
                                        {modesList.length < 1 && <small className="error-text">Add at least one mode</small>}

                                        <AddButton onClick={(event) => { event.preventDefault(); handleAddMode(); }}>
                                            Add Mode
                                        </AddButton>
                                        <AllInputContainer style={{ maxWidth: 270 }}>
                                            {modesList.map((mode, index) => (
                                                <Item key={index}
                                                    style={{
                                                        border: '2px solid #b4e854', // Svijetlozelena boja
                                                        borderRadius: '5px', // Zaobljeni uglovi
                                                        margin: '7px',
                                                        padding: '5px',
                                                    }}>
                                                    <div>
                                                        {mode}
                                                        <IconButton
                                                            style={{ marginLeft: 5 }}
                                                            icon={faTrash}
                                                            onClick={(event) => { event.preventDefault(); handleRemoveMode(index) }}
                                                            />
                                                    </div>
                                                </Item>

                                                
                                            ))}
                                        </AllInputContainer>


                                    </InputContainer>
                                    

                                </>
                            )}
                            {newDevice.variant === "WASHING_MACHINE" && (
                                <>
                                    <InputContainer>
                                        <CustomInput
                                            type="text"
                                            placeholder=""
                                            name="name"
                                            className={wmmodesList.length > 0 ? '' : 'invalidInput'}
                                            value={wmcurrentMode.name}
                                            onChange={handleWMModeInputChange}
                                        />
                                        <CustomInputLabel >Washing machine mode name</CustomInputLabel>
                                    </InputContainer>
                                    <InputContainer>

                                        <CustomInput
                                            type="number"
                                            placeholder=""
                                            name="temperature"
                                            className={wmmodesList.length > 0 ? '' : 'invalidInput'}
                                            value={wmcurrentMode.temperature}
                                            onChange={handleWMModeInputChange}
                                        />
                                        <CustomInputLabel >Washing machine temperature</CustomInputLabel>
                                    </InputContainer>
                                    <InputContainer>
                                        <CustomInput
                                            type="number"
                                            placeholder=""
                                            name="duration"
                                            className={wmmodesList.length > 0 ? '' : 'invalidInput'}
                                            value={wmcurrentMode.duration}
                                            onChange={handleWMModeInputChange}
                                            onKeyDown={(event) => {
                                                if (event.key === 'Enter') {
                                                    event.preventDefault(); // Prevent default behavior of the Enter key in the text input
                                                    handleAddWMMode();
                                                }
                                            }}
                                        />
                                        <CustomInputLabel >Washing machine mode duration</CustomInputLabel>

                                        {wmmodesList.length < 1 && <small className="error-text">Add at least one mode</small>}

                                        <AddButton onClick={(event) => { event.preventDefault(); handleAddWMMode(); }}>
                                            Add Mode
                                        </AddButton>

                                        <AllInputContainer style={{ maxWidth: 270 }}>
                                            {wmmodesList.map((mode, index) => (
                                                <Item key={index} style={{
                                                    border: '2px solid #b4e854', // Svijetlozelena boja
                                                    borderRadius: '5px', // Zaobljeni uglovi
                                                    margin: '7px',
                                                    padding: '5px',
                                                }}>
                                                    <div>
                                                        {mode.name + ' ' + mode.temperature + ' '}
                                                        <IconButton
                                                            icon={faTrash}
                                                            onClick={(event) => { event.preventDefault(); handleRemoveWMMode(index) }}
                                                        />
                                                    </div>
                                                </Item>

                                            ))}
                                        </AllInputContainer>


                                    </InputContainer>

                                </>
                            )}
                            {renderFileInputSection({
                                handleChange: handleImageChange,
                                fileSource: base64Picture,
                                altText: 'Selected Image',
                                isValid: true
                            })}

                        </>
                    )}
                </DeviceFormFieldsContainer>
                {newDevice.variant && (
                    <HeaderWrapper>
                        <Button onClick={handleSubmit}>
                            Submit
                        </Button>
                    </HeaderWrapper>
                )}
            </StyledDeviceForm>
        </CenteredDiv>
    )
}