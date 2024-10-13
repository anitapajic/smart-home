package com.example.smarthome.mapper;

import com.example.smarthome.DTO.MQTT.models.DeviceStateMessage;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class DeviceStateMapper {

    public DeviceStateMessage messageToDeviceState(String message) {

        DeviceStateMessage deviceStatusMessage = new DeviceStateMessage();

        // Extract deviceId
        deviceStatusMessage.setDeviceId(extractLongValue(message, "\"deviceId\"\\s*:\\s*(\\d+)"));

        // Extract name
        deviceStatusMessage.setDeviceName(extractStringValue(message, "\"deviceName\"\\s*:\\s*\"([^\"]+)\""));

        deviceStatusMessage.setUsername(extractStringValue(message, "\"username\"\\s*:\\s*\"([^\"]+)\""));

        // Extract value (assuming it's the "online" field)
        deviceStatusMessage.setIsOn(extractBooleanValue(message, "\"isOn\"\\s*:\\s*(true|false)"));

        deviceStatusMessage.setSuccess(extractBooleanValue(message, "\"success\"\\s*:\\s*(true|false)"));


        // Extract timestamp and convert to LocalDateTime
        String timestampStr = extractStringValue(message, "\"timestamp\"\\s*:\\s*\"([^\"]+)\"");
        LocalDateTime timestamp = LocalDateTime.parse(timestampStr, DateTimeFormatter.ISO_DATE_TIME);
        deviceStatusMessage.setTimestamp(timestamp);

        return deviceStatusMessage;
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
