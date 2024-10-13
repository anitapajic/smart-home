package com.example.smarthome.model.PKA_devices;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class WashingMachineAuto implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    public Integer id;

    @ManyToOne(cascade = CascadeType.MERGE, fetch = FetchType.EAGER)
    @JoinColumn(name = "wm_id")
    @JsonBackReference
    private WashingMachine washingMachine;

    @ManyToOne
    @JoinColumn(name = "mode_id", nullable = false)
    private WMMode mode;

    @Column()
    private LocalTime time;

    @Column()
    private LocalDate date;

    @Override
    public String toString() {
        return "WashingMachineAuto{" +
                "id=" + id +
                ", washingMachine=" + washingMachine.getId() +
                ", mode='" + mode + '\'' +
                ", time=" + time +
                ", date=" + date +
                '}';
    }
}
