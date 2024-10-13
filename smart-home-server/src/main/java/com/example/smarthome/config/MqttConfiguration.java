package com.example.smarthome.config;

import com.example.smarthome.DTO.Devices.VEU_devices.ChargingVehicleDTO;
import com.example.smarthome.DTO.MQTT.models.*;
import com.example.smarthome.mapper.*;
import com.example.smarthome.model.Device;
import com.example.smarthome.model.PKA_devices.THSensor;
import com.example.smarthome.model.SPU_devices.Gate;
import com.example.smarthome.model.SPU_devices.Lamp;
import com.example.smarthome.model.VEU_devices.HomeBattery;
import com.example.smarthome.model.VEU_devices.SolarPanelSystem;
import com.example.smarthome.model.Vehicle;
import com.example.smarthome.repository.DeviceRepository;
import com.example.smarthome.repository.VehicleRepository;
import com.example.smarthome.service.DeviceActionService;
import com.example.smarthome.service.InfluxDbService;
import com.example.smarthome.service.VEU_devices.CarChargerService;
import com.example.smarthome.service.VEU_devices.SolarPanelSystemService;
import org.eclipse.paho.mqttv5.client.*;
import org.eclipse.paho.mqttv5.client.persist.MemoryPersistence;
import org.eclipse.paho.mqttv5.common.MqttException;
import org.eclipse.paho.mqttv5.common.MqttMessage;
import org.eclipse.paho.mqttv5.common.packet.MqttProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.Objects;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import static io.lettuce.core.pubsub.PubSubOutput.Type.message;

@Configuration
@EnableScheduling
public class MqttConfiguration {
    private final String broker;
    private final String username;
    private final String password;
    private final String uniqueClientIdentifier;
    private final InfluxDbService influxDbService;

    private final DeviceRepository deviceRepository;

    private final DeviceActionService deviceActionService;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final SolarPanelSystemService solarPanelSystemService;

    private final VehicleRepository vehicleRepository;
    private final CarChargerService carChargerService;

    public MqttConfiguration(Environment env, InfluxDbService influxDbService, DeviceRepository deviceRepository,
                             SimpMessagingTemplate simpMessagingTemplate, SolarPanelSystemService solarPanelSystemService,
                             VehicleRepository vehicleRepository, DeviceActionService deviceActionService,
                             CarChargerService carChargerService) {
        this.broker = String.format("tcp://%s:%s", env.getProperty("mqtt.host"),
                env.getProperty("mqtt.port"));
        this.username = env.getProperty("mqtt.username");
        this.password = env.getProperty("mqtt.password");
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.vehicleRepository = vehicleRepository;
        this.uniqueClientIdentifier = UUID.randomUUID().toString();
        this.influxDbService = influxDbService;
        this.deviceRepository = deviceRepository;
        this.solarPanelSystemService = solarPanelSystemService;
        this.deviceActionService =deviceActionService;
        this.carChargerService = carChargerService;
    }

    @Bean
    public IMqttClient mqttClient() throws Exception {
        MqttClient client = new MqttClient(this.broker, this.uniqueClientIdentifier, new MemoryPersistence());
        client.setCallback(new MessageCallback(this.influxDbService, this.deviceRepository, this.simpMessagingTemplate,
                this.solarPanelSystemService, this.vehicleRepository, this.deviceActionService, this.carChargerService));
        MqttConnectionOptions options = new MqttConnectionOptions();
        options.setCleanStart(false);
        options.setAutomaticReconnect(true);
        options.setUserName(this.username);
        options.setPassword(Objects.requireNonNull(this.password).getBytes());
        client.connect(options);

        client.subscribe("+/isOnline", 2);
        client.subscribe("+/lamps", 2);
        client.subscribe("+/gates", 2);
        client.subscribe("+/temperature", 2);
        client.subscribe("+/humidity", 2);
        client.subscribe("+/switchIsOn", 2);
        client.subscribe("+/solarPanels", 2);
        client.subscribe("homeBattery", 2);
        client.subscribe("carCharger", 2);

        return client;
    }

    public static class MessageCallback implements MqttCallback {
        private static final Logger LOGGER = LoggerFactory.getLogger(MessageCallback.class);
        private final InfluxDbService influxDbService;
        private final DeviceRepository deviceRepository;
        private final Map<Integer, LocalDateTime> lastMessageTime = new ConcurrentHashMap<>();
        private final SimpMessagingTemplate simpMessagingTemplate;
        private final SolarPanelSystemService solarPanelSystemService;

        private final DeviceActionService deviceActionService;

        private final VehicleRepository vehicleRepository;
        private final CarChargerService carChargerService;

        public MessageCallback(InfluxDbService influxDbService, DeviceRepository deviceRepository,
                               SimpMessagingTemplate simpMessagingTemplate, SolarPanelSystemService solarPanelSystemService,
                               VehicleRepository vehicleRepository,DeviceActionService deviceActionService,
                               CarChargerService carChargerService) {
            super();
            this.influxDbService = influxDbService;
            this.deviceRepository = deviceRepository;
            this.simpMessagingTemplate = simpMessagingTemplate;
            this.solarPanelSystemService = solarPanelSystemService;
            this.deviceActionService =deviceActionService;
            this.vehicleRepository = vehicleRepository;
            this.carChargerService = carChargerService;

        }

