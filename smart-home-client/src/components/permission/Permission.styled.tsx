import styled from "styled-components";

export const StyledPermission = styled.div`
    width:100%;
`;

export const DeviceFormFieldsContainer = styled.div`
   display: flex;
  flex-direction: column;
  align-items: right; 
  padding: 20px;
  margin-top: 15px;
  text-align: left;
  margin-right: 10px;

`;

export const CustomInput = styled.input`
  background-color: #eee;
  border: 1px solid ${({ theme }) => theme.colors.main};
  padding-left: 15px;
  padding-right: 15px;
  padding-top:20px;
  padding-bottom: 13px;
  border-radius: 7px;
  width: 102%;
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