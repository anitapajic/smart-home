import { useState } from "react";
import { Button, Form } from "../../../pages/LoginPage/LoginPage.styled";
import { CustomInput } from "../../newAdmin/createNewAdmin/NewAdminForm.styled";
import { showToast } from "../../shared/toast/CustomToast";
import { RealEstate, RealEstateStatusChange } from "../../../models/RealEstate";
import { RealEstateStatus } from "../../../models/enums/RealEstateStatus";
import RealEstateService from "../../../services/RealEstateService/RealEstateService";

export type DeclineFormProps = {
    realEstate : RealEstate,
    onSubmit: (realEstate: RealEstate) => void;
};

export default function DeclineRealEstateForm({ onSubmit, realEstate }: DeclineFormProps) {
    const [change, setChange] = useState<RealEstateStatusChange>({
        id: realEstate.id,
        status: RealEstateStatus.DECLINED,
        reason : "",
    });
    const [isValidReason, setIsValidReason] = useState(true);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setChange((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        if (name === 'reason') {
            setIsValidReason(!(value.length < 10));

        };
    }
    const handleDecline = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if(change.reason.length < 10){
            showToast("Please fill in reason field.");
            setIsValidReason(false)
        }else{
            RealEstateService.changeRealEstateStatus(change).then(response => {
                showToast(`Declinded ${realEstate.name} real estate`)
                onSubmit(realEstate)
            }).catch(error => {
                console.error("Error: ", error)
            })
        }
    }

    return <Form>

        <CustomInput
            type="text"
            placeholder="Reason"
            name="reason"
            value={change.reason}
            onChange={handleInputChange}
        />
        {isValidReason ? null : (
            <small className="error-text">Reason is not valid!</small>
        )}
        <Button onClick={handleDecline}>Decline</Button>
    </Form>
}
