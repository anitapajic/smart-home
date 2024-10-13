package com.example.smarthome.DTO.RealEstate;

import com.example.smarthome.model.Address;
import com.example.smarthome.model.RealEstate;
import com.example.smarthome.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RealEstateDTO {
    private Integer id;
    private String name;
    private Address address;
    private User userId;
    private int quadrature;
    private int floors;
    private String picture;

    public RealEstateDTO(RealEstate realEstate) {
        this.id = realEstate.getId();
        this.name = realEstate.getName();
        this.address = realEstate.getAddress();
        this.userId = realEstate.getUserId();
        this.quadrature = realEstate.getQuadrature();
        this.floors = realEstate.getFloors();
        this.picture = realEstate.getPicture();
    }


}
