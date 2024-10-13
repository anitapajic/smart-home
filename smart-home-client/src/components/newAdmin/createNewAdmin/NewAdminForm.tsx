import { renderFileInputSection } from "../../shared/picture/Picture";
import { NewUser } from "../../../models/User";
import { useState } from "react";
import { convertToBase64 } from "../../../utils/functions/convertToBase64";
import { validateEmail, validateImageRE, validatePassword } from "../../../utils/functions/validations";
import { showToast } from "../../shared/toast/CustomToast";
import UserService from "../../../services/UserService/UserService";
import { Button, Form, Title } from "../../../pages/LoginPage/LoginPage.styled";
import { CustomInput } from "./NewAdminForm.styled";
import useUser from "../../../utils/UserContext/useUser";


export type NewAdminFormProps = {
    onSubmit: () => void;
};

export default function NewAdminForm({ onSubmit }: NewAdminFormProps) {

    const [realPicture, setRealPicture] = useState<File>();
    const [base64Picture, setBase64Picture] = useState<string>('');

    const {user} = useUser();
    const [newUser, setNewUser] = useState<NewUser>({
        name: "",
        username: "",
        password: "",
        confPassword: "",
        picture: "",
    });

    const [isValidUsername, setIsValidUsername] = useState(true);
    const [isValidPassword, setIsValidPassword] = useState(true);
    const [isValidConfPassword, setIsValidConfPassword] = useState(true);
    const [isValidPicture, setIsValidPicture] = useState(true);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewUser((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        if (name === 'username') {
            setIsValidUsername(validateEmail(value));
        } else if (name === 'password') {
            setIsValidPassword(validatePassword(value));
        } else if (name === 'confPassword') {
            setIsValidConfPassword(value === newUser.password);
        }
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const base64Image = await convertToBase64(file);
                setRealPicture(file)
                setBase64Picture(base64Image);
                setNewUser((prev) => ({
                    ...prev,
                    picture: file.name,
                }))
                setIsValidPicture(validateImageRE(file.name))

            } catch (error) {
                console.error("Error converting image:", error);
            }
        }
    };

    const handleSignUp = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const isValidUsernameValue = validateEmail(newUser.username);
        const isValidPasswordValue = validatePassword(newUser.password);
        const isValidConfPasswordValue = newUser.password !== newUser.confPassword;
        const isValidPictureValue = newUser.picture === '';
        if (!isValidUsernameValue || !isValidPasswordValue || isValidConfPasswordValue || isValidPictureValue) {

            showToast("Please fill in all required fields.");
            setIsValidUsername(isValidUsernameValue)
            setIsValidPassword(isValidPasswordValue)
            setIsValidConfPassword(!isValidConfPasswordValue)
            setIsValidPicture(!isValidPictureValue)
        } else {
            console.log("aaaaaaaaaaaaaaaaaaaaaa")
            const formData = new FormData();
            formData.append('file', realPicture!)
            try {
                console.log("try")
                await fetch(`http://localhost:84/images/upload/users`, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Authorization': user?.token!,
                    },
                })
                console.log("await")

            } catch (error) {
                console.log(error)
            }
            console.log("bbbbbbbbbbbbbbbbbbbbbbb")
            UserService.registerAdmin(newUser)
                .then((response) => {
                    console.log("Admin created:", response.data);
                    showToast("Admin successfully created!")
                    onSubmit()
                })
                .catch((error) => {
                    console.error("Error creating admin:", error);
                    showToast(error.response.data)
                });
        }

    };
    return (
        <>

            <Form>
                <Title>Create New Admin</Title>

                <CustomInput
                    type="text"
                    placeholder="Full Name"
                    name="name"
                    value={newUser.name}
                    onChange={handleInputChange}
                />
                <CustomInput
                    type="email"
                    placeholder="Email"
                    name="username"
                    value={newUser.username}
                    onChange={handleInputChange}
                    className={isValidUsername ? '' : 'invalidInput'}
                />
                {isValidUsername ? null : (
                    <small className="error-text">Email is not valid!</small>
                )}
                <CustomInput
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={newUser.password}
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
                    value={newUser.confPassword}
                    onChange={handleInputChange}
                    className={isValidConfPassword ? '' : 'invalidInput'}

                />
                {isValidConfPassword ? null : (
                    <small className="error-text">Passwords do not match!</small>
                )}
                {renderFileInputSection({
                    handleChange: handleImageChange,
                    fileSource: base64Picture,
                    altText: 'Selected Image',
                    isValid: isValidPicture,
                })}

                <Button onClick={handleSignUp}>Sign Up</Button>

            </Form>

        </>
    )
}
