package com.example.smarthome.DTO.Devices.VEU_devices;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChargingVehicleDTO {

    private Long id;
    private String registrationNumber;
    private Double batteryCapacity;
    private Double currenLevelBattery;
    private Double wantedLevelBattery;
    private Long carChargerId;
}
