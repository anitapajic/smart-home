package com.example.smarthome.DTO.RealEstate;

import com.example.smarthome.model.enums.RealEstateStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RealEstateStatusChangeDTO {
    private Integer id;
    private RealEstateStatus status;
    private String reason;
}