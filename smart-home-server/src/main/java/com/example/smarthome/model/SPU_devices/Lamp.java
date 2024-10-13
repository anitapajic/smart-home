package com.example.smarthome.model.SPU_devices;

import com.example.smarthome.model.Device;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Lamp extends Device implements Serializable {
    @Column
    private Boolean lampIsOn;
    @Column
    private LocalDateTime timestamp;
    @Column
    private Double brightnessLevel;
    @Column
    private Boolean lampMode;
    @Override
    public void setValue(Object value) {
        if (value instanceof Double) {
            this.brightnessLevel = (Double) value;
        }
         else {
            throw new IllegalArgumentException("Invalid value type");
        }
    }
    @Override
    public void setOnOff(Object value) {
        if (value instanceof Boolean) {
            this.lampIsOn = (Boolean) value;
        }
        else {
            throw new IllegalArgumentException("Invalid value type");
        }
    }

    @Override
    public boolean getOnOff() {
        return this.lampIsOn;
    }

}
