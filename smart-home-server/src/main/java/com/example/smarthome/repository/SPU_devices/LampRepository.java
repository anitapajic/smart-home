package com.example.smarthome.repository.SPU_devices;

import com.example.smarthome.model.SPU_devices.Lamp;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LampRepository extends JpaRepository<Lamp, Long> {
}
