package com.example.smarthome.service.SPU_devices;

import com.example.smarthome.DTO.Devices.NewDeviceDTO;
import com.example.smarthome.model.RealEstate;
import com.example.smarthome.model.SPU_devices.Lamp;
import com.example.smarthome.model.enums.DeviceType;
import com.example.smarthome.model.enums.DeviceVariant;
import com.example.smarthome.repository.DeviceRepository;
import com.example.smarthome.repository.RealEstateRepository;
import com.example.smarthome.repository.SPU_devices.LampRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LampService {
    private final LampRepository lampRepository;
    private final RealEstateRepository realEstateRepository;
    private final DeviceRepository deviceRepository;

    public Lamp addLamp(NewDeviceDTO newLampDTO){
        Lamp newLamp = new Lamp();
        newLamp.setName(newLampDTO.getName());
        newLamp.setTimestamp(LocalDateTime.now());
        newLamp.setLampIsOn(false);
        newLamp.setLampMode(false);
        newLamp.setPicture(newLampDTO.getPicture());
        newLamp.setBrightnessLevel(0.0);
        newLamp.setType(DeviceType.SPU);
        newLamp.setIsOnline(false);
        newLamp.setPowerStrenght(newLampDTO.getPowerStrenght());
        RealEstate realEstate = realEstateRepository.findOneById(newLampDTO.getRealEstateId());
        newLamp.setRealEstate(realEstate);
        newLamp.setVariant(DeviceVariant.LAMP);

        deviceRepository.save(newLamp);
        lampRepository.save(newLamp);

        return newLamp;
    }
    public Lamp getLampById(Long id){
        return lampRepository.findById(id).orElse(null);
    }

    public List<Lamp> getAllLamps(){
        return lampRepository.findAll();
    }

    public Lamp switchLamp(Long id){
        Lamp lamp = lampRepository.findById(id).orElse(null);
        if(lamp!=null){
            lamp.setLampIsOn(!lamp.getLampIsOn());
            lampRepository.save(lamp);
        }
        return lamp;
    }

    public Lamp switchLampMode(Long id) {
        Lamp lamp = lampRepository.findById(id).orElse(null);
        System.out.println(lamp);
        if(lamp!=null){
            lamp.setLampMode(!lamp.getLampMode());
            lampRepository.save(lamp);
        }

        return lamp;
    }
}
