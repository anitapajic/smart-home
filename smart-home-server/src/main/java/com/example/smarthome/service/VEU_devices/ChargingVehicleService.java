package com.example.smarthome.service.VEU_devices;

import com.example.smarthome.DTO.Devices.VEU_devices.ChargingVehicleDTO;
import com.example.smarthome.model.VEU_devices.ChargingVehicle;
import com.example.smarthome.repository.VEU_devices.ChargingVehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChargingVehicleService {
    private final ChargingVehicleRepository chargingVehicleRepository;

    public ChargingVehicle findById(Long id){
        return chargingVehicleRepository.findById(id).orElse(null);
    }

    public ChargingVehicle save(ChargingVehicle chargingVehicle){
        return chargingVehicleRepository.save(chargingVehicle);
    }
}
