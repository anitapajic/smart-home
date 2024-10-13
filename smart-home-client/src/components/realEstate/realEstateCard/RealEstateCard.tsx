import { CardContainer, InfoContainer, ImageContainer, Name, InfoLabels, StyledFontAwesomeIcon } from "./RealEstateCard.styled";
import { faCheck, faX, faCircleInfo, faRulerCombined, faBuilding, faMapMarkerAlt, faList } from "@fortawesome/free-solid-svg-icons";
import { RealEstate } from "../../../models/RealEstate";
import Button from "../../shared/button/Button";
import { ButtonContainer, PermissionButtonContainer } from "../../shared/styled/SharedStyles.styled";
import Picture from "../../shared/picture/Picture";
import { useState } from "react";
import Modal from "../../shared/modal/Modal";
import PermissionForm from "../../permission/Permission";


export type RealEstateCardProps = {
  realEstate: RealEstate;
  isAdmin: boolean;
  isPermissionVisible: boolean;
  onAccept: () => void;
  onDecline: () => void;
  onDetails: (realEstate: RealEstate) => void;
  searchInput?: string;
};



export default function RealEstateCard({
  realEstate,
  isAdmin,
  isPermissionVisible,
  onAccept,
  onDecline,
  onDetails,
  searchInput
}: RealEstateCardProps) {

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)

  const handleOnDetails = () => {
    onDetails(realEstate);
  }

  const onAddPermission = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation(); // Stop the propagation of the click event

    setIsModalVisible(true);

  }

  const handleFormCancel = () => {
    setIsModalVisible(false);
  }

  const highlightText = (text: string, search: string | undefined) => {
    if (!search?.trim()) {
      return text;
    }

    const regex = new RegExp(`(${search})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? <span key={index} style={{ backgroundColor: 'yellow' }}>{part}</span> : part
    );
  };

  return (
    <>
      <CardContainer onClick={handleOnDetails}>
        <InfoContainer>
          <Name>{highlightText(realEstate.name, searchInput)}</Name>
          <InfoLabels> <StyledFontAwesomeIcon icon={faMapMarkerAlt} /><b>Street: </b>{highlightText(realEstate.address.location, searchInput)} </InfoLabels>
          <InfoLabels> <StyledFontAwesomeIcon icon={faMapMarkerAlt} /><b>Location: </b>{highlightText(realEstate.address.city, searchInput)},{highlightText(realEstate.address.country, searchInput)} </InfoLabels>
          <InfoLabels> <StyledFontAwesomeIcon icon={faBuilding} /><b>Number of Floors: </b>{realEstate.floors}</InfoLabels>
          <InfoLabels> <StyledFontAwesomeIcon icon={faRulerCombined} /><b>Quadrature: </b>{realEstate.quadrature} m&sup2;</InfoLabels>
          {isPermissionVisible && (
            <>
              <PermissionButtonContainer >
                <Button
                  icon={faList}
                  text="Permissions"
                  onClickHandler={onAddPermission}
                />
              </PermissionButtonContainer>
            </>
          )}
        </InfoContainer>
        <ImageContainer>

          <Picture src={`http://localhost:84/images/real-estates/${realEstate.picture}`} />
        </ImageContainer>
        {isAdmin && (
          <ButtonContainer>
            <Button
              icon={faCheck}
              text="Accept"
              onClickHandler={onAccept}
            />
            <Button
              icon={faX}
              text="Decline"
              onClickHandler={onDecline}
            />
          </ButtonContainer>)

        }

      </CardContainer>

      <Modal isVisible={isModalVisible} onClose={handleFormCancel}>
        <PermissionForm realEstate={realEstate.id} />
      </Modal>
    </>
  )
}