package com.example.smarthome.service.PKA_devices;

import com.example.smarthome.DTO.Devices.NewDeviceDTO;
import com.example.smarthome.model.PKA_devices.WMMode;
import com.example.smarthome.model.PKA_devices.WashingMachine;
import com.example.smarthome.repository.DeviceRepository;
import com.example.smarthome.repository.PKA_devices.WMModeRepository;
import com.example.smarthome.repository.RealEstateRepository;
import com.example.smarthome.service.DeviceActionService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WashingMachineService {
    private final RealEstateRepository realEstateRepository;
    private final WMModeRepository wmModeRepository;
    private final DeviceRepository deviceRepository;
    private final DeviceActionService deviceActionService;
    public WashingMachine addWashingMachine(NewDeviceDTO newDeviceDTO){
        WashingMachine washingMachine = new WashingMachine();
        washingMachine.setName(newDeviceDTO.getName());
        washingMachine.setType(newDeviceDTO.getType());
        washingMachine.setPicture(newDeviceDTO.getPicture());
        washingMachine.setVariant(newDeviceDTO.getVariant());
        washingMachine.setIsOnline(false);
        washingMachine.setIsOn(false);
        washingMachine.setPowerStrenght(newDeviceDTO.getPowerStrenght());
        washingMachine.setRealEstate(realEstateRepository.findOneById(newDeviceDTO.getRealEstateId()));
        List<WMMode> newModes = new ArrayList<>();

        for( WMMode mode : newDeviceDTO.getWmmodes()){
            WMMode newMode = wmModeRepository.save(mode);
            newModes.add(newMode);
        }
        washingMachine.setWmmodes(newModes);
        washingMachine.setWmcurrentMode(newModes.get(0));
        deviceRepository.save(washingMachine);

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetails userDetails = (UserDetails) auth.getPrincipal();

        String actionName = washingMachine.getName() + " created.";
        deviceActionService.createAction(washingMachine, actionName, userDetails.getUsername());


        return washingMachine;

    }
}
