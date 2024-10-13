import { ReactNode, RefAttributes, forwardRef } from "react";
import { ContactInfo, SocialIcons, StyledFooter } from "./Footer.styled";

export type FooterProps = {
  icons: {
    href: string;
    icon: ReactNode;
  }[];
  infoItems: {
    label: string;
    value: string;
  }[];
};

const Footer = forwardRef<
  HTMLDivElement,
  FooterProps & RefAttributes<HTMLDivElement>
>(({ icons, infoItems }, ref) => {
  return (
    <StyledFooter ref={ref}>
      <SocialIcons>
        {icons.map((iconLink) => (
          <a href={iconLink.href} key={iconLink.href}>
            {iconLink.icon}
          </a>
        ))}
      </SocialIcons>
      <ContactInfo>
        {infoItems.map((infoItem) => (
          <p key={infoItem.label}>{`${infoItem.label}: ${infoItem.value}`}</p>
        ))}
      </ContactInfo>
    </StyledFooter>
  );
});
export default Footer;
