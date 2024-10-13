import { useState } from "react";
import { showToast } from "../shared/toast/CustomToast";
import { Button, Form } from "../../pages/LoginPage/LoginPage.styled";
import { CustomInput } from "../newAdmin/createNewAdmin/NewAdminForm.styled";
import { Vehicle } from "../../models/Vehicle";
import VehicleService from "../../services/VehicleService/VehicleService";
import { Gate } from "../../models/SPU-devices/Gate";
import { Device } from "../../models/Device";



export type AddVehicleFormProps = {
    device: Device;
    onSubmit: (vehicle: Vehicle) => void;
};

export default function AddVehicleForm({ onSubmit,device }: AddVehicleFormProps) {
    const [vehicleData, setVehicleData] = useState({
        registration: '',
        gateId: device.id, 
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // const newValue = name === 'gateId' ? Number(value) : value;
        setVehicleData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const [isValidRegistration, setIsValidRegistration] = useState(true);

    

    const handleAddVehicle = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (vehicleData.registration.length !== 6) {
            showToast("Registration must be exactly 6 characters.");
            setIsValidRegistration(false);
        } else {
           
            
            VehicleService.addVehicle(vehicleData) // Sada prosleđujete celokupan vehicleData
                .then(response => {
                    showToast(`Vehicle with registration ${vehicleData.registration} added successfully`);
                    onSubmit(vehicleData);
                })
                .catch(error => {
                    console.error("Error: ", error);
                });
        }
    };

    return <Form>
        <CustomInput
            type="text"
            placeholder="Registration"
            name="registration"
            value={vehicleData.registration}
            onChange={handleInputChange}
        />
        {isValidRegistration ? null : (
            <small className="error-text">Registration must be exactly 6 characters!</small>
        )}
        <Button onClick={handleAddVehicle}>Add Vehicle</Button>
    </Form>
}
