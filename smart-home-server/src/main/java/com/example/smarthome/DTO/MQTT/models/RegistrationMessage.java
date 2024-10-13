package com.example.smarthome.DTO.MQTT.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegistrationMessage {
    private Long deviceId;
    private String name;
    private String registrationNumber;
    private LocalDateTime timestamp;

    private Boolean isPassed;


}
