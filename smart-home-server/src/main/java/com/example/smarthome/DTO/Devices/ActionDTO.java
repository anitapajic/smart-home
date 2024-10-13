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
public class ActionDTO {
    private Integer userId;
    private String username;
    private String userFullName;
    private Integer deviceId;
    private LocalDateTime timestamp;
    private String actionName;
}
