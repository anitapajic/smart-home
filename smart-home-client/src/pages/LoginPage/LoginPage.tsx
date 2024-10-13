import React, { useState } from "react";
import {
  Anchor,
  Button,
  Container,
  Form,
  GhostButton,
  Input,
  LeftOverlayPanel,
  Overlay,
  OverlayContainer,
  Paragraph,
  RightOverlayPanel,
  SignInContainer,
  SignUpContainer,
  Title,
  Wrapper,
} from "./LoginPage.styled";
import { NewUser } from "../../models/User";
import UserService from "../../services/UserService/UserService";
import useUser from "../../utils/UserContext/useUser";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../components/shared/toast/CustomToast";
import { convertToBase64 } from "../../utils/functions/convertToBase64";
import { renderFileInputSection } from "../../components/shared/picture/Picture";
import { validateEmail, validateImageRE, validatePassword } from "../../utils/functions/validations";
import { getNext } from "../../utils/functions/getNextPage";
import { CustomInput } from "../../components/newAdmin/createNewAdmin/NewAdminForm.styled";
import Modal from "../../components/shared/modal/Modal";
import ChangePasswordForm from "../../components/newAdmin/changePassword/ChangePasswordForm";


export interface Props {
  signinIn?: boolean;
}

const LoginPage = () => {
  const [signInPanel, setSignInPanel] = useState(true);

  const [isModalVisible, setIsModalVisible] = useState(false);

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

  const [realPicture, setRealPicture] = useState<File>();
  const [base64Picture, setBase64Picture] = useState<string>('');

  const [loginUser, setLoginUser] = useState({
    username: "",
    password: "",
  });

  const { user, setUser } = useUser();
  const navigate = useNavigate();

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

  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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
    console.log(newUser)
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

      const formData = new FormData();
      formData.append('file', realPicture!)
      try{
          const response = await fetch(`http://localhost:84/images/upload/users`, {
              method: 'POST',
              body: formData,
         })
          if(response.ok){
              console.log('FIle uploaded')
          }else {
              console.log('FIle not uploaded')

          }
      }catch (error){
          //console.log(error)
      }


      UserService.register(newUser)
        .then((response) => {
          showToast("Please check your email for verification!")
        })
        .catch((error) => {
          console.error("Error registering user:", error);
          showToast(error.response.data)
        });
    }
  };

  const handleSignIn = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    UserService.login(loginUser)
      .then((response) => {
        localStorage.setItem("user", JSON.stringify(response.data));
        setUser(response.data);

        if(response.data.passChange === true){
          
          setIsModalVisible(true);
          return;
        }
        showToast("Login Successful!");
        navigate(getNext(response.data.role))

      })
      .catch((error) => {
        console.error("Error logging in:", error);
        showToast(error.response.data);
      });
  };
  const handleFormCancel = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsModalVisible(false);
  };

  const handleFormSubmit= (response : any) => {
    setUser(response.data);
    localStorage.setItem("user", JSON.stringify(response.data));
    navigate(getNext(response.data.role))
    setIsModalVisible(false);
  };
  

  return (
    <div>
         <Modal isVisible={isModalVisible} onClose={handleFormCancel}>
              <ChangePasswordForm onSubmit={handleFormSubmit} username={loginUser.username!} role = {user?.role!}></ChangePasswordForm>
          </Modal>
    <Wrapper>
      <Container>
        <SignUpContainer signinIn={signInPanel}>
          <Form>
            <Title>Create Account</Title>
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
        </SignUpContainer>

        <SignInContainer signinIn={signInPanel}>
          <Form>
            <Title>Sign in</Title>
            <Input
              type="email"
              placeholder="Email"
              name="username"
              value={loginUser.username}
              onChange={handleLoginInputChange}
            />
            <Input
              type="password"
              placeholder="Password"
              name="password"
              value={loginUser.password}
              onChange={handleLoginInputChange}
            />
            <Anchor href="#">Forgot your password?</Anchor>
            <Button onClick={handleSignIn}>Sign In</Button>
          </Form>
        </SignInContainer>

        <OverlayContainer signinIn={signInPanel}>
          <Overlay signinIn={signInPanel}>
            <LeftOverlayPanel signinIn={signInPanel}>
              <Title>Welcome Back!</Title>
              <Paragraph>
                To keep connected with us please login with your personal info
              </Paragraph>
              <GhostButton onClick={() => setSignInPanel(true)}>
                Sign In
              </GhostButton>
            </LeftOverlayPanel>

            <RightOverlayPanel signinIn={signInPanel}>
              <Title>Hello, Friend!</Title>
              <Paragraph>
                Enter Your personal details and start journey with us
              </Paragraph>
              <GhostButton onClick={() => setSignInPanel(false)}>
                Sign Up
              </GhostButton>
            </RightOverlayPanel>
          </Overlay>
        </OverlayContainer>
      </Container>
    </Wrapper>
    </div>

  );
};

export default LoginPage;
