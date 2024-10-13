import styled from "styled-components";

export const ChartsContainer = styled.div`
    display: flex;
    justify-content: space-between;
`;

export const ChartWithInputs = styled.div`
    flex: 1;
    margin-right: 20px; /* Adjust as needed */
`;
export const CardsWrapper = styled.div`
     display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`;
export const Name = styled.h3`
  font-size: 28px;
  font-weight: bold;
  text-align:left;
  padding-top:20px;
  padding-left: 50px;
`;

export const CardContainer = styled.div`
  border-radius: 15px;
  width: 40%;
  display: flex;
  flex-direction: column;
  position: relative;
  background-color: white;
  margin: 45px auto; /* Center the card */
  box-shadow: 10px 12px 20px rgba(0, 0, 0, 0.1); /* Add shadow */
`;
