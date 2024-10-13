import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ToggleButtonProps } from "./DeviceCard";

export const ToggleButtonContainer = styled.div`
  margin-top: 10px; /* Add your desired margin */
`;

// Styled component for ToggleButton
export const ToggleButton = styled.button<ToggleButtonProps>`
    background-color: ${(props) => (props.isDeviceOn ? 'red' : 'green')};
    color: white;
    padding: 5px 10px;
    border: none;
    cursor: pointer; 
`;

export const ToggleACButton = styled.button<ToggleButtonProps>`
    border-radius: 20px;
    border: none;
    background-color: ${(props) => (props.isDeviceOn ? 'red' : 'green')};
    color: white;
    font-weight: bold;
    padding: 12px 45px;
    letter-spacing: 1px;
    text-transform: uppercase;
    padding: 5px 10px;
    cursor: pointer; 
    width: 40px;
    height: 40px;
    transition: transform 80ms ease-in;
    &:active {
    transform: scale(0.95);
    }
    &:focus {
      outline: none;
    }
    &:hover{
      cursor: pointer;
  }
`;

export const CardContainer = styled.div`
  border-radius: 15px;
  width: auto;
  display: flex;
  position: relative;
  background-color: white;
  margin: 0px auto 30px auto;
  box-shadow: 10px 12px 20px rgba(0, 0, 0, 0.1); /* Add shadow */
`;

export const InfoContainer = styled.div`
  flex: 1;
  padding: 25px;
  text-align: left;
  margin-left: 35px;
  width:320px;

`;
export const MoreInfoContainer = styled.div`
width: 10px;
  flex: 0;
  /* padding: 20px;
  text-align: left;
  margin-left: 35px; */

`;
export const Button2 = styled.button`
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.colors.main};
  background-color: ${({ theme }) => theme.colors.secondColor};
  color: #ffffff;
  font-size: 12px;
  font-weight: bold;
  padding: 12px 45px;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: transform 80ms ease-in;
  &:active {
    transform: scale(0.95);
  }
  &:focus {
    outline: none;
  }
  &:hover{
    cursor: pointer;
  }
  &:disabled{
    background-color: grey;

  }
`;
export const CustomInput2 = styled.input`
  background-color: #eee;
  margin: 5px;
  border: 1px solid ${({ theme }) => theme.colors.main};
  padding-left: 15px;
  padding-right: 15px;
  padding-top:10px;
  padding-bottom: 10px;
  border-radius: 7px;
  width: 80px;
  font-size: 15px;
 &.invalidInput {
    border: 1px solid red;
  }
  &:focus + label,
  &:not(:placeholder-shown) + label {
    top: 5px;
    font-size: 15px;
    color: #888;
  }
`;

export const ImageContainer = styled.div`
    width:250px;
    height: 280px;
    margin: 35px;
    margin-right: 30px;
    background-color: transparent;
    border-radius: 15px;
    overflow: hidden;
`;

export const Name = styled.h3`
  font-size: 28px;
  font-weight: bold;
`;

export const InfoLabels = styled.p`
  font-size: 18px;
  font-weight: normal;
`;

export const PinIcon = styled.i`
  color: black ;/* Color of the icon */
`;

export const EstateIcon = styled.i`
  color: ${({ theme }) => theme.colors.secondColor}; /* Color of the icon */
`;
export const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  margin-right: 10px;
  color: ${({ theme }) => theme.colors.secondColor};
`;


export const ToggleContainer = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
`;

export const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`;

export const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 34px;

  &:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: ${({ theme }) => theme.colors.secondColor};
    transition: 0.4s;
    border-radius: 50%;
  }

  ${ToggleInput}:checked + & {
    background-color: #b4e854;
  }

  ${ToggleInput}:checked + &:before {
    transform: translateX(26px);
  }
`;
