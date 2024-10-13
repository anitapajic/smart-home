package com.example.smarthome.service.VEU_devices;

import com.example.smarthome.model.VEU_devices.ChargingSession;
import com.example.smarthome.repository.VEU_devices.ChargingSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChargingSessionService {
    private final ChargingSessionRepository chargingSessionRepository;

    public void save(ChargingSession chargingSession){
        chargingSessionRepository.save(chargingSession);
    }
}
