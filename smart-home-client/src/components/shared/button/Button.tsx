import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from "react";
import { ButtonStyled } from "./Button.styled";


export type ButtonProps = {
    icon?: IconProp;
    text: string
    onClickHandler?: (event?: any) => void;
}
export default function Button({ icon, text, onClickHandler }: ButtonProps) {
    return (
        <ButtonStyled onClick={onClickHandler}>
            {icon && (
                <p><FontAwesomeIcon icon={icon} size="1x" /> {text}</p>
            )}
            
        </ButtonStyled>
    )
}