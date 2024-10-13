import styled from "styled-components";

export const Button = styled.button`
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

export const ButtonStyled = styled.button`
  width: 120px;
  margin: 5px;
  font-size: 12px;
  font-weight: bold;
  padding: 8px;
  background: none;
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.colors.secondColor};
  cursor: pointer;


  &:hover{
    transform: scale(0.95);
    /* border: 2px solid ${({ theme }) => theme.colors.secondColor}; */
  }
`;