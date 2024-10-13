package com.example.smarthome.repository;

import com.example.smarthome.model.Device;
import com.example.smarthome.model.enums.DeviceVariant;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DeviceRepository extends JpaRepository<Device, Long> {

   Device findDeviceById(Integer deviceId);

    List<Device> findAllByRealEstateId(Integer realEstateId);

    List<Device> findAll();
    List<Device> findAllByRealEstateIdAndIsOnlineAndVariantNotIn(Integer realEstateId, Boolean isOnline, List<DeviceVariant> types);
    Boolean existsByRealEstateIdAndVariant(Integer id, DeviceVariant variant);
}
