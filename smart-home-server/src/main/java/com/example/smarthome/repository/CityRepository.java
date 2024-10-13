package com.example.smarthome.repository;

import com.example.smarthome.model.Address;
import com.example.smarthome.model.City;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CityRepository extends JpaRepository<City, Integer> {
    List<City> findOneByCountryId(Integer id);
}
