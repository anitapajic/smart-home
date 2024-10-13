package com.example.smarthome.model.VEU_devices;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
public class SolarPanel implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    public Integer id;
    @Column
    private Double size;
    @Column
    private Double solarPanelEfficiency;
    @Column
    private LocalDateTime timestamp;
    @Column
    private Boolean isOn;
    @Column
    private Double electricityGenerated;

    @JsonIgnore
    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "system_id")
    private SolarPanelSystem system;
}
