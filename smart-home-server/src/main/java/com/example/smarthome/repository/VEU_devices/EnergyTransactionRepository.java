package com.example.smarthome.repository.VEU_devices;

import com.example.smarthome.model.VEU_devices.EnergyTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EnergyTransactionRepository extends JpaRepository<EnergyTransaction, Integer> {

}
