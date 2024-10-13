package com.example.smarthome.controller.SPU_devices;

import com.example.smarthome.model.SPU_devices.Gate;
import com.example.smarthome.model.SPU_devices.Lamp;
import com.example.smarthome.service.SPU_devices.GateService;
import com.example.smarthome.service.SPU_devices.LampService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(value = "*")
@RestController
@RequestMapping(value = "api/devices/spu/gate")
@RequiredArgsConstructor
public class GateController {

    private final GateService gateService;

    @PreAuthorize("hasAnyAuthority('USER')")
    @GetMapping(value = "/switch/{id}")
    public ResponseEntity switchStateOfGate(@PathVariable Long id){
        try{
            Gate gate = gateService.switchGate(id);
            return new ResponseEntity<>(gate, HttpStatus.OK);
        }
        catch(Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PreAuthorize("hasAnyAuthority('USER')")
    @GetMapping(value = "/switchMode/{id}")
    public ResponseEntity switchStateOfGateMode(@PathVariable Long id){
        try{
            Gate gate = gateService.switchGateMode(id);
            return new ResponseEntity<>(gate, HttpStatus.OK);
        }
        catch(Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

}
