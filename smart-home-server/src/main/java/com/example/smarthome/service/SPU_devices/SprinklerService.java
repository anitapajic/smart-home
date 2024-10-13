package com.example.smarthome.service.SPU_devices;

import com.example.smarthome.DTO.Devices.NewDeviceDTO;
import com.example.smarthome.model.SPU_devices.Gate;
import com.example.smarthome.model.SPU_devices.Sprinkler;
import com.example.smarthome.repository.DeviceRepository;
import com.example.smarthome.repository.RealEstateRepository;
import com.example.smarthome.repository.SPU_devices.SprinklerRepository;
import com.example.smarthome.service.DeviceActionService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class SprinklerService {

    private final RealEstateRepository realEstateRepository;
    private final DeviceRepository deviceRepository;
    private final SprinklerRepository sprinklerRepository;
    private final DeviceActionService deviceActionService;

    public Sprinkler addSprinkler(NewDeviceDTO newDeviceDTO){
        Sprinkler sprinkler = new Sprinkler();
        String actionName;

        sprinkler.setName(newDeviceDTO.getName());
        sprinkler.setType(newDeviceDTO.getType());
        sprinkler.setPicture(newDeviceDTO.getPicture());
        sprinkler.setVariant(newDeviceDTO.getVariant());
        sprinkler.setIsOnline(false);
        sprinkler.setIsSprinklerOn(false);
        sprinkler.setSprinklerMode(true);
        sprinkler.setPowerStrenght(newDeviceDTO.getPowerStrenght());
        sprinkler.setRealEstate(realEstateRepository.findOneById(newDeviceDTO.getRealEstateId()));

        deviceRepository.save(sprinkler);
        sprinkler = sprinklerRepository.save(sprinkler);

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetails userDetails = (UserDetails) auth.getPrincipal();

        actionName = sprinkler.getName() + " created.";
        deviceActionService.createAction(sprinkler, actionName,userDetails.getUsername());
        return sprinkler;
    }

    public Sprinkler switchSprinkler(Long id) {
        String actionName;
        Sprinkler sprinkler = sprinklerRepository.findById(id).orElse(null);
        if(sprinkler!=null){
            sprinkler.setIsSprinklerOn(!sprinkler.getIsSprinklerOn());
            Sprinkler savedSprinkler = sprinklerRepository.save(sprinkler);

            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            UserDetails userDetails = (UserDetails) auth.getPrincipal();
            if(savedSprinkler.getIsSprinklerOn()) {
                actionName = savedSprinkler.getName() + " ON.";
            }
            else{
                actionName = savedSprinkler.getName() + " OFF.";
            }

            deviceActionService.createAction(savedSprinkler, actionName,userDetails.getUsername());
        }

        return sprinkler;
    }

    public Sprinkler switchSprinklerMode(Long id) {
        String actionName;
        Sprinkler sprinkler = sprinklerRepository.findById(id).orElse(null);
        if(sprinkler!=null){
            sprinkler.setSprinklerMode(!sprinkler.getSprinklerMode());
            Sprinkler savedSprinkler = sprinklerRepository.save(sprinkler);

            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            UserDetails userDetails = (UserDetails) auth.getPrincipal();
            if(savedSprinkler.getSprinklerMode()) {
                actionName = savedSprinkler.getName() + " automatic mode ON.";
            }
            else{
                actionName = savedSprinkler.getName() + " automatic mode OFF.";
            }

            deviceActionService.createAction(savedSprinkler, actionName,userDetails.getUsername());
        }

        return sprinkler;
    }
}
