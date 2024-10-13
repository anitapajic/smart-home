package com.example.smarthome.repository;

import com.example.smarthome.model.User;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {

    User findOneById(Integer id);

    Optional<User> findByUsername(String username);

    User save(User user);

}
