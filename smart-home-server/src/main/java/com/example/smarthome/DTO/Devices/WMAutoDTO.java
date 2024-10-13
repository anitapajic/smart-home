package com.example.smarthome.DTO.Devices;


import com.example.smarthome.model.PKA_devices.WMMode;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WMAutoDTO {
    private Integer wmId;
    private LocalTime time;
    private LocalDate date;
    private WMMode mode;
}
