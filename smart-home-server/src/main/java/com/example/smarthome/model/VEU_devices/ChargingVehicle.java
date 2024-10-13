package com.example.smarthome.model.VEU_devices;

import com.fasterxml.jackson.annotation.JsonBackReference;
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
public class ChargingVehicle implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String registrationNumber;
    private Double batteryCapacity;
    private Double currenLevelBattery;
    private Double wantedLevelBattery;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "carCharger_id")
    private CarCharger carCharger;

    @JsonManagedReference
    @OneToMany(mappedBy = "chargingVehicle")
    private List<ChargingSession> chargingSessions;
}
