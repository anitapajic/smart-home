package com.example.smarthome.model.SPU_devices;


import com.example.smarthome.model.PKA_devices.AirConditioning;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SprinklerAuto implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    public Integer id;

    @ManyToOne(cascade = CascadeType.MERGE, fetch = FetchType.EAGER)
    @JoinColumn(name = "sprinkler_id")
    @JsonBackReference
    private Sprinkler sprinkler;

    @Column()
    private Boolean condition;
    @Column()
    private LocalTime fromTime;
    @Column()
    private LocalTime toTime;

    @Column()
    private Integer repeat;


    @Override
    public String toString() {
        return "AirConditioningAuto{" +
                "id=" + id +
                ", sprinkler=" + sprinkler.getId() +
                ", condition=" + condition +
                ", fromTime=" + fromTime +
                ", toTime=" + toTime +
                '}';
    }
}
