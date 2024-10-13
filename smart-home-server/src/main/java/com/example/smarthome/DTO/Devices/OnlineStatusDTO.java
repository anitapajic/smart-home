package com.example.smarthome.DTO.Devices;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class OnlineStatusDTO {

    private Integer deviceId;
    private String name;
    private LocalDateTime timestamp;
    private Boolean onlineStatus;
}
