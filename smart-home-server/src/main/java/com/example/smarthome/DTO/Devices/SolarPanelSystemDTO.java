package com.example.smarthome.DTO.Devices;

import com.example.smarthome.model.Device;
import com.example.smarthome.model.VEU_devices.SolarPanel;
import com.example.smarthome.model.VEU_devices.SolarPanelSystem;
import com.example.smarthome.model.enums.DeviceType;
import com.example.smarthome.model.enums.DeviceVariant;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SolarPanelSystemDTO {
    public Integer deviceId;
    private String name;
    private Integer realEstateID;
    private Boolean online;
    private DeviceType type;
    private DeviceVariant variant;
    private Boolean isOn;
    private List<SolarPanel> solarPanels;


    public SolarPanelSystemDTO(SolarPanelSystem system){
        this.deviceId = system.getId();
        this.name = system.getName();
        this.realEstateID = system.getRealEstate().getId();
        this.online = system.getIsOnline();
        this.type = system.getType();
        this.variant = system.getVariant();
        this.isOn = system.getIsOn();
        this.solarPanels = new ArrayList<>();
    }
}
