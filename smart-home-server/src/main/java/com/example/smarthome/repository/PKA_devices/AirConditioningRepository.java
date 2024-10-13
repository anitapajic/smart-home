package com.example.smarthome.repository.PKA_devices;

import com.example.smarthome.model.Address;
import com.example.smarthome.model.PKA_devices.AirConditioning;
import com.example.smarthome.model.PKA_devices.AirConditioningAuto;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AirConditioningRepository extends JpaRepository<AirConditioning, Long> {

    public AirConditioning findOneById(Integer id);

}
