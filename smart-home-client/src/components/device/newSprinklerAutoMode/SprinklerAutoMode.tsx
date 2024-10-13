import { useEffect, useState } from "react";
import { ACAutoModeDTO } from "../../../models/PKA-devices/AirConditioning";
import { Button } from "../../shared/button/Button.styled";
import { InputLabel, Title } from "@mantine/core";
import { Device } from "../../../models/Device";
import { FilterSelect } from "../deviceGraph/DeviceGraph.styled";
import { Form } from "../../../pages/LoginPage/LoginPage.styled";
import { CustomInput, CustomInputLabel, InputContainer } from "../../../pages/NewRealEstatePage/NewRealEstatePage.styled";
import { SprinklerAutoModeDTO } from "../../../models/SPU-devices/Sprinkle";
import { DayButton, StyledButton, StyledButtonContainer } from "./SprinklerAutoMode.styled";

export type NewSprinklerAutoModeFormProps = {
    onSubmit: (newMode: SprinklerAutoModeDTO) => void;
    ac: Device;
};

export default function NewSprinklerAutoModeForm({ onSubmit, ac }: NewSprinklerAutoModeFormProps) {
    const [newMode, setNewMode] = useState<SprinklerAutoModeDTO>({
        sprinklerId: ac.id,
        from: "12:00",
        to: "13:00",
        condition: true,
        repeat: 8,
    });


    const handleSignUp = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        onSubmit(newMode)
    }




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

    const [selectedDay, setSelectedDay] = useState<number>();
    const [activeButton, setActiveButton] = useState<string | null>(null);

    const handleDayClick = (dayIndex: number) => {
        setSelectedDay(dayIndex);

        setNewMode((prevMode) => ({
            ...prevMode,
            repeat: dayIndex,
        }));

    };

    const handleEveryDayClick = () => {
        setSelectedDay(7);
        setNewMode((prevMode) => ({
            ...prevMode,
            repeat: 7,
        }));
        setActiveButton('everyDay');
    };

    const handleNullClick = () => {
        setSelectedDay(8);
        setNewMode((prevMode) => ({
            ...prevMode,
            repeat: 8,
        }));
        setActiveButton('clear');
    };

    useEffect(() => {
        // Ažuriranje repeat u skladu sa zadatim uslovima
        if (selectedDay !== undefined && selectedDay !== null && selectedDay !== 7 && selectedDay !== 8) {
            setNewMode((prevMode) => ({
                ...prevMode,
                repeat: selectedDay,
            }));
        } else if (selectedDay === 7) {
            setNewMode((prevMode) => ({
                ...prevMode,
                repeat: 7,
            }));
        } else if (selectedDay === 8) {
            setNewMode((prevMode) => ({
                ...prevMode,
                repeat: 8,
            }));
        }

        console.log(`Updated selectedDay: ${newMode.repeat}`);
    }, [selectedDay]);

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

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', marginLeft: '15px', marginBottom:'10px' }}>
                    {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => (
                        <DayButton
                            key={dayIndex}
                            className={selectedDay === dayIndex ? 'active' : ''}
                            onClick={(event) => { event.preventDefault(); handleDayClick(dayIndex) }}
                        >
                            {['S','M', 'T', 'W', 'T', 'F', 'S'][dayIndex]}
                        </DayButton>
                    ))}

                </div>
                <StyledButtonContainer>
                    <StyledButton onClick={(event) => { event.preventDefault(); handleEveryDayClick() }}
                        className={selectedDay ===7  ? 'active' : ''}>Every Day</StyledButton>
                    <StyledButton onClick={(event) => { event.preventDefault(); handleNullClick() }}
                        className={selectedDay === 8 ? 'active' : ''}>Only once</StyledButton>
                </StyledButtonContainer>
                

                <InputContainer style={{maxWidth:"200px"}}>
                    <InputLabel> Turn 
                        <FilterSelect id="conditionDropDown" value={newMode.condition ? 1 : 0} onChange={handleConditionChange}>
                            <option value={1}> ON</option>
                            <option value={0}> OFF</option>
                        </FilterSelect></InputLabel>

                </InputContainer>


                <Button onClick={handleSignUp}>SUBMIT</Button>

            </Form>

        </>
    )

}