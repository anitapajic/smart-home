package com.example.smarthome.model.VEU_devices;

import com.example.smarthome.model.Device;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SolarPanelSystem extends Device implements Serializable {

    @Column
    private Integer numOfPanels;
    @Column
    private Boolean isOn;
    @Column
    private LocalDateTime timestamp;
    @Column
    private Double electricityGenerated;
    @Column
    private Double size;
    @Column
    private Double solarPanelEfficiency;

    @Override
    public void setValue(Object value) {
        if (value instanceof Double) {
            this.electricityGenerated = (Double) value;
            this.timestamp = LocalDateTime.now();
            this.isOn = true;
        }
        else {
            throw new IllegalArgumentException("Invalid value type");
        }
    }
    @Override
    public void setOnOff(Object value) {
        if(value instanceof Boolean){
            this.isOn = (Boolean) value;
        }
        else {
            throw new IllegalArgumentException("Invalid value type");
        }
    }

    @Override
    public boolean getOnOff() {
        return this.isOn;
    }
}
