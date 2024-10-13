package com.example.smarthome.service.PKA_devices;

import com.example.smarthome.DTO.Devices.NewDeviceDTO;
import com.example.smarthome.model.PKA_devices.AirConditioning;
import com.example.smarthome.repository.DeviceRepository;
import com.example.smarthome.repository.PKA_devices.AirConditioningRepository;
import com.example.smarthome.repository.RealEstateRepository;
import com.example.smarthome.service.DeviceActionService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AirConditioningService {
    private final RealEstateRepository realEstateRepository;
    private final DeviceRepository deviceRepository;
    private final AirConditioningRepository airConditioningRepository;
    private final DeviceActionService deviceActionService;

    public AirConditioning addAirConditioning(NewDeviceDTO newDeviceDTO){
        AirConditioning airConditioning = new AirConditioning();
        airConditioning.setName(newDeviceDTO.getName());
        airConditioning.setType(newDeviceDTO.getType());
        airConditioning.setPicture(newDeviceDTO.getPicture());
        airConditioning.setVariant(newDeviceDTO.getVariant());
        airConditioning.setIsOnline(false);
        airConditioning.setIsOn(false);
        airConditioning.setPowerStrenght(newDeviceDTO.getPowerStrenght());
        airConditioning.setRealEstate(realEstateRepository.findOneById(newDeviceDTO.getRealEstateId()));
        airConditioning.setMinTemperature(newDeviceDTO.getMinTemperature());
        airConditioning.setMaxTemperature(newDeviceDTO.getMaxTemperature());
        airConditioning.setModes(newDeviceDTO.getModes());
        airConditioning.setCurrentTemperature(airConditioning.getMinTemperature());
        airConditioning.setCurrentMode(airConditioning.getModes().get(0));
        deviceRepository.save(airConditioning);
//        airConditioningRepository.save(airConditioning);


        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetails userDetails = (UserDetails) auth.getPrincipal();

        String actionName = airConditioning.getName() + " created.";
        deviceActionService.createAction(airConditioning, actionName, userDetails.getUsername());

        return airConditioning;
    }


    public AirConditioning findById(Integer id){
        return airConditioningRepository.findOneById(id);
    }
}
