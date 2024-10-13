package com.example.smarthome.model.VEU_devices;

import com.example.smarthome.model.Vehicle;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChargingSession implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "chargingVehicle_id")
    private ChargingVehicle chargingVehicle;

    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Double energyConsumption;
}
