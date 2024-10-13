import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ButtonHTMLAttributes } from "react";
import { ButtonStyled } from "./IconButton.styled";


export type ButtonProps = {
    icon?: IconProp;
    iconColor?: string
} & ButtonHTMLAttributes<HTMLButtonElement>;
export default function IconButton({ icon, iconColor, ...rest }: ButtonProps) {
    return (
        <ButtonStyled {...rest}>
            {icon && (
                <FontAwesomeIcon icon={icon} size="1x" style={{ color: iconColor }} />
            )}

        </ButtonStyled>
    )
}