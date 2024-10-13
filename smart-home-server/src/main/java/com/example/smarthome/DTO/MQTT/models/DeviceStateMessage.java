package com.example.smarthome.DTO.MQTT.models;

import com.example.smarthome.model.enums.DeviceVariant;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class DeviceStateMessage {
    private Long deviceId;
    private String deviceName;
    private Boolean isOn;
    private DeviceVariant variant;
    private LocalDateTime timestamp;
    private Boolean success;
    private String username;
}
