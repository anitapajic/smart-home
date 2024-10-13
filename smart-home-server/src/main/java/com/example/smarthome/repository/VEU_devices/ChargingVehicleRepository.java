package com.example.smarthome.repository.VEU_devices;

import com.example.smarthome.DTO.Devices.VEU_devices.ChargingVehicleDTO;
import com.example.smarthome.model.VEU_devices.ChargingVehicle;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChargingVehicleRepository extends JpaRepository<ChargingVehicle, Long> {

    ChargingVehicle save(ChargingVehicle chargingVehicleDTO);
}
