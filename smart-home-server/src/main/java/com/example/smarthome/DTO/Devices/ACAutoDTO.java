package com.example.smarthome.DTO.Devices;

import com.example.smarthome.model.PKA_devices.AirConditioning;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ACAutoDTO {
    private Integer acId;
    private LocalTime from;
    private LocalTime to;
    private String mode;
    private Integer temperature;

    private Boolean condition;
    private Integer conditionTemperature;
}
