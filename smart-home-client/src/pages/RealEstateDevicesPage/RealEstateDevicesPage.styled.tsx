import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled, { keyframes } from "styled-components";

const enlargeButton = keyframes`
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.2);
  }
`;
export const CustomButton2 = styled.button`
   border-radius: 30px;
  padding: 15px 30px;
  background-color: ${({ theme }) => theme.colors.secondColor};
  color: white;
  border: 2px solid white;
  cursor: pointer;
  font-weight: bold;
  font-size: 18px;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left:20px;
  transition: transform 0.5s;

  &:hover {
    animation: ${enlargeButton} 0.5s forwards;
  }

`;
export const ArrowIcon = styled.i`
  margin-left: 5px;
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const StyledFontAwesomeIcon2 = styled(FontAwesomeIcon)`
  margin-right:10px;
  margin-left:5px;
  color: ${({ theme }) => theme.colors.grey};
  font-size: large;
`;

export const SearchInput = styled.div`
  margin-top: 50px;
`;

export const StyledInputSearch = styled.input`
  width: 240px;
  padding: 10px;
  border: 2px solid ${({ theme }) => theme.colors.grey};
  border-radius: 10px;
  font-size: ${({ theme }) => theme.fontSizes.standard};
  margin: 5px;
  margin-right: 30px;
  background-color: ${({ theme }) => theme.colors.secondColor};
  margin-bottom: 30px;
  color: white;
  &::placeholder, &::placeholder {
    color: white;
    font-size: 15px;
  }
  
`;