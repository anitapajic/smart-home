import styled from "styled-components";

export const AppContainer = styled.div`
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: whitesmoke;
`;

export const ContentContainer = styled.div<{ isMenuOpen: boolean }>`
  flex: 1;
  padding-top: ${({ isMenuOpen }) => (isMenuOpen ? "200px" : "0px")};
  transition: padding-top 0.3s ease-in-out;
`;