        @Override
        public void disconnected(MqttDisconnectResponse mqttDisconnectResponse) {
            LOGGER.warn("disconnected: {}", mqttDisconnectResponse.getReasonString());
        }

        @Override
        public void mqttErrorOccurred(MqttException e) {
            LOGGER.error("error: {}", e.getMessage());
        }

        @Override public void messageArrived(String topic, MqttMessage mqttMessage) throws Exception {
            LOGGER.debug("topic: {}, message: {}", topic, mqttMessage);

            String message = new String(mqttMessage.getPayload());

            if (topic.endsWith("/isOnline")) {
                handleIsOnline(message, topic);
            } else if (topic.endsWith("/switchIsOn")) {
                handleSwitchIsOn(message);
            } else if (topic.endsWith("/lamps")) {
                handleMeasurements(message, topic);
            } else if (topic.endsWith("/gates")) {
                handleGate(message, topic);
            } else if (topic.endsWith("/temperature") || topic.endsWith("/humidity")) {
                handleDHT(message, topic);
            } else if (topic.endsWith("/solarPanels")) {
                handleSolarPanel(message, topic);
            } else if (topic.endsWith("carCharger")) {
                handleCarCharger(message, topic);
            }else if (topic.endsWith("homeBattery")) {
                handleHomeBattery(message, topic);
            }else {
                // Handle other cases or log an unknown topic
                LOGGER.warn("Unknown topic: {}", topic);
            }
        }

        private void handleCarCharger(String message, String topic){
            try{
                VehicleChargeMapper vehicleChargeMapper = new VehicleChargeMapper();
                ChargingVehicleDTO chargingVehicleDTO = vehicleChargeMapper.messageToChargingVehicle(message);
                carChargerService.connectVehicleToCharger(chargingVehicleDTO);
                LOGGER.info("\n" + topic + "\n" + message);
            }
            catch (Exception e){
                System.out.println(e);
            }

        }
        private void handleGate(String message, String topic) {
            RegistrationMapper measurementMapper = new RegistrationMapper();
            RegistrationMessage measurement = measurementMapper.messageToRegistration(message);
            Gate device = (Gate) deviceRepository.findById(measurement.getDeviceId()).orElse(null);

            try{
                if (device != null) {
                    lastMessageTime.put(device.getId(), LocalDateTime.now());
                    device.setIsOnline(true);

                    if (device.getGateMode()) {
                        List<Vehicle> allVehicles = this.vehicleRepository.findAll();
                        for (Vehicle vehicle : allVehicles) {
                            if (vehicle.getRegistration().equals(measurement.getRegistrationNumber())) {
                                device.setIsGateOn(true);
                                measurement.setIsPassed(true);
                                deviceRepository.save(device);
                                String actionName = measurement.getRegistrationNumber() + " passed in private mode.";
                                deviceActionService.createActionNoUser(device, actionName);

                                break;
                            }
                            else{
                                device.setIsGateOn(false);
                                measurement.setIsPassed(false);
                                deviceRepository.save(device);
                            }
                        }
                    } else {
                        measurement.setIsPassed(true);
                        device.setIsGateOn(true);

                        String actionName = measurement.getRegistrationNumber() + " passed in public mode.";
                        deviceActionService.createActionNoUser(device, actionName);
                        deviceRepository.save(device);
                    }


                    this.influxDbService.writeRegistration(measurement);
                    this.simpMessagingTemplate.convertAndSend(topic, message);
                }
            }catch (Exception e){
                System.out.println(e);
            }


        }
        private void handleSwitchIsOn(String message){
            DeviceStateMapper deviceStatusMapper = new DeviceStateMapper();
            DeviceStateMessage deviceStatusMessage = deviceStatusMapper.messageToDeviceState(message);
            if (deviceStatusMessage.getSuccess()) {
                Long longValue = deviceStatusMessage.getDeviceId();
                int intValue;
                if (longValue <= Integer.MAX_VALUE && longValue >= Integer.MIN_VALUE) {
                    intValue = longValue.intValue();
                    this.solarPanelSystemService.turnOnOffSolarPanelSystem(intValue, deviceStatusMessage.getUsername());
                } else {
                    throw new IllegalArgumentException("The Long value is too large to fit into an Integer");
                }
            }
        }
        private void handleIsOnline(String message, String topic){
            try{
                DeviceStatusMapper deviceStatusMapper = new DeviceStatusMapper();
                DeviceStatusMessage deviceStatusMessage = deviceStatusMapper.messageToMeasurement(message);
                deviceStatusMessage.setTopic(topic);

                Device device = deviceRepository.findById(deviceStatusMessage.getDeviceId()).orElse(null);
                if (device != null) {
                    device.setIsOnline(deviceStatusMessage.getValue());
                    deviceRepository.save(device);
                    try{
                        if(!device.getIsOnline()){
                            device.setOnOff(false);
                            deviceRepository.save(device);
                        }
                    }
                    catch(Exception e){
                        System.out.println(e);
                    }

                    this.influxDbService.writeIsOnline(deviceStatusMessage);
                    this.simpMessagingTemplate.convertAndSend(topic, message);
                }
            }
            catch(Exception e){
                System.out.println(e);
            }

        }
        private void handleMeasurements(String message, String topic){
            MeasurementMapper measurementMapper = new MeasurementMapper();
            Measurement measurement = measurementMapper.messageToMeasurement(message);
            measurement.setTopic(topic);
            Lamp device = (Lamp) deviceRepository.findById(measurement.getDeviceId()).orElse(null);
            if (device != null) {
                lastMessageTime.put(device.getId(), LocalDateTime.now());
                device.setIsOnline(true);
                device.setValue(measurement.getValue());
                if(device.getLampMode()){
                    device.setLampIsOn(measurement.getValue()<60);
                }

                deviceRepository.save(device);
                this.influxDbService.writeMeasurement(measurement);
                this.simpMessagingTemplate.convertAndSend(topic, message);
            }
        }

