import axios from "axios";
import { useNavigate } from "react-router-dom";

const customAxios = axios.create({
  baseURL: "http://localhost:8085/api",
});

customAxios.interceptors.request.use(
  (config) => {
    const storedData = localStorage.getItem("user");
    if (storedData) {
      const userData = JSON.parse(storedData);
      if (userData && userData.token) {
        config.headers["Authorization"] = userData.token;
      }
    }
    return config;
  },
  
  (error) => {
    console.log(error, "error")

    return Promise.reject(error);
  }
);

customAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      const navigate = useNavigate();
      navigate("/login");
    }
    return Promise.reject(error);
  }
);

export default customAxios;
