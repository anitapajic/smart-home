package com.example.smarthome.service.VEU_devices;

import com.example.smarthome.DTO.Devices.NewDeviceDTO;
import com.example.smarthome.DTO.Devices.SimulationDeviceDTO;
import com.example.smarthome.DTO.Devices.SolarPanelSystemDTO;
import com.example.smarthome.model.VEU_devices.EnergyTransaction;
import com.example.smarthome.model.VEU_devices.HomeBattery;
import com.example.smarthome.model.VEU_devices.SolarPanel;
import com.example.smarthome.model.VEU_devices.SolarPanelSystem;
import com.example.smarthome.repository.DeviceRepository;
import com.example.smarthome.repository.RealEstateRepository;
import com.example.smarthome.repository.VEU_devices.SolarPanelSystemRepository;
import com.example.smarthome.service.DeviceActionService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.RequiredArgsConstructor;
import org.eclipse.paho.mqttv5.client.IMqttClient;
import org.eclipse.paho.mqttv5.common.MqttException;
import org.eclipse.paho.mqttv5.common.MqttMessage;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
public class SolarPanelSystemService {
    private final SolarPanelSystemRepository solarPanelSystemRepository;
    private final DeviceRepository deviceRepository;
    private final RealEstateRepository realEstateRepository;
    private final SolarPanelService solarPanelService;
    private final DeviceActionService deviceActionService;
    private final HomeBatteryService homeBatteryService;
    private final EnergyTransactionService energyTransactionService;


    public SolarPanelSystem addSolarPanelSystem(NewDeviceDTO newDeviceDTO) throws MqttException, JsonProcessingException {
        SolarPanelSystem solarPanelSystem = new SolarPanelSystem();
        solarPanelSystem.setName(newDeviceDTO.getName());
        solarPanelSystem.setType(newDeviceDTO.getType());
        solarPanelSystem.setPicture(newDeviceDTO.getPicture());
        solarPanelSystem.setVariant(newDeviceDTO.getVariant());
        solarPanelSystem.setIsOnline(false);
        solarPanelSystem.setRealEstate(realEstateRepository.findOneById(newDeviceDTO.getRealEstateId()));
        solarPanelSystem.setNumOfPanels(newDeviceDTO.getNumOfSolarPanels());
        solarPanelSystem.setIsOn(false);
        solarPanelSystem.setElectricityGenerated(0.0);
        solarPanelSystem.setTimestamp(LocalDateTime.now());
        solarPanelSystem.setSolarPanelEfficiency(newDeviceDTO.getSolarPanelEfficiency());
        solarPanelSystem.setSize(newDeviceDTO.getSizeOfOneSolarPanel());

        deviceRepository.save(solarPanelSystem);
        SolarPanelSystem savedSolarSystem = solarPanelSystemRepository.save(solarPanelSystem);

        List<SolarPanel> solarPanels = new ArrayList<>();
        for(int i = 0; i< newDeviceDTO.getNumOfSolarPanels(); i++){
            SolarPanel solarPanel = solarPanelService.addSolarPanel(savedSolarSystem);
            solarPanels.add(solarPanel);
        }
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetails userDetails = (UserDetails) auth.getPrincipal();

        String actionName = savedSolarSystem.getName() + " created.";
        deviceActionService.createAction(savedSolarSystem, actionName, userDetails.getUsername());


        return savedSolarSystem;
    }

    public SolarPanelSystem findById(Integer id){
        return solarPanelSystemRepository.findById(Long.valueOf(id)).orElse(null);
    }

    public List<SolarPanelSystemDTO> findAll(){
        List<SolarPanelSystemDTO> systemDTOs = new ArrayList<>();
        List<SolarPanelSystem> systems = solarPanelSystemRepository.findAll();
        for(SolarPanelSystem system : systems){
            SolarPanelSystemDTO systemDTO = new SolarPanelSystemDTO(system);
            List<SolarPanel> solarPanels = solarPanelService.findAllBySystemId(system.getId());
            systemDTO.setSolarPanels(solarPanels);
            systemDTOs.add(systemDTO);
        }
        return systemDTOs;
    }

    public void turnOnOffSolarPanelSystem(Integer systemId, String username){
        try{
            solarPanelSystemRepository.findById(Long.valueOf(systemId)).ifPresent(system -> {
//                system.setIsOn(!system.getIsOn());
                SolarPanelSystem solarPanelSystem = solarPanelSystemRepository.save(system);
                String actionName;
                if(solarPanelSystem.getIsOn()) {
                    actionName = solarPanelSystem.getName() + " turned on.";
                }
                else{
                    actionName = solarPanelSystem.getName() + " turned off.";
                }
                deviceActionService.createAction(solarPanelSystem, actionName, username);
            });
            List<SolarPanel> solarPanels = solarPanelService.findAllBySystemId(systemId);
            for (SolarPanel solarPanel : solarPanels){
                solarPanel.setIsOn(!solarPanel.getIsOn());
                solarPanelService.save(solarPanel);
            }
        }
        catch (Exception e){
            System.out.println(e);
        }
    }

    public void giveEnergyToBatteries(Double energy, Integer realEstateId) {
        List<HomeBattery> homeBatteries = homeBatteryService.findAllByBusyness(realEstateId);

        List<HomeBattery> lowCapacityBatteries = homeBatteries.stream()
                .filter(battery -> battery.getEnergyFromPanels() < 2).toList();

        if (!lowCapacityBatteries.isEmpty()) {
            double energyPerBattery = energy / lowCapacityBatteries.size();
            for (HomeBattery battery : lowCapacityBatteries) {
                double availableCapacity = battery.getCapacity() - battery.getEnergyFromPanels();
                double energyToGive = Math.min(availableCapacity, energyPerBattery);
                battery.setEnergyFromPanels(battery.getEnergyFromPanels() + energyToGive);
                energy -= energyToGive;
            }
        }

        if (energy > 0) {
            double energyPerBattery = energy / homeBatteries.size();
            for (HomeBattery battery : homeBatteries) {
                double availableCapacity = battery.getCapacity() - battery.getEnergyFromPanels();
                double energyToGive = Math.min(availableCapacity, energyPerBattery);
                battery.setEnergyFromPanels(battery.getEnergyFromPanels() + energyToGive);
                energy -= energyToGive;
            }
        }

        homeBatteryService.saveAll(homeBatteries);
        // Visak ide u elektrodistribuciju
        if (energy > 0){
            EnergyTransaction energyTransaction = new EnergyTransaction();
            energyTransaction.setTimestamp(LocalDateTime.now());
            energyTransaction.setToGrid(energy);
            energyTransaction.setFromGrid(0.0);
            energyTransaction.setRealEstate(realEstateRepository.findOneById(realEstateId));
            energyTransactionService.save(energyTransaction);
        }
    }

}
