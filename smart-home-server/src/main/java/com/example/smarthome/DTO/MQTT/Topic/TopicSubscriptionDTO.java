package com.example.smarthome.DTO.MQTT.Topic;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TopicSubscriptionDTO {
    @NotBlank(message = "Topic is mandatory")
    private String topic;


    @Override
    public String toString() {
        return "TopicSubscription{" +
                "topic='" + topic + '\'' +
                '}';
    }
}
