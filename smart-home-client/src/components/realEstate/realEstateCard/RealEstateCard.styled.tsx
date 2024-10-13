import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

export const CardContainer = styled.div`
  border-radius: 15px;
  width: 55%;
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

`;

export const ImageContainer = styled.div`
    width: 254px;
    height: 280px;
    margin: 35px;
    margin-right: 45px;
    background-color: transparent;
    border-radius: 15px;
    overflow: hidden;
`;

export const Name = styled.h3`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 25px;
`;

export const InfoLabels = styled.p`
  font-size: 18px;
  font-weight: normal;
  b{
    font-weight: bolder;
  }
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