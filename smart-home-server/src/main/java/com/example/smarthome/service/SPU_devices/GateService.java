package com.example.smarthome.service.SPU_devices;

import com.example.smarthome.DTO.Devices.NewDeviceDTO;
import com.example.smarthome.model.SPU_devices.Gate;
import com.example.smarthome.model.SPU_devices.Lamp;
import com.example.smarthome.repository.DeviceRepository;
import com.example.smarthome.repository.RealEstateRepository;
import com.example.smarthome.repository.SPU_devices.GateRepository;
import com.example.smarthome.service.DeviceActionService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GateService {
    private final RealEstateRepository realEstateRepository;
    private final GateRepository gateRepository;
    private final DeviceRepository deviceRepository;
    private final DeviceActionService deviceActionService;
    public Gate addGate(NewDeviceDTO newDeviceDTO){
        Gate gate = new Gate();
        gate.setName(newDeviceDTO.getName());
        gate.setType(newDeviceDTO.getType());
        gate.setPicture(newDeviceDTO.getPicture());
        gate.setVariant(newDeviceDTO.getVariant());
        gate.setIsOnline(false);
        gate.setIsGateOn(false);
        gate.setGateMode(false);
        gate.setPowerStrenght(newDeviceDTO.getPowerStrenght());
        gate.setRealEstate(realEstateRepository.findOneById(newDeviceDTO.getRealEstateId()));

        Gate savedGate = deviceRepository.save(gate);
        gateRepository.save(gate);

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetails userDetails = (UserDetails) auth.getPrincipal();

        String actionName = savedGate.getName() + " created.";
        deviceActionService.createAction(savedGate, actionName, userDetails.getUsername());
        return gate;
    }

    public Gate switchGate(Long id) {
        String actionName;
        Gate gate = gateRepository.findById(id).orElse(null);
        if(gate!=null){
            gate.setIsGateOn(!gate.getIsGateOn());
            Gate savedGate= gateRepository.save(gate);
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            UserDetails userDetails = (UserDetails) auth.getPrincipal();
            if(savedGate.getIsGateOn()) {
                actionName = savedGate.getName() + " opened.";
            }
            else{
                actionName = savedGate.getName() + " closed.";
            }

            deviceActionService.createAction(savedGate, actionName,userDetails.getUsername());
        }

        return gate;
    }

    public Gate switchGateMode(Long id) {
        Gate gate = gateRepository.findById(id).orElse(null);
        if(gate!=null){
            gate.setGateMode(!gate.getGateMode());
            gateRepository.save(gate);
        }
        return gate;
    }
}
