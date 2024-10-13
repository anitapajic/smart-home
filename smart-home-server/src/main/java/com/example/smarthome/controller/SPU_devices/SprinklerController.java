package com.example.smarthome.controller.SPU_devices;

import com.example.smarthome.DTO.Devices.ACAutoDTO;
import com.example.smarthome.DTO.Devices.SPU_devices.SprinklerAutoDTO;
import com.example.smarthome.model.PKA_devices.AirConditioningAuto;
import com.example.smarthome.model.SPU_devices.Gate;
import com.example.smarthome.model.SPU_devices.Sprinkler;
import com.example.smarthome.model.SPU_devices.SprinklerAuto;
import com.example.smarthome.service.PKA_devices.ACAutoModeService;
import com.example.smarthome.service.SPU_devices.GateService;
import com.example.smarthome.service.SPU_devices.SprinklerAutoModeService;
import com.example.smarthome.service.SPU_devices.SprinklerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


@CrossOrigin(value = "*")
@RestController
@RequestMapping(value = "api/devices/spu/sprinkler")
@RequiredArgsConstructor
public class SprinklerController {

    private final SprinklerService sprinklerService;

    private final SprinklerAutoModeService sprinklerAutoModeService;

    @PreAuthorize("hasAnyAuthority('USER')")
    @GetMapping(value = "/switch/{id}")
    public ResponseEntity switchStateOfSprinkler(@PathVariable Long id){
        try{
            Sprinkler sprinkler = sprinklerService.switchSprinkler(id);
            return new ResponseEntity<>(sprinkler, HttpStatus.OK);
        }
        catch(Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PreAuthorize("hasAnyAuthority('USER')")
    @GetMapping(value = "/switchMode/{id}")
    public ResponseEntity switchSprinklerMode(@PathVariable Long id){
        try{
            Sprinkler sprinkler = sprinklerService.switchSprinklerMode(id);
            return new ResponseEntity<>(sprinkler, HttpStatus.OK);
        }
        catch(Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    @PreAuthorize("hasAnyAuthority('USER')")
    @PostMapping(value = "/create")
    public ResponseEntity createACAutoMode(@RequestBody SprinklerAutoDTO autoDTO) {
        try {
            //AirConditioningAuto newMode = autoModeService.createAutoMode(autoDTO);
            SprinklerAuto newMode = sprinklerAutoModeService.createAutoMode(autoDTO);
            return new ResponseEntity<>(newMode, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PreAuthorize("hasAnyAuthority('USER')")
    @PostMapping(value = "/delete/{id}")
    public ResponseEntity deleteSprinklerAutoMode(@PathVariable Integer id) {
        try {
            sprinklerAutoModeService.stopAutoMode(id);
            return new ResponseEntity<>("Deleted", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }



}
