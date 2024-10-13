import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";



export const RealEstateContainer = styled.div`
  display: flex;
  flex-direction: column;

`;


export const FormContainer = styled.div`
  border-radius: 15px;
  width: 55%;
  display: flex;
  background-color: white;
  margin: 0px auto; /* Center the form */
  box-shadow: 10px 12px 20px rgba(0, 0, 0, 0.1); /* Add shadow */
`;

export const FormFieldsContainer = styled.div`
  width:38%;
   display: flex;
  flex-direction: column;
  align-items: right; 
  padding: 20px;
  margin-top: 15px;
  text-align: left;
  margin-left: 20px;
`;

export const ImageUploadContainer = styled.div`
  width: 254px;
  height: 270px;
  margin: 35px;
  margin-right: 45px;
  background-color: beige;
  border-radius: 15px;
  overflow: hidden;
`;

export const FormLabel = styled.label`
  font-size: 18px;
  font-weight: bold;
`;

export const FormInput = styled.input`
  width: calc(100% - 20px);
  padding: 10px;
  margin: 8px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
`;


export const ArrowIcon = styled.i`
  margin-left: 5px;
`;

export const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  margin-right:10px;
  margin-left:5px;
  color: ${({ theme }) => theme.colors.secondColor};
`;


export const InputContainer = styled.div`
  position: relative;
  margin: 5px 0;
`;

export const CustomInput = styled.input`
  background-color: #eee;
  border: 1px solid ${({ theme }) => theme.colors.main};
  padding-left: 15px;
  padding-right: 15px;
  padding-top:20px;
  padding-bottom: 13px;
  border-radius: 7px;
  width: 110%;
  min-width: 200px;
 &.invalidInput {
    border: 1px solid red;
  }
  &:focus + label,
  &:not(:placeholder-shown) + label {
    top: 5px;
    font-size: 12px;
    color: #888;
  }
`;
export const CustomInputDD = styled.select`
  background-color: #eee;
  border: 1px solid ${({ theme }) => theme.colors.main};
  padding-left: 15px;
  padding-right: 15px;
  padding-top:20px;
  padding-bottom: 13px;
  border-radius: 7px;
  &.invalidInput {
    border: 1px solid red;
  }

  &:focus + label,
  &:not(:placeholder-shown) + label {
    top: 5px;
    font-size: 12px;
    color: #888;
  }
`;
export const CustomInputLabel = styled.label`
  position: absolute;
  pointer-events: none;
  left: 10px;
  top: 13px;
  font-size: 14px;
  color: #aaa;
  transition: all 0.3s ease;
`;
export const ParentContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%; /* Adjust width as needed */
  margin-top: 5px;
`;

export const Container = styled.div`
  flex: 0 0 43%; /* Adjust the width of the input containers */
  
`;
export const MapContainer = styled.div`
  width: 50%; /* Adjust the width as needed */
  height: 400px; /* Adjust the height as needed */
`;

export const Map = styled.div`
  width: 100%;
  height: 100%;
  
`;