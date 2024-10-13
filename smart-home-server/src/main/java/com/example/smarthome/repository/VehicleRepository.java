package com.example.smarthome.repository;

import com.example.smarthome.model.RealEstate;
import com.example.smarthome.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface
VehicleRepository extends JpaRepository<Vehicle, Integer> {
    List<Vehicle> findAll();
}
