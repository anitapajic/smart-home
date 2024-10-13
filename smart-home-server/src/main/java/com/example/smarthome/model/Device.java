package com.example.smarthome.model;

import com.example.smarthome.model.enums.DeviceType;
import com.example.smarthome.model.enums.DeviceVariant;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.io.Serializable;

@Entity
@Table(name = "device")
@AllArgsConstructor
@NoArgsConstructor
@Data
@ToString
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
public abstract class Device implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    public Integer id;

    @Column(unique = true)
    private String name;

    @ManyToOne(cascade = CascadeType.MERGE, fetch = FetchType.EAGER)
    @JoinColumn(name = "real_estate_id")
    private RealEstate realEstate;

    @Column
    private Boolean isOnline;

    @Column
    private String picture;

    @Enumerated(EnumType.STRING)
    private DeviceType type;

    @Enumerated(EnumType.STRING)
    private DeviceVariant variant;

    @Column
    private Double powerStrenght;


    public abstract void setValue(Object value);

    public abstract void setOnOff(Object value);


    public abstract boolean getOnOff();

}
