import {
  FaFacebookF,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";


export const theme = {
  colors: {
    main: "#b4e854",
    secondColor: "#263d3d",
    textColor: "white",
    red: "#f54263",
    grey: "#f0f0f0",
  },
  radius: {
    buttons: "8px",
  },
  fontSizes: {
    standard: "14px",
    large: "16px",
    small: "12px",
    header: "30px",
  },
};

export const icons = [
  { href: "https://www.facebook.com", icon: <FaFacebookF /> },
  { href: "https://www.twitter.com", icon: <FaTwitter /> },
  { href: "https://www.instagram.com", icon: <FaInstagram /> },
  { href: "https://www.linkedin.com", icon: <FaLinkedin /> },
];

export const infoItems = [
  { label: "Email", value: "smartHome@gmail.com" },
  { label: "Phone", value: "+123456789" },
  { label: "Address", value: "Strumicka 6, Novi Sad" },
];
export const navbarTitle = "Smart Home";
  
  export const menuOptions = [
    { href: "", value: "Home", role: "guest" },
    { href: "/", value: "Home", role: "logged" },
    { href: "/user-home-page", value: "Real estates", role: "user" },
    { href: "/shared-real-estates", value: "Shared real estates", role: "user" },
    { href: "/admin-home-page", value: "Requests", role: "admin" },
    { href: "/energy-consumption", value: "Energy Consumption", role: "admin" },
    { href: "#", value: "Add Admin", role: "superadmin" },
    { href: "/login", value: "Sign In/Sign up", role: "guest" },
    { href: "/login", value: "Log Out", role: "logged" },
    { href: "#", value: "Contact", role: "all" },
  ];
  

export const specificPkaDevices = [
  "AIR CONDITIONING",
  "WASHING MACHINE",
  "TH SENSOR"
]
export const specificSpuDevices = [
  "LAMP",
  "GATE",
  "SPRINKLER"
]
export const specificVeuDevices = [
  "SOLAR PANELS",
  "HOME BATTERY",
  "CAR CHARGER"
]
