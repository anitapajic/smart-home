package com.example.smarthome.repository;

import com.example.smarthome.model.ResetCode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ResetCodeRepository extends JpaRepository<ResetCode,Integer> {

    ResetCode findOneById(Integer id);

    Optional<ResetCode> findOneByUsername(String username);

    ResetCode findOneByCode(Integer code);

    void deleteById(Integer id);
}