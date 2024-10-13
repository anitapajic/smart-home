import { ReactNode } from "react";
import { ModalOverlay, ModalContainer, CloseButton } from "./Modal.styled";

type ModalProps = {
    isVisible: boolean;
    onClose: () => void;
    children: ReactNode;
}

export default function Modal({isVisible, onClose, children} : ModalProps){
    if(!isVisible) return null;
    return (
        <ModalOverlay>
            <ModalContainer>
                <CloseButton onClick={onClose}>&times;</CloseButton>
                {children}
            </ModalContainer>
        </ModalOverlay>
    )
}