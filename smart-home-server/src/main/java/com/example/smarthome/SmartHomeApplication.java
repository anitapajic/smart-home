package com.example.smarthome;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class SmartHomeApplication {

	public static void main(String[] args) {

		SpringApplication.run(SmartHomeApplication.class, args);

	}

}
