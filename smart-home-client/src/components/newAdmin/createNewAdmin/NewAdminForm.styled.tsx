import styled from "styled-components";

export const ChangePasswordContainer = styled.div`
  border-radius: 15px;
  box-shadow: 10px 12px 20px rgba(0, 0, 0, 0.1); /* Add shadow */
  min-height: 400px;
  margin: 30px 25% ;
  width: 50%;
`;

export const CustomInput = styled.input`
  background-color: #eee;
  margin: 5px;
  border: 1px solid ${({ theme }) => theme.colors.main};
  padding-left: 15px;
  padding-right: 15px;
  padding-top:20px;
  padding-bottom: 13px;
  border-radius: 7px;
width: 110%;
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