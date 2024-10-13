import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

export const RightDiv = styled.div`
  flex: 1;
  padding-right: 20px;
`;

export const StyledInputSearch = styled.input`
  width: 170px;
  padding: 8px;
  border: 2px solid  ${({ theme }) => theme.colors.secondColor};
  border-radius: 10px;
  font-size: ${({ theme }) => theme.fontSizes.standard};
  margin: 5px;

  &::placeholder, &::placeholder {
    text-align: left;
    font-size: 16px;
  }
`;

export const StyledFontAwesomeIcon3 = styled(FontAwesomeIcon)`
  margin-left: 5px;
  font-size: large;
`;
export const LeftDiv = styled.div`
  flex: 1;
  padding-right: 20px;
`;