package com.example.smarthome.model.VEU_devices;

import com.example.smarthome.model.Device;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CarCharger extends Device implements Serializable {

    private Double chargerStrength;
    private Integer vehicleCapacity;

    @JsonManagedReference
    @OneToMany(mappedBy = "carCharger", fetch = FetchType.EAGER)
    private List<ChargingVehicle> connectedVehicles;

    @Override
    public void setValue(Object value) {
        if (value instanceof Double) {
            throw new NullPointerException("Not implemented");
        }
        else {
            throw new IllegalArgumentException("Invalid value type");
        }
    }
    @Override
    public void setOnOff(Object value) {

    }

    @Override
    public boolean getOnOff() {
        return true;
    }
}
