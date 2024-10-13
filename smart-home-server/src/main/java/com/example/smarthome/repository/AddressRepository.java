package com.example.smarthome.repository;

import com.example.smarthome.model.Address;
import com.example.smarthome.model.RealEstate;
import com.example.smarthome.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepository extends JpaRepository<Address, Integer> {
    Address findOneById(Integer id);
    Address findOneByCityAndCountryAndLocation(String city, String country, String location);
}
