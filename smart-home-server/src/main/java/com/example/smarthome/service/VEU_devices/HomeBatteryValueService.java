package com.example.smarthome.service.VEU_devices;

import com.example.smarthome.DTO.MQTT.models.HomeBatteryMessage;
import com.example.smarthome.model.VEU_devices.HomeBattery;
import com.example.smarthome.repository.VEU_devices.HomeBatteryRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.RequiredArgsConstructor;
import org.eclipse.paho.mqttv5.client.IMqttClient;
import org.eclipse.paho.mqttv5.common.MqttMessage;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@EnableScheduling
public class HomeBatteryValueService {
    private final IMqttClient mqttClient;
    private static final ObjectWriter objectWriter;
    private final HomeBatteryRepository homeBatteryRepository;

    static {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
        objectWriter = mapper.writer().withDefaultPrettyPrinter();
    }

    @Scheduled(fixedRate = 3000)
    public void publishBatteryValue(){
        try{
            for(HomeBattery battery: homeBatteryRepository.findAll()){
                HomeBatteryMessage batteryMessage = new HomeBatteryMessage(Long.valueOf(battery.getId()), 1.0, battery.getName(), battery.getEnergyFromPanels(), LocalDateTime.now());
                String message = objectWriter.writeValueAsString(batteryMessage);
                mqttClient.publish("homeBattery", new MqttMessage(message.getBytes()));
            }
        }catch (Exception e){
            System.out.println(e);
        }
    }
}
