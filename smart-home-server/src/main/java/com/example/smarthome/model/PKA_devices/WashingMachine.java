package com.example.smarthome.model.PKA_devices;

import com.example.smarthome.DTO.Devices.WashingMachineDTO;
import com.example.smarthome.model.Device;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class WashingMachine extends Device implements Serializable {

    @ManyToOne
    @JoinColumn(name = "mode_id", nullable = false)
    private WMMode wmcurrentMode;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "washing_machine_modes",
            joinColumns = @JoinColumn(name = "washing_machine_id"),
            inverseJoinColumns = @JoinColumn(name = "mode_id")
    )
    @JsonManagedReference
    private List<WMMode> wmmodes;

    @Column
    private Boolean isOn;

    @OneToMany(mappedBy = "washingMachine", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<WashingMachineAuto> washingMachineAutos;

    @Override
    public void setValue(Object value) {
        if (value instanceof WashingMachineDTO) {
            WashingMachineDTO wmDTO = (WashingMachineDTO) value;
            if(wmmodes.contains(wmDTO.getWmcurrentMode())){
                this.isOn = wmDTO.getIsOn();
                this.wmcurrentMode = wmDTO.getWmcurrentMode();
            }
        }
        else {
            throw new IllegalArgumentException("Invalid value type");
        }
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
