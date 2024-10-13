package com.example.smarthome.mapper;

import com.example.smarthome.DTO.MQTT.models.Measurement;
import com.example.smarthome.DTO.MQTT.models.RegistrationMessage;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class RegistrationMapper {

    public RegistrationMessage messageToRegistration(String message) {

        RegistrationMessage measurement = new RegistrationMessage();

        // Extract deviceId
        measurement.setDeviceId(extractLongValue(message, "\"deviceId\"\\s*:\\s*(\\d+)"));

        // Extract name
        measurement.setName(extractStringValue(message, "\"name\"\\s*:\\s*\"([^\"]+)\""));

        // Extract value
        measurement.setRegistrationNumber(extractStringValue(message, "\"registrationNumber\"\\s*:\\s*\"([^\"]+)\""));

        measurement.setIsPassed(extractBooleanValue(message, "\"isPassed\"\\s*:\\s*(true|false)"));

        // Extract timestamp and convert to LocalDateTime
        String timestampStr = extractStringValue(message, "\"timestamp\"\\s*:\\s*\"([^\"]+)\"");
        LocalDateTime timestamp = LocalDateTime.parse(timestampStr, DateTimeFormatter.ISO_DATE_TIME);
        measurement.setTimestamp(timestamp);

        return measurement;
    }

    private Long extractLongValue(String message, String regex) {
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(message);
        if (matcher.find()) {
            return Long.parseLong(matcher.group(1));
        }
        return null; // Or throw an exception
    }

    private String extractStringValue(String message, String regex) {
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(message);
        if (matcher.find()) {
            return matcher.group(1);
        }
        return null; // Or throw an exception
    }

    private Boolean extractBooleanValue(String message, String regex) {
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(message);
        if (matcher.find()) {
            return Boolean.parseBoolean(matcher.group(1));
        }
        return null; // Or throw an exception
    }
}
