import { styled } from "styled-components";

export const StyledPage = styled.section`
  position: relative;
  padding-top: 50px;

  h2 {
    text-align: center;
    font-weight: bold;
    font-size: ${({ theme }) => theme.fontSizes.header};
    color: ${({ theme }) => theme.colors.secondColor};
  }
  input {
    text-align: center;
  }
`;
export const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 10px;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
`;

export const StyledLabel = styled.label`
  margin: 5px;
  font-size: ${({ theme }) => theme.fontSizes.large};
  color: ${({ theme }) => theme.colors.secondColor};
  font-weight: bold;
  padding: 5px;
`;

export const StyledInput = styled.input<{ isValid?: boolean }>`
  width: 160px;
  padding: 8px;
  border: 2px solid;
  border-color: ${({ theme, isValid }) =>
    isValid ? theme.colors.main : "red"};
  border-radius: 8px;
  font-size: ${({ theme }) => theme.fontSizes.standard};
  margin: 5px;
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-left: 55px;
`;

export const ButtonContainer = styled.article`
  position: absolute;
  bottom: 20px;
  left: 50px;
`;

export const PermissionButtonContainer = styled.article`
  margin-top: 30px;
  margin-left: -10px;
`;

export const ItemsListStyle = styled.div`
  margin-top: 0px;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  justify-content: space-around;

  @media (max-width: 768px) {
    gap: 8px;
  }
`;
export const BtnContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding: 70px;
  @media (max-width: 680px) {
    position: static;
    text-align: center;
    padding: 10px 0;
  }
`;

export const Card = styled.article`
  width: 200px;
  padding: 5px;
  position: relative;
  border: 2px solid ${({ theme }) => theme.colors.main};
  margin: 20px;
  text-align: center;
  border-radius: 10px;
  overflow: hidden;

  &:hover {
    border: 2px solid ${({ theme }) => theme.colors.secondColor};
  }

  h2 {
    color: ${({ theme }) => theme.colors.secondColor};
    font-size: 24px;
  }

  p {
    margin-bottom: 0;
    color: ${({ theme }) => theme.colors.secondColor};
    font-size: 15px;
  }
`;

export const GenresSection = styled.section`
  margin-top: 10px;
`;
export const ScreeningsSection = styled.section`
  margin-top: 10px;
`;

export const GenreList = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 10px;
  p {
    margin-top: 2px;
    margin-bottom: 8px;
  }
`;
export const ScreeningList = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 10px;
  p {
    margin-top: 2px;
    margin-bottom: 8px;
  }
`;

export const GenreItem = styled.li`
  display: inline-block;
  margin-right: 8px;
  margin-bottom: 3px;
  background-color: ${({ theme }) => theme.colors.secondColor};
  color: ${({ theme }) => theme.colors.textColor};
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 14px;
  margin-top: 5px;
`;
export const ScreeningItem = styled.li`
  display: inline-block;
  margin-right: 8px;
  margin-bottom: 3px;
  background-color: ${({ theme }) => theme.colors.main};
  color: ${({ theme }) => theme.colors.secondColor};
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 14px;
  margin-top: 5px;
`;

//-------------------------------------------------------------------
export const CenteredDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
export const Input = styled.input`
  background-color: #eee;
  border: 1px solid ${({ theme }) => theme.colors.main};
  padding: 12px 15px;
  margin: 8px 0;
  border-radius: 7px;
`;
export const DropDownManu = styled.select`
  background-color: #eee;
  border: 1px solid ${({ theme }) => theme.colors.main};
  padding: 12px 15px;
  margin-top: 5px;
  margin-bottom: 5px;
  border-radius: 7px;
  width:110%;
  &.invalidInput {
    border: 1px solid red;
  }
`;
export const Title1 = styled.h1`
  text-align: center;
  font-size: 40px; /* Example font size */
  font-weight: bold;
    margin-block-end: 0em;
    margin-top: 70px;
    color:white;
`;
export const Title2 = styled.h2`
  text-align: center;
  font-size: 22px; /* Example font size */
  font-weight: 400; /* Slightly thicker text */
  margin-block-start: 0em;
  margin-block-end: 0em;
  margin-bottom: 20px;
  color:white;
`;
export const TitleNo = styled.h2`
  text-align: center;
  font-size: 22px; /* Example font size */
  font-weight: 400; /* Slightly thicker text */
  margin-block-start: 0em;
  margin-block-end: 0em;
  margin-bottom: 20px;
  color:white;
  margin-top:90px;
`;
export const Title3 = styled.h3`
  text-align: center;
  font-size: 22px;
  font-weight: bold; 
  margin-block-start: 0em;
  margin-block-end: 0em;
  margin-bottom: 0;
  color:${({ theme }) => theme.colors.secondColor};
`;
export const TopSection = styled.div`
  width: 100%;
  height: 50vh;
  background-color: ${({ theme }) => theme.colors.secondColor};
`;
export const BottomSection = styled.div`
  width: 100%;
  margin-top: -50px;
  background-color: ${({ theme }) => theme.colors.primaryColor};
   
`;
