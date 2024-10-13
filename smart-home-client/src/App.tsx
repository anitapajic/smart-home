import React, { useRef, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { UserProvider } from './utils/UserContext/userContext';
import MyRoutes from "./utils/routes";
import { BrowserRouter as Router } from "react-router-dom";
import { LoginUser } from './models/User';
import Navbar from './components/shared/navbar/Navbar';
import { ToastContainer } from 'react-toastify';
import Footer from './components/shared/footer/Footer';
import { AppContainer, ContentContainer } from './App.styled';
import { icons, infoItems, menuOptions, navbarTitle, theme } from './utils/data';
import { ThemeProvider } from 'styled-components';
import { MantineProvider } from "@mantine/core";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faArrowRight, faMapMarkerAlt, faBuilding, faArrowDown, faArrowUp, faMedal, faShieldAlt, faHourglass } from '@fortawesome/free-solid-svg-icons';






function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [user, setUser] = useState<LoginUser | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const footerRef = useRef(null);

  const determineRole = (user: LoginUser | null): string => {
    if (!user) return "guest";
    return user.role;
  };

  const role = determineRole(user);
  const filterMenuOptions = (userRole: string) => {
    switch (userRole) {
      case "USER":
        return menuOptions.filter((option) =>
          option.role === "user" || option.role === "logged" || option.role === "all"
        );
      case "ADMIN":
        return menuOptions.filter((option) =>
          option.role === "admin" || option.role === "logged" || option.role === "all"
        );
      case "SUPERADMIN":
        return menuOptions.filter((option) =>
          option.role === "superadmin" || option.role === "logged" || option.role === "admin" || option.role === "all"
        );
      default:
        return menuOptions.filter((option) =>
          option.role === "guest" || option.role === "all"
        );
    }
  };

  const finalOptions = filterMenuOptions(role)

  return (
    <UserProvider value={{ user, setUser }}>
      <ThemeProvider theme={theme}>
        <MantineProvider>
          <Router>
            <AppContainer className="App">
              <Navbar
                footerRef={footerRef}
                title={navbarTitle}
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
                options={finalOptions}
              />
              <ToastContainer className="toast-container" />
              <ContentContainer isMenuOpen={isMenuOpen}>
                <MyRoutes />
              </ContentContainer>
              <Footer ref={footerRef} icons={icons} infoItems={infoItems} />
            </AppContainer>
          </Router>
        </MantineProvider>
      </ThemeProvider>

    </UserProvider>
  );
}
library.add(faArrowRight, faMapMarkerAlt, faBuilding, faArrowDown, faArrowUp, faMedal, faShieldAlt, faHourglass);
export default App;
