import styled from "styled-components";

export const StyledDeviceForm = styled.form`

  gap: 10px;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
`;

export const DeviceFormFieldsContainer = styled.div`
   display: flex;
  flex-direction: column;
  align-items: right; 
  padding: 20px;
  margin-top: 15px;
  text-align: left;
  margin-right: 30px;

`;


export const AddButton = styled.button`
  position: absolute;
  right: 0px;
  font-size: 14px;
  border-radius: 10px;
  height: 35px;
  border: 1px solid ${({ theme }) => theme.colors.main};
  background-color: ${({ theme }) => theme.colors.secondColor};
  color: #ffffff;
  cursor: pointer;

  &:hover{
    transform: scale(0.95);
  }
`;


export const AddPermissionButton = styled.button`
  position: absolute;
  left: 30px;
  top: 65px;
  font-size: 14px;
  border-radius: 10px;
  height: 40px;
  min-width: 170px;
  border: 1px solid ${({ theme }) => theme.colors.main};
  background-color: ${({ theme }) => theme.colors.secondColor};
  color: #ffffff;
  cursor: pointer;

  &:hover{
    transform: scale(0.95);
  }
`;


export const RemoveButton = styled.button`
  position: absolute;
  right: 10px;
  top: 65px;
  font-size: 14px;
  border-radius: 10px;
  height: 40px;
  min-width: 170px;
  border: 1px solid ${({ theme }) => theme.colors.main};
  background-color: ${({ theme }) => theme.colors.secondColor};
  color: #ffffff;
  cursor: pointer;

  &:hover{
    transform: scale(0.95);
  }
`;