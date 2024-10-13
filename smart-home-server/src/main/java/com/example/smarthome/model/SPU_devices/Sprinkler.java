package com.example.smarthome.model.SPU_devices;

import com.example.smarthome.model.Device;
import com.example.smarthome.model.PKA_devices.AirConditioningAuto;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Entity
@Data
public class Sprinkler extends Device implements Serializable {

    @Column
    private Boolean isSprinklerOn;

    @Column
    private Boolean sprinklerMode;

    @OneToMany(mappedBy = "sprinkler", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<SprinklerAuto> sprinklerAutos;
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
        if (value instanceof Boolean) {
            this.isSprinklerOn = (Boolean) value;
        }
        else {
            throw new IllegalArgumentException("Invalid value type");
        }
    }
    @Override
    public boolean getOnOff() {
        return this.isSprinklerOn;
    }
}
