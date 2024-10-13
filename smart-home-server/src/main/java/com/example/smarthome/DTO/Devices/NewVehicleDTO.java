package com.example.smarthome.DTO.Devices;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NewVehicleDTO {

    private String registration;
    private Integer gateId;
}
