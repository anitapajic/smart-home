package com.example.smarthome.repository;

import com.example.smarthome.model.Country;
import com.example.smarthome.model.Permission;
import com.example.smarthome.model.RealEstate;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PermissionRepository  extends JpaRepository<Permission, Integer> {

    List<Permission> findAllByUserId(@Param("userId") Integer userId);

    List<Permission> findAllByEstateId(@Param("estateId") Integer estateId);

    List<Permission> findAllByDeviceId(@Param("deviceId") Integer deviceId);
    List<Permission> findAllByUserIdAndEstateId(Integer userId, Integer estateId);

    List<Permission> findAllByUserIdAndEstateIdAndDeviceId(Integer userId, Integer estateId, Integer deviceId);

}
