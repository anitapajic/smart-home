import styled from "styled-components";

export const PageStyle = styled.div`
    background-color: gray;
    margin: 0;
    padding: 0;
`
export const StyledPage = styled.div`
    h1{
        margin-top: 30px;
        margin-bottom:10px;
        color: ${({ theme }) => theme.colors.secondColor}
    }
`;
    
