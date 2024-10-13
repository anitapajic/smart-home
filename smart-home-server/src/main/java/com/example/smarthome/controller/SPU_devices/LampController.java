package com.example.smarthome.controller.SPU_devices;

import com.example.smarthome.model.SPU_devices.Lamp;
import com.example.smarthome.service.SPU_devices.LampService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(value = "*")
@RestController
@RequestMapping(value = "api/devices/spu/lamp")
@RequiredArgsConstructor
public class LampController {
    private final LampService lampService;

    @PreAuthorize("hasAnyAuthority('USER')")
    @GetMapping
    public ResponseEntity getAllLamps(){
        try{
            List<Lamp> lamps = lampService.getAllLamps();
            return new ResponseEntity<>(lamps, HttpStatus.OK);
        }
        catch(Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    @PreAuthorize("hasAnyAuthority('USER')")
    @GetMapping(value = "/{id}")
    public ResponseEntity getLampById(@PathVariable Long id){
        try{
            Lamp lamp = lampService.getLampById(id);
            return new ResponseEntity<>(lamp, HttpStatus.OK);
        }
        catch(Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PreAuthorize("hasAnyAuthority('USER')")
    @GetMapping(value = "/switch/{id}")
    public ResponseEntity switchStateOfLamp(@PathVariable Long id){
        try{
            Lamp lamp = lampService.switchLamp(id);
            return new ResponseEntity<>(lamp, HttpStatus.OK);
        }
        catch(Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PreAuthorize("hasAnyAuthority('USER')")
    @GetMapping(value = "/switchMode/{id}")
    public ResponseEntity switchStateOfLampMode(@PathVariable Long id){
        try{
            Lamp lamp = lampService.switchLampMode(id);
            return new ResponseEntity<>(lamp, HttpStatus.OK);
        }
        catch(Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
