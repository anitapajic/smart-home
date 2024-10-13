package com.example.smarthome.model.PKA_devices;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.cglib.core.Local;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AirConditioningAuto implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    public Integer id;

    @ManyToOne(cascade = CascadeType.MERGE, fetch = FetchType.EAGER)
    @JoinColumn(name = "ac_id")
    @JsonBackReference
    private AirConditioning airConditioning;

    @Column()
    private Integer conditionTemperature;
    @Column()
    private Boolean condition;
    @Column()
    private String mode;
    @Column()
    private Integer temperature;

    @Column()
    private LocalTime fromTime;
    @Column()
    private LocalTime toTime;

    @Override
    public String toString() {
        return "AirConditioningAuto{" +
                "id=" + id +
                ", airConditioning=" + airConditioning.getId() +
                ", conditionTemperature=" + conditionTemperature +
                ", condition=" + condition +
                ", mode='" + mode + '\'' +
                ", temperature=" + temperature +
                ", fromTime=" + fromTime +
                ", toTime=" + toTime +
                '}';
    }
}
