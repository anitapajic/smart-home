package com.example.smarthome.service;

import com.example.smarthome.DTO.Devices.NewVehicleDTO;
import com.example.smarthome.DTO.Devices.SimulationDeviceDTO;
import com.example.smarthome.model.RealEstate;
import com.example.smarthome.model.SPU_devices.Gate;
import com.example.smarthome.model.Vehicle;
import com.example.smarthome.repository.SPU_devices.GateRepository;
import com.example.smarthome.repository.VehicleRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.RequiredArgsConstructor;
import org.eclipse.paho.mqttv5.client.IMqttClient;
import org.eclipse.paho.mqttv5.common.MqttException;
import org.eclipse.paho.mqttv5.common.MqttMessage;
import org.eclipse.paho.mqttv5.common.MqttPersistenceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final GateRepository gateRepository;
    private final IMqttClient mqttClient;
    private static final ObjectWriter objectWriter;

    static {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
        objectWriter = mapper.writer().withDefaultPrettyPrinter();
    }
    public Vehicle addVehicle(NewVehicleDTO newVehicleDTO) {
        Vehicle newVehicle = new Vehicle();
        newVehicle.setRegistration(newVehicleDTO.getRegistration());
        Gate gate = gateRepository.findOneById(newVehicleDTO.getGateId());
        newVehicle.setGate(gate);

        vehicleRepository.save(newVehicle);

        try {
            String message = objectWriter.writeValueAsString(newVehicle.getRegistration());
            mqttClient.publish("newVehicle", new MqttMessage(message.getBytes()));

        } catch (JsonProcessingException | MqttException e) {
            throw new RuntimeException(e);
        }

        return newVehicle;
    }

    public List<Vehicle> getVehicles() {
        System.out.println("getVehicles fetched from DB and successfully cached!");
        return vehicleRepository.findAll();

    }


    public List<String> getRegNums() {
        List<String > regNums = new ArrayList<>();
        List<Vehicle> vehicles = vehicleRepository.findAll();
        for (Vehicle vehicle : vehicles){
            regNums.add(vehicle.getRegistration());
        }
        return regNums;

    }
}
