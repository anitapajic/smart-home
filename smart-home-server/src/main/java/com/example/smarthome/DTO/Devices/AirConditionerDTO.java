package com.example.smarthome.DTO.Devices;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AirConditionerDTO {
    private Long Id;
    private String currentMode;
    private Integer currentTemperature;
    private Boolean isOn;
}
