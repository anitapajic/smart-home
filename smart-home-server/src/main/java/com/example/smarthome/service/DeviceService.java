package com.example.smarthome.service;

import com.example.smarthome.DTO.Devices.*;
import com.example.smarthome.DTO.MQTT.models.DeviceStateMessage;
import com.example.smarthome.model.Device;
import com.example.smarthome.model.PKA_devices.WashingMachine;
import com.example.smarthome.model.RealEstate;
import com.example.smarthome.model.VEU_devices.EnergyTransaction;
import com.example.smarthome.model.VEU_devices.HomeBattery;
import com.example.smarthome.model.VEU_devices.SolarPanel;
import com.example.smarthome.model.VEU_devices.SolarPanelSystem;
import com.example.smarthome.model.enums.DeviceVariant;
import com.example.smarthome.model.enums.RealEstateStatus;
import com.example.smarthome.model.PKA_devices.AirConditioning;
import com.example.smarthome.repository.DeviceRepository;
import com.example.smarthome.repository.RealEstateRepository;
import com.example.smarthome.service.PKA_devices.AirConditioningService;
import com.example.smarthome.service.PKA_devices.THSensorService;
import com.example.smarthome.service.PKA_devices.WashingMachineService;
import com.example.smarthome.service.SPU_devices.GateService;
import com.example.smarthome.service.SPU_devices.LampService;
import com.example.smarthome.service.SPU_devices.SprinklerService;
import com.example.smarthome.service.VEU_devices.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.RequiredArgsConstructor;
import org.eclipse.paho.mqttv5.client.IMqttClient;
import org.eclipse.paho.mqttv5.common.MqttException;
import org.eclipse.paho.mqttv5.common.MqttMessage;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DeviceService {
    private final DeviceRepository deviceRepository;
    private final LampService lampService;
    private final GateService gateService;
    private final SprinklerService sprinklerService;
    private final AirConditioningService airConditioningService;
    private final WashingMachineService washingMachineService;
    private final THSensorService thSensorService;
    private final SolarPanelSystemService solarPanelSystemService;
    private final SolarPanelService solarPanelService;
    private final HomeBatteryService homeBatteryService;
    private final CarChargerService carChargerService;
    private final RealEstateRepository realEstateRepository;
    private final EnergyTransactionService energyTransactionService;
    private final DeviceActionService deviceActionService;
    private final IMqttClient mqttClient;
    private static final ObjectWriter objectWriter;

    static {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
        objectWriter = mapper.writer().withDefaultPrettyPrinter();
    }
    public Device addSpecificDevice(NewDeviceDTO newDeviceDTO) throws MqttException, JsonProcessingException {



        switch (newDeviceDTO.getVariant()) {
            case LAMP -> {
                return lampService.addLamp(newDeviceDTO);
            }
            case GATE -> {
                return gateService.addGate(newDeviceDTO);
            }
            case SPRINKLER -> {
                return sprinklerService.addSprinkler(newDeviceDTO);
            }
            case TH_SENSOR -> {
                return thSensorService.addTHSensor(newDeviceDTO);
            }
            case WASHING_MACHINE -> {
                return washingMachineService.addWashingMachine(newDeviceDTO);
            }
            case AIR_CONDITIONING -> {
                return airConditioningService.addAirConditioning(newDeviceDTO);
            }
            case SOLAR_PANELS -> {
                SolarPanelSystem newSystem = solarPanelSystemService.addSolarPanelSystem(newDeviceDTO);
                try{
                    SolarPanelSystemDTO newDevice = new SolarPanelSystemDTO(newSystem);
                    List<SolarPanel> solarPanels = solarPanelService.findAllBySystemId(newSystem.getId());
                    newDevice.setSolarPanels(solarPanels);
                    String message = objectWriter.writeValueAsString(newDevice);
                    mqttClient.publish("newSolarPanelSystem", new MqttMessage(message.getBytes()));
                }  catch(Exception e){
                    throw e;
                }
                return newSystem;
            }
            case HOME_BATTERY -> {
                return homeBatteryService.addHomeBattery(newDeviceDTO);
            }
            case CAR_CHARGER -> {
                return carChargerService.addCarCharger(newDeviceDTO);
            }
        }
        return null;
    }

    public List<Device> getAllDevicesOfRealEstate(Integer realEstateId){
        return deviceRepository.findAllByRealEstateId(realEstateId);
    }

    public List<SimulationDeviceDTO> getAllDevices(){
        List<SimulationDeviceDTO> devicesDTO = new ArrayList<>();

        List<Device> devices = deviceRepository.findAll();
        for ( Device device : devices){
            devicesDTO.add(new SimulationDeviceDTO(device));
        }
        return devicesDTO;
    }

    public List<SolarPanelSystemDTO> getAllSolarPanelSystems(){
        return solarPanelSystemService.findAll();
    }

    public Device getDeviceById(Integer id){
        return deviceRepository.findById(Long.valueOf(id)).orElse(null);
    }

    public Device switchIsOnById(Integer id, String username){
        Device device = this.getDeviceById(id);
        device.setOnOff(!device.getOnOff());
        deviceRepository.save(device);
        if (device.getVariant().equals(DeviceVariant.SOLAR_PANELS)){
            solarPanelSystemService.turnOnOffSolarPanelSystem(device.getId(), username);
        }
        return device;
    }
    public Device switchIsOnlineDevice(Long id){
        Device device = deviceRepository.findById(id).orElse(null);
        if(device != null) {
            device.setIsOnline(!device.getIsOnline());
            deviceRepository.save(device);
        }
        return device;
    }

    @Scheduled(fixedRate = 1000)
    public void distributeEnergyToAllRealEstates() {
        List<RealEstate> allRealEstates = realEstateRepository.findAllByStatus(RealEstateStatus.ACCEPTED);
        allRealEstates.forEach(this::distributeEnergyForRealEstate);
    }

    private void distributeEnergyForRealEstate(RealEstate realEstate) {
        boolean hasSolarPanels = deviceRepository.existsByRealEstateIdAndVariant(realEstate.getId(), DeviceVariant.SOLAR_PANELS);
        boolean hasHomeBatteries = !homeBatteryService.findAllByBusyness(realEstate.getId()).isEmpty();

        if (hasSolarPanels && hasHomeBatteries) {
            List<DeviceVariant> excludedTypes = Arrays.asList(DeviceVariant.SOLAR_PANELS, DeviceVariant.HOME_BATTERY);
            List<Device> onlineDevices = deviceRepository.findAllByRealEstateIdAndIsOnlineAndVariantNotIn(realEstate.getId(), true, excludedTypes);
            List<HomeBattery> homeBatteries = homeBatteryService.findAllByBusyness(realEstate.getId());
            if(!onlineDevices.isEmpty()) {
                for (Device device : onlineDevices) {
                    double powerNeeded = device.getPowerStrenght() / 360000;
                    while (powerNeeded > 0 && !homeBatteries.isEmpty()) {
                        for (Iterator<HomeBattery> it = homeBatteries.iterator(); it.hasNext(); ) {
                            HomeBattery battery = it.next();
                            double availableEnergy = battery.getEnergyFromPanels();
                            double energyToTake = Math.min(powerNeeded, availableEnergy);
                            battery.setEnergyFromPanels(availableEnergy - energyToTake);
                            powerNeeded -= energyToTake;
                            if (battery.getEnergyFromPanels() <= 0) {
                                it.remove(); // Uklanjanje prazne baterije iz liste
                            }
                            if (powerNeeded <= 0) {
                                break;
                            }
                        }
                    }
                    if (powerNeeded > 0) {
                        EnergyTransaction energyTransaction = new EnergyTransaction();
                        energyTransaction.setRealEstate(realEstate);
                        energyTransaction.setFromGrid(powerNeeded);
                        energyTransaction.setTimestamp(LocalDateTime.now());
                        energyTransaction.setToGrid(0.0);
                        energyTransactionService.save(energyTransaction);
                    }
                }
                homeBatteryService.saveAll(homeBatteries);
            }
        }
    }
    public void setACValue(AirConditionerDTO acDTO){
         AirConditioning device =(AirConditioning) deviceRepository.findById(acDTO.getId()).orElse(null);
         if(device != null){
             device.setValue(acDTO);
             deviceRepository.save(device);

             Authentication auth = SecurityContextHolder.getContext().getAuthentication();
             UserDetails userDetails = (UserDetails) auth.getPrincipal();
             String actionName = String.format("%s turned on - mode :  %s and temperature : %s", device.getName(), device.getCurrentMode(), device.getCurrentTemperature());

             if(!acDTO.getIsOn()){
                 actionName = String.format("%s turned off", device.getName());
             }
             deviceActionService.createAction(device, actionName, userDetails.getUsername());

         }

    }

    public void setWMValue(WashingMachineDTO wmDTO){
        WashingMachine device =(WashingMachine) deviceRepository.findById(wmDTO.getId()).orElse(null);
        if(device != null){
            device.setValue(wmDTO);
            deviceRepository.save(device);

            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            UserDetails userDetails = (UserDetails) auth.getPrincipal();
            String actionName = String.format("%s turned on - mode :  %s %s°C", device.getName(), device.getWmcurrentMode().getName(), device.getWmcurrentMode().getTemperature());

            if(!wmDTO.getIsOn()){
                actionName = String.format("%s turned off", device.getName());
            }
            deviceActionService.createAction(device, actionName, userDetails.getUsername());

        }

    }


}




