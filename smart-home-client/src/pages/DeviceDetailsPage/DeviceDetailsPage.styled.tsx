import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-wrap: wrap; 
`;

export const LeftDiv = styled.div`
  flex: 1;
  padding-right: 20px;
  margin-top: 30px;
`;

export const RightDiv = styled.div`
  flex: 1;
  margin-top:30px;
`;

export const CardContainer = styled.div`
  border-radius: 15px;
  //display: flex;
  position: relative;
  background-color: white;
  box-shadow: 10px 12px 20px rgba(0, 0, 0, 0.1); 
`;

export const Name = styled.h3`
  font-size: 28px;
  font-weight: bold;
  text-align:left;
  padding:10px;
  padding-left: 20px;
`;

export const TableCardContainer = styled.div`
  border-radius: 15px;
  //display: flex;
  padding:20px;
  padding-left: 30px;
  position: relative;
  background-color: white;
  box-shadow: 10px 12px 20px rgba(0, 0, 0, 0.1); 
`;

export const CustomInputLabel = styled.label`
  font-size: large;
`;
export const AllInputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
`;
export const InputContainer = styled.div`

`;

export const ClearDatesButton = styled.button`
  background-color: #b4e854;
  color: black;
  border: 2px solid ${({ theme }) => theme.colors.secondColor};
  padding: 7px;
  padding-right: 9px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1em;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondColor};
    border: 2px solid  ${({ theme }) => theme.colors.main};
    color: white;
  }

  &:focus {
    outline: none;
  }
`;


export const ModalButton = styled.button`
position: relative;
top: -125px;
right: -175px;
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


export const ResponsiveContainer = styled(Container)`
  @media (max-width: 768px) {
    flex-direction: column; 
  }
`;

