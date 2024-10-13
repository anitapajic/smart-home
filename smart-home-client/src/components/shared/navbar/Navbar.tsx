import { useContext, useState } from "react";
import {
  NavbarStyle,
  Title,
  Menu,
  MenuItem,
  MenuLink,
  Hamburger,
} from "./Navbar.styled";
import { Link } from "react-router-dom";
import UserContext from "../../../utils/UserContext/userContext";
import Modal from "../modal/Modal";
import NewAdminForm from "../../newAdmin/createNewAdmin/NewAdminForm";

export interface NavbarProps {
  title: string;
  role?: string;
  label?: string;
  isMenuOpen: boolean;
  options: { href: string; value: string }[];
  footerRef?: React.RefObject<HTMLDivElement>;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Navbar({
  title,
  isMenuOpen,
  setIsMenuOpen,
  options,
  footerRef,
}: NavbarProps) {

  const [isModalVisible, setIsModalVisible] = useState(false);

  const userContext = useContext(UserContext);
  const { setUser } = userContext!;


  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const handleAddAdminClick = () => {
    setIsModalVisible(true);

  };

  const handleContactClick = () => {
    footerRef?.current?.scrollIntoView({ behavior: "smooth" });
  };
  const handleFormCancel = () => {
    setIsModalVisible(false);
  };


  return (
    <>
      <NavbarStyle>
        <Title as={Link} to={"/"}>
          {title}
        </Title>
        <Hamburger onClick={() => setIsMenuOpen(!isMenuOpen)}>☰</Hamburger>
        <Menu isOpen={isMenuOpen}>
          {options.map((link, index) => (
            <MenuItem key={index}>
              <MenuLink
                as={Link}
                onClick={() => {
                  if (link.value === "Log Out") {
                    handleLogout();
                  }
                  if (link.value === "Contact") {
                    handleContactClick();
                  }
                  if (link.value === "Add Admin") {
                    handleAddAdminClick();
                  }
                  setIsMenuOpen(false);
                }}
                to={link.href}
              >
                {link.value}
              </MenuLink>
            </MenuItem>
          ))}
        </Menu>
      </NavbarStyle>
      <Modal isVisible={isModalVisible} onClose={handleFormCancel}>
        <NewAdminForm onSubmit={handleFormCancel}></NewAdminForm>
      </Modal>
    </>
  );
}
