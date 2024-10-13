package com.example.smarthome.model.SPU_devices;

import com.example.smarthome.model.Device;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Data
public class Gate extends Device implements Serializable {
    @Column
    private Boolean gateMode;
    @Column
    private Boolean isGateOn;

    @Override
    public void setValue(Object value) {
        if (value instanceof Double) {
            return;
        }
        else {
            throw new IllegalArgumentException("Invalid value type");
        }
    }
    @Override
    public void setOnOff(Object value) {
        if (value instanceof Boolean) {
            this.isGateOn = (Boolean) value;
        }
        else {
            throw new IllegalArgumentException("Invalid value type");
        }
    }

    @Override
    public boolean getOnOff() {
        return this.isGateOn;
    }
}
