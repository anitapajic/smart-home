package com.example.smarthome.config;

import com.example.smarthome.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class SuperAdminConfig implements ApplicationRunner {

    @Autowired
    private UserService userService;


    @Override
    public void run(ApplicationArguments args) {
        userService.createSuperAdmin();

    }
}
