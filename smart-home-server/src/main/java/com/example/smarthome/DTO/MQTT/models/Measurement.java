package com.example.smarthome.DTO.MQTT.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class Measurement {

    private Long deviceId;
    private String topic;
    private String name;
    private Double value;
    private LocalDateTime timestamp;

}
