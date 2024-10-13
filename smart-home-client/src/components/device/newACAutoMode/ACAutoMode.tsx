import { useState } from "react";
import { ACAutoModeDTO } from "../../../models/PKA-devices/AirConditioning";
import { Button } from "../../shared/button/Button.styled";
import { InputLabel, Title } from "@mantine/core";
import { Device } from "../../../models/Device";
import { FilterSelect } from "../deviceGraph/DeviceGraph.styled";
import { Form } from "../../../pages/LoginPage/LoginPage.styled";
import { CustomInput, CustomInputLabel, InputContainer } from "../../../pages/NewRealEstatePage/NewRealEstatePage.styled";

export type NewACAutoModeFormProps = {
    onSubmit: (newMode: ACAutoModeDTO) => void;
    ac: Device;
};

export default function NewACAutoModeForm({ onSubmit, ac }: NewACAutoModeFormProps) {
    const [newMode, setNewMode] = useState<ACAutoModeDTO>({
        acId: ac.id,
        from: "12:00",
        to: "13:00",
        mode: ac.modes![0],
        temperature: ac.currentTemperature!,
        condition: true,
        conditionTemperature: ac.currentTemperature!
    });


    const handleSignUp = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        onSubmit(newMode)
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        const isNumeric = name.toLowerCase().endsWith("temperature");
        setNewMode(prev => ({
            ...prev,
            [name]: isNumeric ? Number(value) : value
        }));

    };


    const handleACModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setNewMode(prev => ({
            ...prev, mode: event.target.value
        }));
    };

    const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()
        if (event.target.name === "fromTime")
            setNewMode(prev => ({
                ...prev, from: event.target.value
            }));
        setNewMode(prev => ({
            ...prev, to: event.target.value
        }));
    };

    const handleConditionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        setNewMode(prev => ({
            ...prev, condition: selectedValue === "1" ? true : false
        }));
    }



    return (
        <>
            <Form>
                <Title>Create New Auto Mode</Title>
                <InputContainer>
                    <CustomInput
                        type="time"
                        placeholder=" "
                        id="fromTime"
                        name="fromTime"
                        value={newMode.from}
                        onChange={handleTimeChange}
                    />
                    <CustomInputLabel>From: </CustomInputLabel>
                </InputContainer>

                <InputContainer>
                    <CustomInput
                        type="time"
                        placeholder=" "
                        id="toTime"
                        name="toTime"
                        value={newMode.to}
                        onChange={handleTimeChange}
                    />
                    <CustomInputLabel>To: </CustomInputLabel>
                </InputContainer>

                <InputContainer>
                    <CustomInput
                        type="number"
                        placeholder=" "
                        name="temperature"
                        value={newMode.temperature}
                        onChange={handleInputChange}
                        min={ac.minTemperature}
                        max={ac.maxTemperature}
                    />
                    <CustomInputLabel>Mode temperature: </CustomInputLabel>

                </InputContainer>


                <InputContainer>
                    <InputLabel>Mode </InputLabel>

                    <FilterSelect id="temperatureDropDown" value={newMode.mode} onChange={handleACModeChange}>
                        {ac.modes!.map((mode) => (
                            <option value={mode} >
                                {mode}
                            </option>
                        ))}
                    </FilterSelect>

                </InputContainer>


                <InputContainer>
                    <CustomInput
                        type="number"
                        placeholder=" "
                        name="conditionTemperature"
                        value={newMode.conditionTemperature}
                        onChange={handleInputChange}
                        min={-50}
                        max={50}
       
                    />
                    <CustomInputLabel>Condition temperature: </CustomInputLabel>

                </InputContainer>
                <InputContainer style={{maxWidth:"200px"}}>
                    <InputLabel> Turn on when temperature is 
                        <FilterSelect id="conditionDropDown" value={newMode.condition ? 1 : 0} onChange={handleConditionChange}>
                            <option value={1}> BELOW</option>
                            <option value={0}> ABOVE</option>
                        </FilterSelect>
                         condition temperature </InputLabel>

                </InputContainer>


                <Button onClick={handleSignUp}>SUBMIT</Button>

            </Form>

        </>
    )

}