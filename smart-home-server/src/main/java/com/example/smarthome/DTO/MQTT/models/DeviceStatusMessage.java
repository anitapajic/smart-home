package com.example.smarthome.DTO.MQTT.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class DeviceStatusMessage {

    private Long deviceId;
    private String topic;
    private String deviceName;
    private Boolean value;
    private LocalDateTime timestamp;
}
