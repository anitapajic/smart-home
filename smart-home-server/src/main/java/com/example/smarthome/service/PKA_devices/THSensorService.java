package com.example.smarthome.service.PKA_devices;

import com.example.smarthome.DTO.Devices.NewDeviceDTO;
import com.example.smarthome.model.PKA_devices.THSensor;
import com.example.smarthome.repository.DeviceRepository;
import com.example.smarthome.repository.PKA_devices.THSensorRepository;
import com.example.smarthome.repository.RealEstateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class THSensorService {
    private final RealEstateRepository realEstateRepository;
    private final DeviceRepository deviceRepository;
    private final THSensorRepository thSensorRepository;
    public THSensor addTHSensor(NewDeviceDTO newDeviceDTO){
        THSensor thSensor = new THSensor();
        thSensor.setName(newDeviceDTO.getName());
        thSensor.setType(newDeviceDTO.getType());
        thSensor.setPicture(newDeviceDTO.getPicture());
        thSensor.setVariant(newDeviceDTO.getVariant());
        thSensor.setIsOnline(false);
        thSensor.setPowerStrenght(newDeviceDTO.getPowerStrenght());
        thSensor.setRealEstate(realEstateRepository.findOneById(newDeviceDTO.getRealEstateId()));

        deviceRepository.save(thSensor);
        thSensorRepository.save(thSensor);
        return thSensor;
    }
}
