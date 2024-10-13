import styled from "styled-components";


export const StyledTable = styled.table`
  margin: 10px;
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    border: 1px solid #a1cdca;
    padding: 8px;
  }

  th {
    background-color: ${({ theme }) => theme.colors.secondColor};
    text-align: center;
    color: ${({ theme }) => theme.colors.main};
    
  }
  
  tr{
    :hover{
      cursor: pointer;
    }
  }

  tr:nth-child(even) {background-color: rgb(209, 211, 211);}
`;

export const ScrollableContainer = styled.div`
    height: auto;  // Adjust the height as needed
    overflow-y: auto; // Enables scrolling
    overflow-x: hidden;
    width:100%;
`;

export const StyledPagination = styled.div`
    padding: 20px;
`;
export const TableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center ;
`;