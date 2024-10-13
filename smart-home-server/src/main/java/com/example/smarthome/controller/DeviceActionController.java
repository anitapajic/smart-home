package com.example.smarthome.controller;

import com.example.smarthome.DTO.Devices.ActionDTO;
import com.example.smarthome.service.InfluxDbService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(value="*")
@RestController
@RequestMapping(value = "/api/devices/actions")
@RequiredArgsConstructor
public class DeviceActionController {
    private final InfluxDbService influxDbService;

    @PreAuthorize("hasAnyAuthority('USER')")
    @GetMapping(value = "/byDevice/{systemId}")
    public ResponseEntity getAllActionsBySystemId(@PathVariable Integer systemId){
        try{
            List<ActionDTO> solarPanelSystemActions = influxDbService.getActionsByDeviceId(systemId);
            return new ResponseEntity<>(solarPanelSystemActions, HttpStatus.OK);
        }
        catch(Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

}
