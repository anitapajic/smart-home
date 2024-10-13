package com.example.smarthome.DTO.Devices;

import com.example.smarthome.model.enums.DeviceType;
import com.example.smarthome.model.enums.DeviceVariant;
import com.example.smarthome.model.PKA_devices.WMMode;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NewDeviceDTO {
    // All devices
    private Integer realEstateId;
    private String name;
    private String picture;
    private DeviceType type;
    private DeviceVariant variant;
    private Double powerStrenght;
    // Solar panel system
    private Integer numOfSolarPanels;
    private Double sizeOfOneSolarPanel;
    private Double solarPanelEfficiency;
    // Home Battery
    private Double homeBatteryCapacity;
    // Car Charger
    private Integer vehicleCapacity;
    private Double chargerStrength;
    // Air Conditioner
    private Integer maxTemperature;
    private Integer minTemperature;
    private List<String> modes;
    private List<WMMode> wmmodes;


}
