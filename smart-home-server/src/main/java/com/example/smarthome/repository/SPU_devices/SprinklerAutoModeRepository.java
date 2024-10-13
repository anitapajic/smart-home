package com.example.smarthome.repository.SPU_devices;
import com.example.smarthome.model.SPU_devices.Sprinkler;
import com.example.smarthome.model.SPU_devices.SprinklerAuto;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SprinklerAutoModeRepository extends JpaRepository<SprinklerAuto, Long> {

    public SprinklerAuto findOneById(Integer id);
}
