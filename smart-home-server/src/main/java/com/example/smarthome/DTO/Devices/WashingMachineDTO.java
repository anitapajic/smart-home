package com.example.smarthome.DTO.Devices;

import com.example.smarthome.model.PKA_devices.WMMode;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WashingMachineDTO {
    private Long Id;
    private WMMode wmcurrentMode;
    private Boolean isOn;
}
