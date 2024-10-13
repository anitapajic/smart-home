import styled from "styled-components";

export const AllInputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 5px;
`;

export const FilterButton = styled.button`
  width: 120px;
  height: 37px;
  padding: 8px;  
  margin: 5px;

  font-size: 12px;
  font-weight: bold;

  background: ${({ theme }) => theme.colors.main};
  border-radius: 8px;
  border: 2px solid ${({ theme }) => theme.colors.secondColor};
  cursor: pointer;

  &:hover{
    transform: scale(0.95);
  }
    
`
export const FilterDate = styled.input<{ isValid?: boolean }>`
  width: 100px;
  padding: 8px;
  margin: 5px;

  font-size: ${({ theme }) => theme.fontSizes.standard};

  border: 2px solid;
  border-color: ${({ theme, isValid }) =>
        isValid ? theme.colors.main : "red"};
  border-radius: 8px;
`;

export const FilterSelect = styled.select`
  width: 120px;
  height: 37px;
  padding: 8px;  
  margin: 5px;
  background-color: #eee;


  font-size: ${({ theme }) => theme.fontSizes.standard};

  border: 2px solid ${({ theme }) => theme.colors.main};
  border-radius: 8px;
  &.invalidInput {
    border: 1px solid red;
  }
`

export const FilterSelect2 = styled.select`
  width: 250px;
  height: 25px;
  padding: 8px;  
  margin: 5px;
  background-color: #eee;


  font-size: ${({ theme }) => theme.fontSizes.standard};

  border: 1px solid ${({ theme }) => theme.colors.main};
  border-radius: ${({ theme }) => theme.radius.buttons};
  &.invalidInput {
    border: 1px solid red;
  }
`

export const FilterLabel = styled.label`
position: absolute;
  pointer-events: none;
  left: 10px;
  top: -15px;
  font-size: 12px;
  color: #aaa;
  transition: all 0.3s ease;
`

export const StyledInput = styled.input<{ isValid?: boolean }>`
  width: 150px;
  padding: 8px;
  border: 1.5px solid;
  border-color: ${({ theme, isValid }) =>
        isValid ? theme.colors.main : "red"};
  border-radius: ${({ theme }) => theme.radius.buttons};
  font-size: ${({ theme }) => theme.fontSizes.standard};
  margin: 5px;
`;
