package com.example.smarthome.service;

import com.example.smarthome.DTO.Devices.ActionDTO;
import com.example.smarthome.DTO.Devices.OnlineStatusDTO;
import com.example.smarthome.DTO.Devices.VEU_devices.EnergyTransactionDTO;
import com.example.smarthome.DTO.MQTT.models.DeviceStatusMessage;
import com.example.smarthome.DTO.MQTT.models.HomeBatteryMessage;
import com.example.smarthome.DTO.MQTT.models.Measurement;
import com.example.smarthome.DTO.Devices.TimePeriodDTO;
import com.example.smarthome.DTO.MQTT.models.RegistrationMessage;
import com.example.smarthome.repository.RealEstateRepository;
import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.QueryApi;
import com.influxdb.client.WriteApi;
import com.influxdb.client.domain.WritePrecision;
import com.influxdb.client.write.Point;
import com.influxdb.query.FluxRecord;
import com.influxdb.query.FluxTable;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class InfluxDbService {
    private final InfluxDBClient influxDBClient;
    private final RealEstateRepository realEstateRepository;

    public List<OnlineStatusDTO> getOnlineStatusByDeviceId(TimePeriodDTO periodDTO,Integer id) {
        if (periodDTO.getTo() == null) {
            periodDTO.setTo(LocalDateTime.now());
        }
        if(periodDTO.getFrom() == null){
            if(periodDTO.getPeriodType().equals("m")){
                periodDTO.setFrom(periodDTO.getTo().minusMonths(1));
            } else if (periodDTO.getPeriodType().equals("w")) {
                periodDTO.setFrom(periodDTO.getTo().minusDays(7));
            }else {
                periodDTO.setFrom(periodDTO.getTo().minusHours(periodDTO.getPeriod()));
            }
        }
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss'Z'");

        String fluxQuery = String.format(
                "from(bucket: \"smart-home\")\n" +
                        "  |> range(start: %s, stop: %s)\n" +
                        "  |> filter(fn: (r) => r[\"_measurement\"] == \"isOnline\" and r[\"deviceId\"] == \"%d\")",
                periodDTO.getFrom().minusHours(1).format(formatter), periodDTO.getTo().minusHours(1).format(formatter),id);

        System.out.println(fluxQuery);

        QueryApi queryApi = influxDBClient.getQueryApi();
        List<FluxTable> tables = new ArrayList<>();

        try {
            tables = queryApi.query(fluxQuery);
        } catch (Exception e) {
            System.out.println(e);
        }

        List<OnlineStatusDTO> onlineStatusList = new ArrayList<>();

        for (FluxTable table : tables) {
            for (FluxRecord record : table.getRecords()) {
                OnlineStatusDTO onlineStatusDTO = new OnlineStatusDTO();
                onlineStatusDTO.setDeviceId(id);
                onlineStatusDTO.setName(Objects.requireNonNull(record.getValueByKey("name")).toString()); // Set the name as needed
                onlineStatusDTO.setTimestamp(parseTimestamp(Objects.requireNonNull(record.getValueByKey("_time")).toString()));
                onlineStatusDTO.setOnlineStatus((Boolean) record.getValue());

                onlineStatusList.add(onlineStatusDTO);

            }
        }
        return onlineStatusList;
    }

    public  List<Measurement> getMeasurements(TimePeriodDTO periodDTO, Integer id){
        if (periodDTO.getTo() == null) {
            periodDTO.setTo(LocalDateTime.now());
        }
        String periodAggregate = "1s";

        if(periodDTO.getFrom() == null){
            if(periodDTO.getPeriodType().equals("m")){
                periodAggregate = "1d";
                periodDTO.setFrom(periodDTO.getTo().minusMonths(1));
            } else if (periodDTO.getPeriodType().equals("w")) {
                periodAggregate = "6h";
                periodDTO.setFrom(periodDTO.getTo().minusDays(7));
            }else {
                if(periodDTO.getPeriod() > 1){
                    periodAggregate = "1m";
                }
                periodDTO.setFrom(periodDTO.getTo().minusHours(periodDTO.getPeriod()));
            }
        }
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss'+01:00'");


        String fluxQuery = String.format("from(bucket: \"smart-home\")\n" +
                        "          |> range(start: %s, stop: %s)\n" +
                        "          |> filter(fn: (r) => r[\"_measurement\"] == \"temperature\" or r[\"_measurement\"] == \"humidity\" or r[\"_measurement\"] == \"lamps\")\n" +
                        "          |> filter(fn: (r) => r[\"_field\"] == \"value\")\n" +
                        "          |> filter(fn: (r) => r[\"deviceId\"] == \"%d\")\n" +
                        "          |> aggregateWindow(every: %s, fn: mean, createEmpty: false)",
                periodDTO.getFrom().format(formatter), periodDTO.getTo().format(formatter), id, periodAggregate);
        System.out.println(fluxQuery);



        QueryApi queryApi = influxDBClient.getQueryApi();

        List<FluxTable> tables = new ArrayList<>();
        try{
            tables = queryApi.query(fluxQuery);

        }catch (Exception E){
            System.out.println(E);

        }
        List<Measurement> measurements = new ArrayList<>();
        for (FluxTable table : tables) {
            for (FluxRecord record : table.getRecords()) {
                if(record.getValueByKey("_value") instanceof Double){
                    Measurement measurement = new Measurement();
                    measurement.setTimestamp(parseTimestamp(Objects.requireNonNull(record.getValueByKey("_time")).toString()));
                    measurement.setValue((Double) record.getValueByKey("_value"));
                    measurement.setDeviceId(Long.valueOf(Objects.requireNonNull(record.getValueByKey("deviceId")).toString()));
                    measurement.setName(Objects.requireNonNull(record.getValueByKey("name")).toString());
                    measurement.setTopic(Objects.requireNonNull(record.getValueByKey("topic")).toString());
                    measurements.add(measurement);
                }
            }
        }
        return measurements;
    }
    public List<ActionDTO> getActionsByDeviceId(Integer id){
        String fluxQuery = String.format(
                "from(bucket: \"smart-home\")\n" +
                        "  |> range(start: -9999w)\n" +
                        "  |> filter(fn: (r) => r[\"_measurement\"] == \"actions\" and r[\"deviceId\"] == \"%d\")",
                id);
        QueryApi queryApi = influxDBClient.getQueryApi();

        List<FluxTable> tables = new ArrayList<>();
        try{
            tables = queryApi.query(fluxQuery);

        }catch (Exception E){
            System.out.println(E);

        }
        List<ActionDTO> measurements = new ArrayList<>();
        for (FluxTable table : tables) {
            for (FluxRecord record : table.getRecords()) {
                ActionDTO measurement = new ActionDTO();
                measurement.setTimestamp(parseTimestamp(Objects.requireNonNull(record.getValueByKey("_time")).toString()));
                measurement.setUserId(Integer.valueOf(Objects.requireNonNull(record.getValueByKey("userId")).toString()));
                measurement.setDeviceId(Integer.valueOf(Objects.requireNonNull(record.getValueByKey("deviceId")).toString()));
                measurement.setUsername(Objects.requireNonNull(record.getValueByKey("username")).toString());
                measurement.setUserFullName(Objects.requireNonNull(record.getValueByKey("userFullName")).toString());
                measurement.setActionName(String.valueOf(record.getValue()));
                measurements.add(measurement);
//                System.out.println(measurement);
            }
        }
        return measurements;
    }

    public  List<EnergyTransactionDTO> getToGridTransactionsByCity(TimePeriodDTO periodDTO, String city){
        if (periodDTO.getTo() == null) {
            periodDTO.setTo(LocalDateTime.now());
        }
        if(periodDTO.getFrom() == null){
            if(periodDTO.getPeriodType().equals("m")){
                periodDTO.setFrom(periodDTO.getTo().minusMonths(1));
            } else if (periodDTO.getPeriodType().equals("w")) {
                periodDTO.setFrom(periodDTO.getTo().minusDays(7));
            }else {
                periodDTO.setFrom(periodDTO.getTo().minusHours(periodDTO.getPeriod()));
            }
        }
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss'Z'");

        String periodAggregate = "1s";

        if(periodDTO.getFrom() == null){
            if(periodDTO.getPeriodType().equals("m")){
                periodAggregate = "1d";
                periodDTO.setFrom(periodDTO.getTo().minusMonths(1));
            } else if (periodDTO.getPeriodType().equals("w")) {
                periodAggregate = "6h";
                periodDTO.setFrom(periodDTO.getTo().minusDays(7));
            }else {
                if(periodDTO.getPeriod() > 1){
                    periodAggregate = "1m";
                }
                periodDTO.setFrom(periodDTO.getTo().minusHours(periodDTO.getPeriod()));
            }
        }

        String fluxQuery = String.format("from(bucket: \"smart-home\")\n" +
                        "          |> range(start: %s, stop: %s)\n" +
                        "          |> filter(fn: (r) => r[\"_measurement\"] == \"energyTransaction\" and r[\"_field\"] == \"toGrid\" and r[\"realEstateCity\"] == \"%s\")\n" +
                        "          |> aggregateWindow(every: %s, fn: last, createEmpty: false)",
                periodDTO.getFrom().minusHours(1).format(formatter), periodDTO.getTo().minusHours(1).format(formatter), city, periodAggregate);
        System.out.println(fluxQuery);
        QueryApi queryApi = influxDBClient.getQueryApi();
        List<FluxTable> tables = new ArrayList<>();
        try{
            tables = queryApi.query(fluxQuery);

        }catch (Exception E){
            System.out.println(E);

        }
        List<EnergyTransactionDTO> measurements = new ArrayList<>();
        for (FluxTable table : tables) {
            for (FluxRecord record : table.getRecords()) {
                EnergyTransactionDTO measurement = new EnergyTransactionDTO();
                try{
                    if(record.getValueByKey("realEstateCity") != null){
                        measurement.setTimestamp(parseTimestamp(Objects.requireNonNull(record.getValueByKey("_time")).toString()));
                        measurement.setToGrid((Double) record.getValue());
                        measurement.setFromGrid(0.0);
                        measurement.setRealEstateCity((String) record.getValueByKey("realEstateCity"));
                        measurements.add(measurement);
                    }

                }catch (Exception e){
                    System.out.println("aaaa" + e);
                }
            }
        }
        //System.out.println(measurements);
        return measurements;
    }
    public  List<EnergyTransactionDTO> getFromGridTransactionsByCity(TimePeriodDTO periodDTO, String city){
        if (periodDTO.getTo() == null) {
            periodDTO.setTo(LocalDateTime.now());
        }
        if(periodDTO.getFrom() == null){
            if(periodDTO.getPeriodType().equals("m")){
                periodDTO.setFrom(periodDTO.getTo().minusMonths(1));
            } else if (periodDTO.getPeriodType().equals("w")) {
                periodDTO.setFrom(periodDTO.getTo().minusDays(7));
            }else {
                periodDTO.setFrom(periodDTO.getTo().minusHours(periodDTO.getPeriod()));
            }
        }
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss'Z'");

        String periodAggregate = "1s";

        if(periodDTO.getFrom() == null){
            if(periodDTO.getPeriodType().equals("m")){
                periodAggregate = "1d";
                periodDTO.setFrom(periodDTO.getTo().minusMonths(1));
            } else if (periodDTO.getPeriodType().equals("w")) {
                periodAggregate = "6h";
                periodDTO.setFrom(periodDTO.getTo().minusDays(7));
            }else {
                if(periodDTO.getPeriod() > 1){
                    periodAggregate = "1m";
                }
                periodDTO.setFrom(periodDTO.getTo().minusHours(periodDTO.getPeriod()));
            }
        }

        String fluxQuery = String.format("from(bucket: \"smart-home\")\n" +
                        "          |> range(start: %s, stop: %s)\n" +
                        "          |> filter(fn: (r) => r[\"_measurement\"] == \"energyTransaction\" and r[\"_field\"] == \"fromGrid\" and r[\"realEstateCity\"] == \"%s\")\n" +
                        "          |> aggregateWindow(every: %s, fn: last, createEmpty: false)",
                periodDTO.getFrom().minusHours(1).format(formatter), periodDTO.getTo().minusHours(1).format(formatter), city, periodAggregate);
        System.out.println(fluxQuery);
        QueryApi queryApi = influxDBClient.getQueryApi();

        List<FluxTable> tables = new ArrayList<>();
        try{
            tables = queryApi.query(fluxQuery);

        }catch (Exception E){
            System.out.println("bbbbb" + E);

        }
        List<EnergyTransactionDTO> measurements = new ArrayList<>();
        for (FluxTable table : tables) {
            for (FluxRecord record : table.getRecords()) {
                EnergyTransactionDTO measurement = new EnergyTransactionDTO();
                try{
                    if((record.getValueByKey("realEstateCity") != null)) {
                        measurement.setTimestamp(parseTimestamp(Objects.requireNonNull(record.getValueByKey("_time")).toString()));
                        measurement.setFromGrid((Double) record.getValue());
                        measurement.setToGrid(0.0);
                        measurement.setRealEstateCity(Objects.requireNonNull(record.getValueByKey("realEstateCity")).toString());
                        measurements.add(measurement);
                    }
                }catch (Exception e){
                    System.out.println(e);
                }
            }
        }
        return measurements;
    }
    public  List<EnergyTransactionDTO> getToGridTransactions(TimePeriodDTO periodDTO, Integer id){
        if (periodDTO.getTo() == null) {
            periodDTO.setTo(LocalDateTime.now());
        }
        if(periodDTO.getFrom() == null){
            if(periodDTO.getPeriodType().equals("m")){
                periodDTO.setFrom(periodDTO.getTo().minusMonths(1));
            } else if (periodDTO.getPeriodType().equals("w")) {
                periodDTO.setFrom(periodDTO.getTo().minusDays(7));
            }else {
                periodDTO.setFrom(periodDTO.getTo().minusHours(periodDTO.getPeriod()));
            }
        }
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss'Z'");

        String periodAggregate = "1s";

        if(periodDTO.getFrom() == null){
            if(periodDTO.getPeriodType().equals("m")){
                periodAggregate = "1d";
                periodDTO.setFrom(periodDTO.getTo().minusMonths(1));
            } else if (periodDTO.getPeriodType().equals("w")) {
                periodAggregate = "6h";
                periodDTO.setFrom(periodDTO.getTo().minusDays(7));
            }else {
                if(periodDTO.getPeriod() > 1){
                    periodAggregate = "1m";
                }
                periodDTO.setFrom(periodDTO.getTo().minusHours(periodDTO.getPeriod()));
            }
        }

        String fluxQuery = String.format("from(bucket: \"smart-home\")\n" +
                        "          |> range(start: %s, stop: %s)\n" +
                        "          |> filter(fn: (r) => r[\"_measurement\"] == \"energyTransaction\" and r[\"_field\"] == \"toGrid\" and r[\"realEstateId\"] == \"%d\")\n" +
                        "          |> aggregateWindow(every: %s, fn: last, createEmpty: false)",
                periodDTO.getFrom().minusHours(1).format(formatter), periodDTO.getTo().minusHours(1).format(formatter), id, periodAggregate);
        System.out.println(fluxQuery);
        QueryApi queryApi = influxDBClient.getQueryApi();
        List<FluxTable> tables = new ArrayList<>();
        try{
            tables = queryApi.query(fluxQuery);

        }catch (Exception E){
            System.out.println(E);

        }
        List<EnergyTransactionDTO> measurements = new ArrayList<>();
        for (FluxTable table : tables) {
            for (FluxRecord record : table.getRecords()) {
                EnergyTransactionDTO measurement = new EnergyTransactionDTO();
                try{
                    measurement.setTimestamp(parseTimestamp(Objects.requireNonNull(record.getValueByKey("_time")).toString()));
                    measurement.setToGrid((Double) record.getValue());
                    measurement.setFromGrid(0.0);
                    measurement.setRealEstateId(realEstateRepository.findOneById(Integer.valueOf(Objects.requireNonNull(record.getValueByKey("realEstateId")).toString())).getId());
                    measurement.setRealEstateCity(realEstateRepository.findOneById(Integer.valueOf(Objects.requireNonNull(record.getValueByKey("realEstateId")).toString())).getAddress().getCity());
                    measurements.add(measurement);
                }catch (Exception e){
                    System.out.println("influx kastovanje" + e);
                    System.out.println(e);
                }
            }
        }
        //System.out.println(measurements);
        return measurements;
    }
    public  List<EnergyTransactionDTO> getFromGridTransactions(TimePeriodDTO periodDTO, Integer id){
        if (periodDTO.getTo() == null) {
            periodDTO.setTo(LocalDateTime.now());
        }
        if(periodDTO.getFrom() == null){
            if(periodDTO.getPeriodType().equals("m")){
                periodDTO.setFrom(periodDTO.getTo().minusMonths(1));
            } else if (periodDTO.getPeriodType().equals("w")) {
                periodDTO.setFrom(periodDTO.getTo().minusDays(7));
            }else {
                periodDTO.setFrom(periodDTO.getTo().minusHours(periodDTO.getPeriod()));
            }
        }
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss'Z'");

        String periodAggregate = "1s";

        if(periodDTO.getFrom() == null){
            if(periodDTO.getPeriodType().equals("m")){
                periodAggregate = "1d";
                periodDTO.setFrom(periodDTO.getTo().minusMonths(1));
            } else if (periodDTO.getPeriodType().equals("w")) {
                periodAggregate = "6h";
                periodDTO.setFrom(periodDTO.getTo().minusDays(7));
            }else {
                if(periodDTO.getPeriod() > 1){
                    periodAggregate = "1m";
                }
                periodDTO.setFrom(periodDTO.getTo().minusHours(periodDTO.getPeriod()));
            }
        }


        String fluxQuery = String.format("from(bucket: \"smart-home\")\n" +
                        "          |> range(start: %s, stop: %s)\n" +
                        "          |> filter(fn: (r) => r[\"_measurement\"] == \"energyTransaction\" and r[\"_field\"] == \"fromGrid\" and r[\"realEstateId\"] == \"%d\")\n" +
                        "          |> aggregateWindow(every: %s, fn: mean, createEmpty: false)",
                periodDTO.getFrom().minusHours(1).format(formatter), periodDTO.getTo().minusHours(1).format(formatter), id, periodAggregate);
        System.out.println(fluxQuery);
        QueryApi queryApi = influxDBClient.getQueryApi();

        List<FluxTable> tables = new ArrayList<>();
        try{
            tables = queryApi.query(fluxQuery);

        }catch (Exception E){
            System.out.println("influx getFromGridTransactions" + E);

        }
        List<EnergyTransactionDTO> measurements = new ArrayList<>();
        for (FluxTable table : tables) {
            for (FluxRecord record : table.getRecords()) {
                EnergyTransactionDTO measurement = new EnergyTransactionDTO();
                try{
                    measurement.setTimestamp(parseTimestamp(Objects.requireNonNull(record.getValueByKey("_time")).toString()));
                    measurement.setFromGrid((Double) record.getValue());
                    measurement.setRealEstateId(realEstateRepository.findOneById(Integer.valueOf(Objects.requireNonNull(record.getValueByKey("realEstateId")).toString())).getId());
                    measurement.setToGrid(0.0);
                    measurement.setRealEstateCity(realEstateRepository.findOneById(Integer.valueOf(Objects.requireNonNull(record.getValueByKey("realEstateId")).toString())).getAddress().getCity());
                    measurements.add(measurement);
                }catch (Exception e){
                    System.out.println("influx kastovanje" + e);
                    System.out.println(e);
                }
            }
        }
        return measurements;
    }

    public static LocalDateTime parseTimestamp(String timestampStr) {
        Instant instant = Instant.parse(timestampStr);
        return LocalDateTime.ofInstant(instant, ZoneId.systemDefault());
    }

    public void writeMeasurement(Measurement measurement) {
        Point point = measurementToInfluxDBPoint(measurement);
        try (WriteApi writeApi = influxDBClient.makeWriteApi()) {
            writeApi.writePoint(point);
        }
    }
    public void writeIsOnline(DeviceStatusMessage deviceStatusMessage) {
        Point point = onlineStatusToInfluxDBPoint(deviceStatusMessage);
        try (WriteApi writeApi = influxDBClient.makeWriteApi()) {
            writeApi.writePoint(point);
        }
    }
    public void writeTemperature(Measurement measurement) {
        Point point = temperatureToInfluxDBPoint(measurement);
        try (WriteApi writeApi = influxDBClient.makeWriteApi()) {
            writeApi.writePoint(point);
        }
    }
    public void writeHumidity(Measurement measurement) {
        Point point = humidityToInfluxDBPoint(measurement);
        try (WriteApi writeApi = influxDBClient.makeWriteApi()) {
            writeApi.writePoint(point);
        }
    }
    public void writeSolarPanels(Measurement measurement) {
        Point point = solarPanelToInfluxDBPoint(measurement);
        try (WriteApi writeApi = influxDBClient.makeWriteApi()) {
            writeApi.writePoint(point);
        }
    }
    public void writeEnergyTransaction(EnergyTransactionDTO energyTransaction) {
        Point point = energyTransactionToInfluxDBPoint(energyTransaction);
        try (WriteApi writeApi = influxDBClient.makeWriteApi()) {
            writeApi.writePoint(point);
        }
    }
    public void writeHomeBattery(HomeBatteryMessage measurement) {
        Point point = homeBatteryToInfluxDBPoint(measurement);
        try (WriteApi writeApi = influxDBClient.makeWriteApi()) {
            writeApi.writePoint(point);
        }
    }
    public void writeAction(ActionDTO measurement) {
        Point point = actionToInfluxDBPoint(measurement);
        try (WriteApi writeApi = influxDBClient.makeWriteApi()) {
            writeApi.writePoint(point);
        }
    }
        public void writeRegistration(RegistrationMessage measurement) {
        Point point = gateToInfluxDBPoint(measurement);
        try (WriteApi writeApi = influxDBClient.makeWriteApi()) {
            writeApi.writePoint(point);
        }
    }


    private Point measurementToInfluxDBPoint(Measurement measurement) {
        return Point.measurement("lamps")
                .addTag("deviceId", String.valueOf(measurement.getDeviceId()))
                .addTag("topic", measurement.getTopic())
                .addTag("name", measurement.getName())
                .addField("value",  measurement.getValue())
                .time(Timestamp.valueOf(measurement.getTimestamp()).toInstant().toEpochMilli(), WritePrecision.MS);
    }
    private Point onlineStatusToInfluxDBPoint(DeviceStatusMessage deviceStatusMessage) {
        return Point.measurement("isOnline")
                .addTag("deviceId", String.valueOf(deviceStatusMessage.getDeviceId()))
                .addTag("topic", deviceStatusMessage.getTopic())
                .addTag("name", deviceStatusMessage.getDeviceName())
                .addField("value", deviceStatusMessage.getValue())
                .time(Timestamp.valueOf(deviceStatusMessage.getTimestamp()).toInstant().toEpochMilli(), WritePrecision.MS);
    }




    private Point temperatureToInfluxDBPoint(Measurement measurement) {
        return Point.measurement("temperature")
                .addTag("deviceId", String.valueOf(measurement.getDeviceId()))
                .addTag("topic", measurement.getTopic())
                .addTag("name", measurement.getName())
                .addField("value", measurement.getValue())
                .time(Timestamp.valueOf(measurement.getTimestamp()).toInstant().toEpochMilli(), WritePrecision.MS);
    }
    private Point humidityToInfluxDBPoint(Measurement measurement) {
        return Point.measurement("humidity")
                .addTag("deviceId", String.valueOf(measurement.getDeviceId()))
                .addTag("topic", measurement.getTopic())
                .addTag("name", measurement.getName())
                .addField("value", measurement.getValue())
                .time(Timestamp.valueOf(measurement.getTimestamp()).toInstant().toEpochMilli(), WritePrecision.MS);
    }

    private Point solarPanelToInfluxDBPoint(Measurement measurement) {

        return Point.measurement("solarPanels")
                .addTag("deviceId", String.valueOf(measurement.getDeviceId()))
                .addTag("topic", measurement.getTopic())
                .addTag("name", measurement.getName())
                .addField("value", measurement.getValue())
                .time(Timestamp.valueOf(measurement.getTimestamp()).toInstant().toEpochMilli(), WritePrecision.MS);
    }

    private Point gateToInfluxDBPoint(RegistrationMessage measurement) {
        return Point.measurement("gates")
                .addTag("deviceId", String.valueOf(measurement.getDeviceId()))
                .addTag("name", measurement.getName())
                .addTag("isPassed", String.valueOf(measurement.getIsPassed()))
                .addField("registrationNumber", measurement.getRegistrationNumber())
                .time(Timestamp.valueOf(measurement.getTimestamp()).toInstant().toEpochMilli(), WritePrecision.MS);
    }
    private Point energyTransactionToInfluxDBPoint(EnergyTransactionDTO energyTransaction) {

        return Point.measurement("energyTransaction")
                .addTag("realEstateId", String.valueOf(energyTransaction.getRealEstateId()))
                .addTag("realEstateCity", energyTransaction.getRealEstateCity())
                .addField("toGrid", energyTransaction.getToGrid())
                .addField("fromGrid", energyTransaction.getFromGrid())
                .time(Timestamp.valueOf(energyTransaction.getTimestamp()).toInstant().toEpochMilli(), WritePrecision.MS);
    }
    private Point homeBatteryToInfluxDBPoint(HomeBatteryMessage measurement) {

        return Point.measurement("homeBattery")
                .addTag("deviceId", String.valueOf(measurement.getDeviceId()))
                .addTag("direction", String.valueOf(measurement.getDirection()))
                .addTag("name", measurement.getName())
                .addField("value", measurement.getValue())
                .time(Timestamp.valueOf(measurement.getTimestamp()).toInstant().toEpochMilli(), WritePrecision.MS);
    }
    private Point actionToInfluxDBPoint(ActionDTO measurement) {
        return Point.measurement("actions")
                .addTag("deviceId", String.valueOf(measurement.getDeviceId()))
                .addTag("userId", String.valueOf(measurement.getUserId()))
                .addTag("username", measurement.getUsername())
                .addTag("userFullName", measurement.getUserFullName())
                .addField("actionName", measurement.getActionName())
                .time(Timestamp.valueOf(measurement.getTimestamp()).toInstant().toEpochMilli(), WritePrecision.MS);
    }

}
