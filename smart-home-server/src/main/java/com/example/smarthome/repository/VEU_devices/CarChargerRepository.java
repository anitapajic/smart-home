package com.example.smarthome.repository.VEU_devices;

import com.example.smarthome.DTO.Devices.VEU_devices.ChargingVehicleDTO;
import com.example.smarthome.model.VEU_devices.CarCharger;
import com.example.smarthome.model.VEU_devices.ChargingSession;
import com.example.smarthome.model.VEU_devices.ChargingVehicle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CarChargerRepository extends JpaRepository<CarCharger, Long> {


}
