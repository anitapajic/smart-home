package com.example.smarthome.controller.PKA_devices;

import com.example.smarthome.DTO.Devices.ACAutoDTO;
import com.example.smarthome.DTO.Devices.AirConditionerDTO;
import com.example.smarthome.DTO.MQTT.models.DeviceStateMessage;
import com.example.smarthome.model.Device;
import com.example.smarthome.model.PKA_devices.AirConditioning;
import com.example.smarthome.model.PKA_devices.AirConditioningAuto;
import com.example.smarthome.model.VEU_devices.SolarPanelSystem;
import com.example.smarthome.service.DeviceService;
import com.example.smarthome.service.PKA_devices.ACAutoModeService;
import com.example.smarthome.service.PKA_devices.AirConditioningService;
import com.example.smarthome.service.UserService;
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

@CrossOrigin(value = "*")
@RestController
@RequestMapping(value = "api/devices/pka/ac")
@RequiredArgsConstructor
public class AirConditioningController {
    private final DeviceService deviceService;
    private final ACAutoModeService autoModeService;

    @PreAuthorize("hasAnyAuthority('USER')")
    @PostMapping(value = "")
    public ResponseEntity setACMode(@RequestBody AirConditionerDTO acDTO) {
        try {
            deviceService.setACValue(acDTO);
            return new ResponseEntity<>("", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }


    @PreAuthorize("hasAnyAuthority('USER')")
    @PostMapping(value = "/create")
    public ResponseEntity createACAutoMode(@RequestBody ACAutoDTO autoDTO) {
        try {
            AirConditioningAuto newMode = autoModeService.createAutoMode(autoDTO);
            return new ResponseEntity<>(newMode, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PreAuthorize("hasAnyAuthority('USER')")
    @PostMapping(value = "/delete/{id}")
    public ResponseEntity deleteACAutoMode(@PathVariable Integer id) {
        try {
            autoModeService.stopAutoMode(id);
            return new ResponseEntity<>("Deleted", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }


}
