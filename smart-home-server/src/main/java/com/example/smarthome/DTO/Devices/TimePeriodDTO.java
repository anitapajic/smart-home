package com.example.smarthome.DTO.Devices;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TimePeriodDTO {
    private LocalDateTime from;
    private LocalDateTime to;
    private String periodType;
    private Integer period;
}
