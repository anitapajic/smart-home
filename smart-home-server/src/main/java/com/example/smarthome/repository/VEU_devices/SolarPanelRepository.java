package com.example.smarthome.repository.VEU_devices;

import com.example.smarthome.model.VEU_devices.SolarPanel;
import jakarta.persistence.Lob;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SolarPanelRepository extends JpaRepository<SolarPanel, Integer> {
    List<SolarPanel> findAllBySystemId(Integer systemId);
}
