import {
  Container,
  Title,
  Text,
  Group,
  Button,
  TextProps,
} from "@mantine/core";
import styled from "styled-components";

export const StyledErrorPage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 110px;
`;
export const StyledContainer = styled(Container)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

export const StyledDiv = styled.div`
  text-align: center;

  margin: auto;
  padding: 40px;
  background-color: #ffffff;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);

  p:first-child {
    font-size: 80px;
    margin: 0;
  }
`;

export const StyledTitle = styled(Title)`
  color: #333;
  font-size: 24px;
  margin-bottom: 20px;
`;

export const StyledText = styled(Text)<TextProps>`
  color: ${(props) => (props.c === "dimmed" ? "#777" : "#333")};
  font-size: ${(props) => (props.size === "lg" ? "1.25rem" : "inherit")};
  text-align: ${(props) => props.ta || "inherit"};
  margin-bottom: 20px;
`;

export const StyledGroup = styled(Group)`
  margin-top: 20px;
`;

export const StyledButton = styled(Button)`
  padding: 10px 20px;
  color: ${({ theme }) => theme.colors.secondColor};
  background-color: ${({ theme }) => theme.colors.main};
  border: none;
  border-radius: 4px;
  transition: background-color 0.2s;
  font-weight: bold;

  &:hover {
    cursor: pointer;
  }
`;
