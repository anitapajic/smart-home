
import styled from 'styled-components';

export const DayButton = styled.button`
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #b4e854;
    color: white;
    border: none;
    margin: 0;
    margin-left:3px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #263d3d;
    }

    &.active {
        background-color: #263d3d;
    }
`;
export const StyledButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-left:20px
`;

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 8px;
  border: 2px solid #b4e854;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #263d3d;
    color:white;
  }

  &.active {
    background-color: #263d3d;
    color:white;
  }
`;