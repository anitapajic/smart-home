package com.example.smarthome.DTO.MQTT.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HomeBatteryMessage {
    private Long deviceId;
    private Double direction; // 1 od servera ka simulaciji, 0 od simulacije ka serveru
    private String name;
    private Double value;
    private LocalDateTime timestamp;
}
