package com.example.smarthome.model.PKA_devices;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class WMMode {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "mode_id")
    public Integer id;

    @Column()
    private String name;

    @Column()
    private Integer duration;

    @Column()
    private Integer temperature;
}
