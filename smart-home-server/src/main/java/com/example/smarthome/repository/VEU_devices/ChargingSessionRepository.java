package com.example.smarthome.repository.VEU_devices;

import com.example.smarthome.model.VEU_devices.ChargingSession;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChargingSessionRepository extends JpaRepository<ChargingSession, Long> {
}
