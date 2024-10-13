package com.example.smarthome.DTO.RealEstate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CityDTO {
    private String city;
    private Integer numOfRE;
}
