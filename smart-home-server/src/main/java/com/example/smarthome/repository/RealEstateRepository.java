package com.example.smarthome.repository;

import com.example.smarthome.model.RealEstate;
import com.example.smarthome.model.enums.RealEstateStatus;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RealEstateRepository  extends JpaRepository<RealEstate, Integer> {

    RealEstate findOneById(Integer id);

    RealEstate save(RealEstate user);

    List<RealEstate> findAll();
    List<RealEstate> findAllByStatus(RealEstateStatus status);

    List<RealEstate> findAllByUserIdId(Integer userId);

    List<RealEstate> findAllByStatusAndUserIdId(RealEstateStatus status, Integer userId);

    List<RealEstate> findAllByAddress_City(String city);


}