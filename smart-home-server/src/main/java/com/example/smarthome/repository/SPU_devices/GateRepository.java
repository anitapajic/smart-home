package com.example.smarthome.repository.SPU_devices;

import com.example.smarthome.model.RealEstate;
import com.example.smarthome.model.SPU_devices.Gate;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GateRepository extends JpaRepository<Gate, Long> {

    public Gate findOneById(Integer id);
    public Gate save(RealEstate user);
}
