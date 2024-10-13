package com.example.smarthome.controller.VEU_devices;

import com.example.smarthome.DTO.Devices.TimePeriodDTO;
import com.example.smarthome.DTO.Devices.VEU_devices.EnergyTransactionDTO;
import com.example.smarthome.service.InfluxDbService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(value="*")
@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api/energyTransactions")
public class EnergyTransactionController {
    private final InfluxDbService influxDbService;

    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN', 'SUPERADMIN')")
    @PostMapping(value = "/toGrid/{realEstateId}")
    public ResponseEntity getTransactionsToGrid(@PathVariable Integer realEstateId, @RequestBody TimePeriodDTO timePeriod){
        try{
            List<EnergyTransactionDTO> measurements = influxDbService.getToGridTransactions(timePeriod, realEstateId);
            return new ResponseEntity<>(measurements, HttpStatus.OK);
        }
        catch(Exception e){
            System.out.println("getTransactionsToGrid " + e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN', 'SUPERADMIN')")
    @PostMapping(value = "/fromGrid/{realEstateId}")
    public ResponseEntity getTransactionsFromGrid(@PathVariable Integer realEstateId, @RequestBody TimePeriodDTO timePeriod){
        try{
            List<EnergyTransactionDTO> measurements = influxDbService.getFromGridTransactions(timePeriod, realEstateId);
            return new ResponseEntity<>(measurements, HttpStatus.OK);
        }
        catch(Exception e){
            System.out.println("getTransactionsFromGrid " + e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN', 'SUPERADMIN')")
    @PostMapping(value = "/fromGridByCity/{city}")
    public ResponseEntity getTransactionsFromGridByCity(@PathVariable String city, @RequestBody TimePeriodDTO timePeriod){
        try{
            List<EnergyTransactionDTO> measurements = influxDbService.getFromGridTransactionsByCity(timePeriod, city);
            return new ResponseEntity<>(measurements, HttpStatus.OK);
        }
        catch(Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN', 'SUPERADMIN')")
    @PostMapping(value = "/toGridByCity/{city}")
    public ResponseEntity getTransactionsToGridByCity(@PathVariable String city, @RequestBody TimePeriodDTO timePeriod){
        try{
            List<EnergyTransactionDTO> measurements = influxDbService.getToGridTransactionsByCity(timePeriod, city);
            return new ResponseEntity<>(measurements, HttpStatus.OK);
        }
        catch(Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }


}
