import { toast } from "react-toastify";
import { CenteredToast } from "./CustomToast.styled";

interface CustomToastProps {
  message: string;
}

export const CustomToast: React.FC<CustomToastProps> = ({ message }) => {
  return <CenteredToast>{message}</CenteredToast>;
};
export const showToast = (message: string) => {
  toast(<CustomToast message={message} />, {
    position: "top-center",
    autoClose: 2000,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};
