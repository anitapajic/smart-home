import React, { useState } from 'react';
import {
    HomePageContainer,
    LeftSide,
    Title,
    SmallText,
    RightSide,
    CustomButton,
    StyledFontAwesomeIcon,
    InfoCardContainer,
    InfoCard,
    CircleIcon,
    SmallText2,
    Title2,
    Title3,
    StyledSmartHomeImage,
    StyledFontAwesomeIconInfo,
    StyledTitleWithLines,
    ImageContainer,
    OverlayText,
    Image2,
    Container,
    Title4,
    Description,
} from './HomePage.styled';
import { faArrowDown, faArrowUp, faMedal, faShieldAlt, faHourglass } from "@fortawesome/free-solid-svg-icons";


const HomePage = () => {
    const [showMore, setShowMore] = useState(false);


    const handleShowMore = () => {
        setShowMore(!showMore);
    };

    return (
        <>
        <HomePageContainer>
            {/* Left Side */}
            <LeftSide>
                <Title>Make Your Home Smarter</Title>
                <SmallText>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </SmallText>
                
                {showMore && (
                    <SmallText>
                        Additional text goes here. You can add more details about making homes smarter.
                    </SmallText>
                )}
                
                <CustomButton onClick={handleShowMore}>
                    {showMore ? 'Show Less' : 'Show More'}
                    <StyledFontAwesomeIcon icon={showMore ? faArrowUp : faArrowDown} />
                </CustomButton>
            </LeftSide>
            
            {/* Right Side */}
            <RightSide>
                <StyledSmartHomeImage src="/smarthome.png" alt="Smart Home" />
            </RightSide>
            </HomePageContainer>
            
            <>
                <Title3>Why Choose Us</Title3>
                <StyledTitleWithLines>benefits you get</StyledTitleWithLines>
            <InfoCardContainer>
                <InfoCard>
                    <CircleIcon>
                            <StyledFontAwesomeIconInfo icon={faMedal} />         
                    </CircleIcon>
                    <Title2>Best quality</Title2>
                    <SmallText2>Some description text here.</SmallText2>
                </InfoCard>

                {/* Card 2 */}
                <InfoCard>
                    <CircleIcon>
                            <StyledFontAwesomeIconInfo icon={faHourglass} />
                    </CircleIcon>
                    <Title2>Quick and easy</Title2>
                    <SmallText2>Some description text here.</SmallText2>
                </InfoCard>

                {/* Card 3 */}
                <InfoCard>
                    <CircleIcon>
                            <StyledFontAwesomeIconInfo icon={faShieldAlt} />
                    </CircleIcon>
                        <Title2>Warranty</Title2>
                    <SmallText2>Some description text here.</SmallText2>
                </InfoCard>
            </InfoCardContainer>
            </>
            <Container>
                <ImageContainer>
                    <Image2 src="/slikaaaa.png" alt="Your Image" />
                </ImageContainer>
                <OverlayText>
                    <Title4>What you can expect?</Title4>
                    <Description>Additional text goes here. You can add more details about making homes smarter.Additional text goes here. You can add more details about making homes smarter.Additional text goes here. You can add more details about making homes smarter.Additional text goes here. You can add more details about making homes smarter.</Description>
                </OverlayText>
            </Container>
        </>
    );
};

export default HomePage;
