package com.example.smarthome.service.VEU_devices;

import com.example.smarthome.model.VEU_devices.SolarPanel;
import com.example.smarthome.model.VEU_devices.SolarPanelSystem;
import com.example.smarthome.repository.VEU_devices.SolarPanelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SolarPanelService {
    private final SolarPanelRepository solarPanelRepository;

    public SolarPanel addSolarPanel(SolarPanelSystem system) {
        SolarPanel solarPanel = new SolarPanel();
        solarPanel.setSystem(system);
        solarPanel.setSize(system.getSize());
        solarPanel.setIsOn(false);
        solarPanel.setSolarPanelEfficiency(system.getSolarPanelEfficiency());
        solarPanel.setElectricityGenerated(0.0);
        solarPanel.setTimestamp(LocalDateTime.now());

        return solarPanelRepository.save(solarPanel);
    }
    public List<SolarPanel> findAllBySystemId(Integer systemId){
        return solarPanelRepository.findAllBySystemId(systemId);
    }

    public SolarPanel save(SolarPanel solarPanel){
        return solarPanelRepository.save(solarPanel);
    }
}
