package com.example.smarthome.repository;

import com.example.smarthome.model.Address;
import com.example.smarthome.model.City;
import com.example.smarthome.model.Country;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CountryRepository extends JpaRepository<Country, Integer> {
    List<Country> findAll();
}
