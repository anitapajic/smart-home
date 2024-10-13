package com.example.smarthome.controller.PKA_devices;


import com.example.smarthome.DTO.Devices.WMAutoDTO;
import com.example.smarthome.DTO.Devices.WashingMachineDTO;
import com.example.smarthome.model.PKA_devices.WashingMachineAuto;
import com.example.smarthome.service.DeviceService;
import com.example.smarthome.service.PKA_devices.WMAutoModeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(value = "*")
@RestController
@RequestMapping(value = "api/devices/pka/wm")
@RequiredArgsConstructor
public class WashingMachineController {
    private final DeviceService deviceService;
    private final WMAutoModeService autoModeService;

    @PreAuthorize("hasAnyAuthority('USER')")
    @PostMapping(value = "")
    public ResponseEntity setWMMode(@RequestBody WashingMachineDTO wmDTO) {
        try {
            deviceService.setWMValue(wmDTO);
            return new ResponseEntity<>("", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }



    @PreAuthorize("hasAnyAuthority('USER')")
    @PostMapping(value = "/create")
    public ResponseEntity createACAutoMode(@RequestBody WMAutoDTO autoDTO) {
        try {
            WashingMachineAuto newMode = autoModeService.createAutoMode(autoDTO);
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
