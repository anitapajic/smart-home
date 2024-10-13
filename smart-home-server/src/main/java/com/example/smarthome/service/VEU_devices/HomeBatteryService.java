package com.example.smarthome.service.VEU_devices;

import com.example.smarthome.DTO.Devices.NewDeviceDTO;
import com.example.smarthome.model.VEU_devices.HomeBattery;
import com.example.smarthome.repository.DeviceRepository;
import com.example.smarthome.repository.RealEstateRepository;
import com.example.smarthome.repository.VEU_devices.HomeBatteryRepository;
import com.example.smarthome.service.DeviceActionService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HomeBatteryService {
    private final RealEstateRepository realEstateRepository;
    private final DeviceRepository deviceRepository;
    private final HomeBatteryRepository homeBatteryRepository;

    private final DeviceActionService deviceActionService;

    public HomeBattery addHomeBattery(NewDeviceDTO newDeviceDTO){
        HomeBattery homeBattery = new HomeBattery();
        homeBattery.setName(newDeviceDTO.getName());
        homeBattery.setType(newDeviceDTO.getType());
        homeBattery.setPicture(newDeviceDTO.getPicture());
        homeBattery.setVariant(newDeviceDTO.getVariant());
        homeBattery.setIsOnline(false);
        homeBattery.setRealEstate(realEstateRepository.findOneById(newDeviceDTO.getRealEstateId()));
        homeBattery.setCapacity(newDeviceDTO.getHomeBatteryCapacity());
        homeBattery.setEnergyFromPanels(0.0);

        deviceRepository.save(homeBattery);
        HomeBattery savedBattery = homeBatteryRepository.save(homeBattery);

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetails userDetails = (UserDetails) auth.getPrincipal();

        String actionName = savedBattery.getName() + " created.";
        deviceActionService.createAction(savedBattery, actionName, userDetails.getUsername());


        return homeBattery;
    }

    public List<HomeBattery> findAllByBusyness(Integer realEstateId){
        return homeBatteryRepository.findByRealEstateId(realEstateId);
    }

    public void saveAll(List<HomeBattery> homeBatteries){
        homeBatteryRepository.saveAll(homeBatteries);
    }

    public void save(HomeBattery homeBattery){ homeBatteryRepository.save(homeBattery); }

}
