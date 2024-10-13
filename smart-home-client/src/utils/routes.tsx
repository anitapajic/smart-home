import { Routes, Route } from "react-router-dom";

import HomePage from "../pages/HomePage/HomePage";
import LoginPage from "../pages/LoginPage/LoginPage";
import UserHomePage from "../pages/UserHomePage/UserHomePage";
import NewRealEstate from "../pages/NewRealEstatePage/NewRealEstatePage";
import AdminHomePage from "../pages/AdminHomePage/AdminHomePage";
import RealEstateDevicesPage from "../pages/RealEstateDevicesPage/RealEstateDevicesPage";
import DeviceDetailsPage from "../pages/DeviceDetailsPage/DeviceDetailsPage";
import RealEstateEnergyConsumptionPage from "../pages/RealEstateEnergyConsumptionPage/RealEstateEnergyConsumptionPage";
import AdminEnergyPage from "../pages/AdminEnergyPage/AdminEnergyPage";
import EnergyConsumptionPage from "../pages/EnergyConsumptionPage/EnergyConsumptionPage";
import SharedRealEstatesPage from "../pages/SharedDevices/SharedRealEstatesPage";
import SharedDevicesPage from "../pages/SharedDevices/SharedDevicesPage";



export default function MyRoutes() {
  return (
    <Routes>
      <Route path="" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin-home-page" element={<AdminHomePage />} />
      <Route path="/user-home-page" element={<UserHomePage />} />
      <Route path="/new-real-estate" element={<NewRealEstate />} />
      <Route path="/real-estate/:id/devices" element={<RealEstateDevicesPage />} />
      <Route path="devices/:deviceId" element={<DeviceDetailsPage />} />
      <Route path="energy-consumption/:id" element={<RealEstateEnergyConsumptionPage />} />
      <Route path="energy-consumption" element={<AdminEnergyPage />} />
      <Route path="energy-consumption2/:city" element={<EnergyConsumptionPage />} />
      <Route path="shared-real-estates" element={<SharedRealEstatesPage/>} />
      <Route path="shared-real-estates/:id/devices" element={<SharedDevicesPage />} />

    </Routes>
  );
}
