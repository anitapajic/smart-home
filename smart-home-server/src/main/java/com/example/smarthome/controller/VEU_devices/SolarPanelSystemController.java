package com.example.smarthome.controller.VEU_devices;

import com.example.smarthome.DTO.MQTT.models.DeviceStateMessage;
import com.example.smarthome.model.VEU_devices.SolarPanelSystem;
import com.example.smarthome.service.UserService;
import com.example.smarthome.service.VEU_devices.SolarPanelSystemService;
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


@CrossOrigin(value="*")
@RestController
@RequestMapping(value = "/api/devices/veu/solarPanels")
@RequiredArgsConstructor
public class SolarPanelSystemController {

    private final SolarPanelSystemService solarPanelSystemService;
    private final IMqttClient mqttClient;
    private static final ObjectWriter objectWriter;
    private final UserService userService;

    static {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
        objectWriter = mapper.writer().withDefaultPrettyPrinter();
    }
//    @PreAuthorize("hasAnyAuthority('USER')")
//    @GetMapping(value = "/switch/{systemId}")
//    public ResponseEntity switchIsOnDevice(@PathVariable Integer systemId){
//        try{
//            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
//            UserDetails userDetails = (UserDetails) auth.getPrincipal();
//            SolarPanelSystem system = solarPanelSystemService.findById(systemId);
//            DeviceStateMessage isOnMessage = new DeviceStateMessage(Long.valueOf(systemId), system.getName(), system.getIsOn(), LocalDateTime.now(), false, userDetails.getUsername());
//            String message = objectWriter.writeValueAsString(isOnMessage);
//            mqttClient.publish(String.format("%d/switchIsOn", system.getRealEstate().getId()), new MqttMessage(message.getBytes()));
//            return new ResponseEntity<>(HttpStatus.OK);
//        }
//        catch(Exception e){
//            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
//        }
//    }



}
