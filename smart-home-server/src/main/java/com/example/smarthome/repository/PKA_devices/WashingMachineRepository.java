package com.example.smarthome.repository.PKA_devices;

import com.example.smarthome.model.PKA_devices.AirConditioning;
import com.example.smarthome.model.PKA_devices.WashingMachine;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WashingMachineRepository extends JpaRepository<WashingMachine, Long> {

    public WashingMachine findOneById(Integer id);
}
