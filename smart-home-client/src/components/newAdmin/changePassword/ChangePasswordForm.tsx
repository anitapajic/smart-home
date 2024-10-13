import { ChangePassword } from "../../../models/User";
import { useState } from "react";
import { validateEmail, validatePassword } from "../../../utils/functions/validations";
import { showToast } from "../../shared/toast/CustomToast";
import UserService from "../../../services/UserService/UserService";
import { Button, Form, Title } from "../../../pages/LoginPage/LoginPage.styled";
import { CustomInput } from "./ChangePasswordForm.styled";
import Role from "../../../models/enums/Role";



export type ChangePasswordFormProps = {
    onSubmit: (response: any) => void;
    username: string;
    role: Role;
};

export default function ChangePasswordForm({ onSubmit, username, role }: ChangePasswordFormProps) {

    const [userChange, setUserChange] = useState<ChangePassword>({
        username: username,
        password: "",
        confPassword: "",
    });

    const [isValidUsername, setIsValidUsername] = useState(true);
    const [isValidPassword, setIsValidPassword] = useState(true);
    const [isValidConfPassword, setIsValidConfPassword] = useState(true);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        
        const { name, value } = e.target;
        console.log(name);
        setUserChange((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        if (name === 'username') {
            setIsValidUsername(validateEmail(value));
        } else if (name === 'password') {
            setIsValidPassword(validatePassword(value));
        } else if (name === 'confPassword') {
            setIsValidConfPassword(value === userChange.password);
        }
    };


    const handleSignUp = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        //const isValidUsernameValue = validateEmail(userChange.username);
        const isValidPasswordValue = validatePassword(userChange.password);
        const isValidConfPasswordValue = userChange.password !== userChange.confPassword;
        if ( !isValidPasswordValue || isValidConfPasswordValue) {

            showToast("Please fill in all required fields.");
            //setIsValidUsername(isValidUsernameValue)
            setIsValidPassword(isValidPasswordValue)
            setIsValidConfPassword(!isValidConfPasswordValue)
        } else {

            UserService.changePassword(userChange)
                .then((response) => {
                    showToast("Password successfully changed!")
                    onSubmit(response)
                })
                .catch((error) => {
                    console.error("Error changing password:", error);
                    showToast(error.response.data)
                });
        }

    };
    return (
        <>

            <Form>
                <Title>Change Password</Title>

                <CustomInput
                    type="email"
                    placeholder={ role === Role.SUPERADMIN ? 'Enter new email address' : ''}
                    name="username"
                    value={userChange.username}
                    onChange={handleInputChange}
                    className={isValidUsername ? '' : 'invalidInput'}
                    disabled={role === Role.ADMIN} // Disable input if the role is ADMIN
                />
                {isValidUsername ? null : (
                    <small className="error-text">Email is not valid!</small>
                )}
                <CustomInput
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={userChange.password}
                    onChange={handleInputChange}
                    className={isValidPassword ? '' : 'invalidInput'}

                />
                {isValidPassword ? null : (
                    <small className="error-text">Password is not strong enough!</small>
                )}
                <CustomInput
                    type="password"
                    placeholder="Confirm password"
                    name="confPassword"
                    value={userChange.confPassword}
                    onChange={handleInputChange}
                    className={isValidConfPassword ? '' : 'invalidInput'}

                />
                {isValidConfPassword ? null : (
                    <small className="error-text">Passwords do not match!</small>
                )}

                <Button onClick={handleSignUp}>Sign Up</Button>

            </Form>

        </>
    )
}
