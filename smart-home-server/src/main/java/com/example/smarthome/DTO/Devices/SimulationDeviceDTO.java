package com.example.smarthome.DTO.Devices;

import com.example.smarthome.model.Device;
import com.example.smarthome.model.VEU_devices.SolarPanel;
import com.example.smarthome.model.enums.DeviceType;
import com.example.smarthome.model.enums.DeviceVariant;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SimulationDeviceDTO {
    public Integer deviceId;
    private String name;
    private Integer realEstateID;
    private Boolean online;
    private DeviceType type;
    private DeviceVariant variant;
    private boolean isOn;


    public SimulationDeviceDTO(Device device){
        this.deviceId = device.getId();
        this.name = device.getName();
        this.realEstateID = device.getRealEstate().getId();
        this.online = device.getIsOnline();
        this.type = device.getType();
        this.variant = device.getVariant();
        this.isOn = device.getOnOff();
    }

}