        private void handleDHT(String message, String topic){
            MeasurementMapper measurementMapper = new MeasurementMapper();
            Measurement measurement = measurementMapper.messageToMeasurement(message);
            measurement.setTopic(topic);

            THSensor device = (THSensor) deviceRepository.findById(measurement.getDeviceId()).orElse(null);
            if (device != null) {
                lastMessageTime.put(device.getId(), LocalDateTime.now());
                device.setIsOnline(true);
                device.setTopic(topic);
                device.setValue(measurement.getValue());
                deviceRepository.save(device);
                if (topic.contains("temperature")) {
                    this.influxDbService.writeTemperature(measurement);
                } else {
                    this.influxDbService.writeHumidity(measurement);
                }
                this.simpMessagingTemplate.convertAndSend(topic, message);
            }
        }

        private void handleSolarPanel(String message, String topic){
           try{
                        MeasurementMapper measurementMapper = new MeasurementMapper();
                        Measurement measurement = measurementMapper.messageToMeasurement(message);
                        measurement.setTopic(topic);
                        SolarPanelSystem device = (SolarPanelSystem) deviceRepository.findById(measurement.getDeviceId()).orElse(null);
                        if (device != null) {
                            lastMessageTime.put(device.getId(), LocalDateTime.now());
                            device.setIsOnline(true);
                            device.setValue(measurement.getValue());
                            this.deviceRepository.save(device);
                            this.solarPanelSystemService.giveEnergyToBatteries(device.getElectricityGenerated(), device.getRealEstate().getId());
                            this.influxDbService.writeSolarPanels(measurement);
                            this.simpMessagingTemplate.convertAndSend(topic, message);
                            //LOGGER.info("\n" + topic + "\n" + message);
                        }
                    }
                    catch(Exception e){
                        System.out.println(e);
                    }
        }
        private void handleHomeBattery(String message, String topic){
            try{
                HomeBatteryMessageMapper measurementMapper = new HomeBatteryMessageMapper();
                HomeBatteryMessage measurement = measurementMapper.messageToHomeBattery(message);
                if(measurement.getDirection()==0.0){
                    HomeBattery device =  (HomeBattery) deviceRepository.findById(measurement.getDeviceId()).orElse(null);
                    if (device != null) {
                        lastMessageTime.put(device.getId(), LocalDateTime.now());
                        device.setIsOnline(true);
                        this.deviceRepository.save(device);
                        this.influxDbService.writeHomeBattery(measurement);
                        this.simpMessagingTemplate.convertAndSend(topic, message);
                    }
                }

            }
            catch (Exception e){
                System.out.println(e);
            }
        }


        @Scheduled(fixedRate = 10000)
        public void checkDeviceStatus() {
            LocalDateTime now = LocalDateTime.now();
            lastMessageTime.forEach((deviceId, timestamp) -> {
                if (Duration.between(timestamp, now).getSeconds() >= 10) {
                    Device device = deviceRepository.findById(Long.valueOf(deviceId)).orElse(null);
                    if (device != null) {
                        device.setIsOnline(false);
                        device.setOnOff(false);
                        deviceRepository.save(device);
                    }
                }
            });
        }

        @Override
        public void deliveryComplete(IMqttToken iMqttToken) {
            LOGGER.debug("delivery complete, message id: {}", iMqttToken.getMessageId());
        }

        @Override
        public void connectComplete(boolean b, String s) {
            LOGGER.debug("connect complete, status: {} {}", b, s);
        }

        @Override
        public void authPacketArrived(int i, MqttProperties mqttProperties) {
            LOGGER.debug("auth packet arrived , status: {} {}", i, mqttProperties.getAuthenticationMethod());
        }

    }
}
