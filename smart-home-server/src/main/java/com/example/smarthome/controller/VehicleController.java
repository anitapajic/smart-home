package com.example.smarthome.controller;


import com.example.smarthome.DTO.Devices.NewDeviceDTO;
import com.example.smarthome.DTO.Devices.NewVehicleDTO;
import com.example.smarthome.model.RealEstate;
import com.example.smarthome.model.Vehicle;
import com.example.smarthome.service.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(value = "*")
@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
public class VehicleController {
    @Autowired
    private VehicleService vehicleService;

    @PreAuthorize("hasAnyAuthority('USER')")
    @PostMapping("/addVehicle")
    public ResponseEntity<Vehicle> addVehicle(@RequestBody NewVehicleDTO newVehicleDTO) {
        Vehicle savedVehicle = vehicleService.addVehicle(newVehicleDTO);
        return ResponseEntity.ok(savedVehicle);
    }

    @PreAuthorize("hasAnyAuthority('USER')")
    @GetMapping(
            value = "/getVehicles")
    public ResponseEntity getAllvehicles(){
        try{
            List<Vehicle> response = vehicleService.getVehicles();
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }

    }

    @GetMapping(value = "")
    public ResponseEntity getVehicles(){
        try{
            List<String> response = vehicleService.getRegNums();
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }

    }


}
