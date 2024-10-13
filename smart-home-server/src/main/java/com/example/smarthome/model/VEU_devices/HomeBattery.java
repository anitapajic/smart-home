package com.example.smarthome.model.VEU_devices;

import com.example.smarthome.model.Device;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;


@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class HomeBattery extends Device implements Serializable {
    @Column
    private Double energyFromPanels;
    @Column
    private Double capacity;



    @Override
    public void setValue(Object value) {

    }
    @Override
    public void setOnOff(Object value) {

    }
    @Override
    public boolean getOnOff() {
        return true;
    }
}
