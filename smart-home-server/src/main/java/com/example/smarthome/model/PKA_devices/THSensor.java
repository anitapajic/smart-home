package com.example.smarthome.model.PKA_devices;

import com.example.smarthome.model.Device;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.io.Serializable;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class THSensor extends Device implements Serializable {
    @Column
    private Double temperature;
    @Column
    private Double humidity;

    private String topic;

    @Override
    public void setValue(Object value) {
        if (value instanceof Double) {
            if(topic.contains("temperature")){
                this.temperature = (Double) value;
            }
            else {
                this.humidity = (Double) value;
            }
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
