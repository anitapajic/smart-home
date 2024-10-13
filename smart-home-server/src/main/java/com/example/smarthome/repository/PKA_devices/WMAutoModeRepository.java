package com.example.smarthome.repository.PKA_devices;

import com.example.smarthome.model.PKA_devices.AirConditioningAuto;
import com.example.smarthome.model.PKA_devices.WashingMachineAuto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WMAutoModeRepository extends JpaRepository<WashingMachineAuto, Long> {


}
