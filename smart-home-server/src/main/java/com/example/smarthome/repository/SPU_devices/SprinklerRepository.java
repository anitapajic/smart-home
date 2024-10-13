package com.example.smarthome.repository.SPU_devices;

import com.example.smarthome.model.RealEstate;
import com.example.smarthome.model.SPU_devices.Gate;
import com.example.smarthome.model.SPU_devices.Sprinkler;
import com.example.smarthome.model.SPU_devices.SprinklerAuto;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SprinklerRepository extends JpaRepository<Sprinkler, Long> {

    public Sprinkler findOneById(Integer id);
    public Sprinkler save(RealEstate user);

    SprinklerAuto save(SprinklerAuto sprinklerAuto);
}
