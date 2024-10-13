package com.example.smarthome.model.VEU_devices;

import com.example.smarthome.model.RealEstate;
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
public class EnergyTransaction implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne(cascade = CascadeType.MERGE, fetch = FetchType.EAGER)
    @JoinColumn(name = "real_estate_id")
    private RealEstate realEstate;
    @Column
    private LocalDateTime timestamp;
    @Column
    private Double toGrid;
    @Column
    private Double fromGrid;
}
