package com.example.smarthome.model.PKA_devices;

import com.example.smarthome.DTO.Devices.AirConditionerDTO;
import com.example.smarthome.model.Device;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ScheduledFuture;


@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AirConditioning extends Device implements Serializable {

    @Column
    private Integer maxTemperature;
    @Column
    private Integer minTemperature;
    @Column
    private Integer currentTemperature;

    @Column
    private String currentMode;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "ac_modes", joinColumns = @JoinColumn(name = "ac_id"))
    private List<String> modes;

    @Column
    private Boolean isOn;

    @OneToMany(mappedBy = "airConditioning", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<AirConditioningAuto> airConditioningAutos;

    @Override
    public void setValue(Object value) {
        if (value instanceof AirConditionerDTO) {
           AirConditionerDTO acDTO = (AirConditionerDTO) value;
           if(modes.contains(acDTO.getCurrentMode()) && checkTemperature(acDTO.getCurrentTemperature())){
               this.isOn = acDTO.getIsOn();
               this.currentMode = acDTO.getCurrentMode();
               this.currentTemperature = acDTO.getCurrentTemperature();
           }
        }
        else {
            throw new IllegalArgumentException("Invalid value type");
        }
    }

    private Boolean checkTemperature(Integer temperature){
        return this.maxTemperature > temperature && this.minTemperature< temperature;
    }
    @Override
    public void setOnOff(Object value) {
        if(value instanceof Boolean){
            this.isOn = (Boolean)value ;
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
