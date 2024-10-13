package com.example.smarthome.repository.PKA_devices;

import com.example.smarthome.model.PKA_devices.AirConditioningAuto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ACAutoModeRepository extends JpaRepository<AirConditioningAuto, Long> {
}
