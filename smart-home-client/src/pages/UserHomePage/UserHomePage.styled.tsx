import styled, { keyframes } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  margin-left: 5px;
`;

export const RealEstateContainer = styled.div`
  display: flex;
  flex-direction: column;

`;

const enlargeButton = keyframes`
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.2);
  }
`;
export const CustomButton = styled.button`
   border-radius: 30px;
  padding: 15px 35px;
  background-color: #b4e854;
  color: black;
  border: none;
  cursor: pointer;
  font-weight: bold;
  font-size: 18px;
  margin-top: 10px;
  margin-bottom: 10px;
  transition: transform 0.5s;

  &:hover {
    animation: ${enlargeButton} 0.5s forwards;
  }
`;
export const ArrowIcon = styled.i`
  margin-left: 5px;
`;

export const SearchInput = styled.div`
  margin-top: 50px;
`;

