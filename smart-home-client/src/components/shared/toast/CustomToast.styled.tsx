import { styled } from "styled-components";

export const CenteredToast = styled.div`
  background-color: ${({theme}) => theme.colors.main};
  color: ${({theme}) => theme.colors.secondColor};
  padding: 16px;
  border-radius: 8px;
  border: 1.5px solid ${({theme}) => theme.colors.secondColor};
  width: 100%; 
  text-align: center;
  font-weight: bold;
`;