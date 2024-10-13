package com.example.smarthome.mapper;

import com.example.smarthome.DTO.Devices.VEU_devices.ChargingVehicleDTO;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class VehicleChargeMapper {

    public ChargingVehicleDTO messageToChargingVehicle(String message) {

        ChargingVehicleDTO measurement = new ChargingVehicleDTO();

        // Extract
        measurement.setId(extractLongValue(message, "\"id\"\\s*:\\s*(\\d+)"));

        // Extract name
        measurement.setBatteryCapacity(extractDoubleValue(message, "\"batteryCapacity\"\\s*:\\s*(-?[\\d.]+)"));

        // Extract value
        measurement.setRegistrationNumber(extractStringValue(message, "\"registrationNumber\"\\s*:\\s*\"([^\"]+)\""));

        measurement.setCurrenLevelBattery(extractDoubleValue(message, "\"currenLevelBattery\"\\s*:\\s*(-?[\\d.]+)"));
        measurement.setWantedLevelBattery(extractDoubleValue(message, "\"wantedLevelBattery\"\\s*:\\s*(-?[\\d.]+)"));

        measurement.setCarChargerId(extractLongValue(message, "\"carChargerId\"\\s*:\\s*(\\d+)"));


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

    private Double extractDoubleValue(String message, String regex) {
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(message);
        if (matcher.find()) {
            return Double.parseDouble(matcher.group(1));
        }
        return null; // Or throw an exception
    }
}
