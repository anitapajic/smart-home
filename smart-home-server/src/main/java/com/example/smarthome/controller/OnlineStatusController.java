package com.example.smarthome.controller;


import com.example.smarthome.DTO.Devices.ActionDTO;
import com.example.smarthome.DTO.Devices.OnlineStatusDTO;
import com.example.smarthome.DTO.Devices.TimePeriodDTO;
import com.example.smarthome.service.InfluxDbService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(value="*")
@RestController
@RequestMapping(value = "/api/devices/")
@RequiredArgsConstructor
public class OnlineStatusController {

    private final InfluxDbService influxDbService;

    @PreAuthorize("hasAnyAuthority('USER')")
    @PostMapping(value = "onlineStatus/{systemId}")
    public ResponseEntity getOnlineStatusBySystemId(@PathVariable Integer systemId, @RequestBody TimePeriodDTO timePeriod){
        try{
            List<OnlineStatusDTO> solarPanelSystemActions = influxDbService.getOnlineStatusByDeviceId(timePeriod,systemId);
            return new ResponseEntity<>(solarPanelSystemActions, HttpStatus.OK);
        }
        catch(Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
