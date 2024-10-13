package com.example.smarthome.DTO.Devices.VEU_devices;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EnergyTransactionDTO {

    private Integer realEstateId;
    private String realEstateCity;

    private LocalDateTime timestamp;

    private Double toGrid;

    private Double fromGrid;
}
