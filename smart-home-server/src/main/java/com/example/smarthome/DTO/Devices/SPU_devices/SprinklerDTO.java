package com.example.smarthome.DTO.Devices.SPU_devices;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SprinklerDTO {
    private Integer id;
    private boolean isSprinklerOn;
}
