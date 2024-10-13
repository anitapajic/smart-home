package com.example.smarthome.controller;

import com.example.smarthome.DTO.Devices.*;
import com.example.smarthome.DTO.MQTT.models.DeviceStateMessage;
import com.example.smarthome.DTO.MQTT.models.Measurement;
import com.example.smarthome.model.Device;
import com.example.smarthome.model.VEU_devices.SolarPanelSystem;
import com.example.smarthome.model.enums.DeviceVariant;
import com.example.smarthome.service.DeviceService;
import com.example.smarthome.service.InfluxDbService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.RequiredArgsConstructor;
import org.eclipse.paho.mqttv5.client.IMqttClient;
import org.eclipse.paho.mqttv5.common.MqttMessage;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(value="*")
@RestController
@RequestMapping(value = "/api/devices")
@RequiredArgsConstructor
public class DeviceController {
    private final DeviceService deviceService;
    private final InfluxDbService influxDbService;
    private final IMqttClient mqttClient;
    private static final ObjectWriter objectWriter;

    static {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
        objectWriter = mapper.writer().withDefaultPrettyPrinter();
    }
    @PreAuthorize("hasAnyAuthority('USER')")
    @PostMapping
    public ResponseEntity addDevice(@RequestBody NewDeviceDTO newDeviceDTO){
        try{
            Device savedDevice = deviceService.addSpecificDevice(newDeviceDTO);
            try{
                SimulationDeviceDTO newDevice = new SimulationDeviceDTO(savedDevice);
                String message = objectWriter.writeValueAsString(newDevice);
                mqttClient.publish("newDevice", new MqttMessage(message.getBytes()));

            }  catch(Exception e){
                throw e;
            }
            return new ResponseEntity<>(savedDevice, HttpStatus.CREATED);
        }
        catch(Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    @PreAuthorize("hasAnyAuthority('USER')")
    @GetMapping(value = "/{realEstateId}")
    public ResponseEntity getAllDevicesOfRealEstate(@PathVariable Integer realEstateId){
        try{
            List<Device> devices = deviceService.getAllDevicesOfRealEstate(realEstateId);
            return new ResponseEntity<>(devices, HttpStatus.OK);
        }
        catch(Exception e){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    @PreAuthorize("hasAnyAuthority('USER')")
    @GetMapping(value = "/switchOnline/{id}")
    public ResponseEntity switchIsOnlineDevice(@PathVariable Long id){
        try{
            Device device = deviceService.switchIsOnlineDevice(id);
            return new ResponseEntity<>(device, HttpStatus.OK);
        }
        catch(Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PreAuthorize("hasAnyAuthority('USER')")
    @GetMapping(value = "byId/{deviceId}")
    public ResponseEntity getDeviceById(@PathVariable Integer deviceId){
        try{
            Device device = deviceService.getDeviceById(deviceId);
            return new ResponseEntity<>(device, HttpStatus.OK);
        }
        catch(Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PreAuthorize("hasAnyAuthority('USER')")
    @PostMapping(value = "measurement/{deviceId}")
    public ResponseEntity getDeviceMeasurement(@PathVariable Integer deviceId, @RequestBody TimePeriodDTO timePeriod){
        try{
            List<Measurement> measurements = influxDbService.getMeasurements(timePeriod, deviceId);
            return new ResponseEntity<>(measurements, HttpStatus.OK);
        }
        catch(Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping(value = "")
    public ResponseEntity getAllDevices(){
        try{
            List<SimulationDeviceDTO> devices = deviceService.getAllDevices();
            return new ResponseEntity<>(devices, HttpStatus.OK);
        }
        catch(Exception e){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping(value = "/solarPanelSystems")
    public ResponseEntity getAllSolarPanelSystems(){
        try{
            List<SolarPanelSystemDTO> devices = deviceService.getAllSolarPanelSystems();
            return new ResponseEntity<>(devices, HttpStatus.OK);
        }
        catch(Exception e){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PreAuthorize("hasAnyAuthority('USER')")
    @GetMapping(value = "/switch/{deviceId}")
    public ResponseEntity switchIsOnDevice(@PathVariable Integer deviceId){
        try{
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            UserDetails userDetails = (UserDetails) auth.getPrincipal();
            Device device = deviceService.switchIsOnById(deviceId, userDetails.getUsername());
            DeviceStateMessage isOnMessage = new DeviceStateMessage(Long.valueOf(deviceId), device.getName(), device.getOnOff(), device.getVariant(), LocalDateTime.now(), false, userDetails.getUsername());
            String message = objectWriter.writeValueAsString(isOnMessage);
            System.out.println(message);
            mqttClient.publish("switchIsOn", new MqttMessage(message.getBytes()));
            return new ResponseEntity<>(HttpStatus.OK);
        }
        catch(Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

}
