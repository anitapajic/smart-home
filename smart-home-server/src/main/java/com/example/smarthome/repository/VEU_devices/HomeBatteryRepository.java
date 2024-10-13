package com.example.smarthome.repository.VEU_devices;

import com.example.smarthome.model.VEU_devices.HomeBattery;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HomeBatteryRepository extends JpaRepository<HomeBattery, Long> {
    List<HomeBattery> findByRealEstateId(Integer realEstateId);
}

