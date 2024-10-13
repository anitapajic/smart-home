package com.example.smarthome.DTO.Devices.SPU_devices;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SprinklerAutoDTO {

    private Integer sprinklerId;
    private LocalTime from;
    private LocalTime to;

    private Boolean condition;
    private Integer repeat;
}
