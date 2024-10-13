import { useState } from "react";
import { Button } from "../../shared/button/Button.styled";
import { InputLabel, Title } from "@mantine/core";
import { Device } from "../../../models/Device";
import { FilterSelect } from "../deviceGraph/DeviceGraph.styled";
import { Form } from "../../../pages/LoginPage/LoginPage.styled";
import { CustomInput, CustomInputLabel, InputContainer } from "../../../pages/NewRealEstatePage/NewRealEstatePage.styled";
import { WashingMachineAutoDTO } from "../../../models/PKA-devices/WashingMachine";

export type NewWMAutoModeFormProps = {
    onSubmit: (newMode: WashingMachineAutoDTO) => void;
    wm: Device;
};

export default function NewWMAutoModeForm({ onSubmit, wm }: NewWMAutoModeFormProps) {
    const [newMode, setNewMode] = useState<WashingMachineAutoDTO>({
        wmId: wm.id,
        time: "12:00",
        date: "",
        mode: wm.wmmodes![0],
    });


    const handleSignUp = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        onSubmit(newMode)
    }



    const handleWMModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setNewMode(prev => ({
            ...prev, wmmodes: event.target.value
        }));
    };

    const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()
        setNewMode(prev => ({
            ...prev, time: event.target.value
        }));
    };

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()
        setNewMode(prev => ({
            ...prev, date: event.target.value
        }));
    };

    return (
        <>
            <Form>
                <Title>Create New Auto Mode</Title>
                <InputContainer>
                    <CustomInput
                        type="time"
                        placeholder=" "
                        id="time"
                        name="time"
                        value={newMode.time}
                        onChange={handleTimeChange}
                    />
                    <CustomInputLabel>Time: </CustomInputLabel>
                </InputContainer>

                <InputContainer>
                    <CustomInput
                        type="date"
                        placeholder=" "
                        id="date"
                        name="date"
                        value={newMode.date}
                        onChange={handleDateChange}
                    />
                    <CustomInputLabel>Time: </CustomInputLabel>
                </InputContainer>


                <InputContainer>
                    <InputLabel>Mode </InputLabel>

                    <FilterSelect id="temperatureDropDown" value={newMode.mode.name + " " + newMode.mode.temperature} onChange={handleWMModeChange}>
                        {wm.wmmodes!.map((mode) => (
                            <option value={mode.id} >
                                {mode.name + ' ' + mode.temperature}
                            </option>
                        ))}
                    </FilterSelect>

                </InputContainer>


                <Button onClick={handleSignUp}>SUBMIT</Button>

            </Form>

        </>
    )

}