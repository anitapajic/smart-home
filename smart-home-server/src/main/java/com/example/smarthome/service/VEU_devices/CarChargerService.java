package com.example.smarthome.service.VEU_devices;

import com.example.smarthome.DTO.Devices.NewDeviceDTO;
import com.example.smarthome.DTO.Devices.VEU_devices.ChargingVehicleDTO;
import com.example.smarthome.config.MqttConfiguration;
import com.example.smarthome.model.RealEstate;
import com.example.smarthome.model.VEU_devices.*;
import com.example.smarthome.repository.DeviceRepository;
import com.example.smarthome.repository.RealEstateRepository;
import com.example.smarthome.repository.VEU_devices.CarChargerRepository;
import com.example.smarthome.service.DeviceActionService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Service
@RequiredArgsConstructor
public class CarChargerService {
    private final RealEstateRepository realEstateRepository;
    private final DeviceRepository deviceRepository;
    private final CarChargerRepository carChargerRepository;
    private final DeviceActionService deviceActionService;
    private final ChargingVehicleService chargingVehicleService;
    private final Map<Long, ExecutorService> chargerExecutors = new ConcurrentHashMap<>();
    private final HomeBatteryService homeBatteryService;
    private final ChargingSessionService chargingSessionService;
    private final EnergyTransactionService energyTransactionService;

    private static final org.slf4j.Logger LOGGER = LoggerFactory.getLogger(MqttConfiguration.MessageCallback.class);

    public CarCharger addCarCharger(NewDeviceDTO newDeviceDTO){
        CarCharger carCharger = new CarCharger();
        carCharger.setName(newDeviceDTO.getName());
        carCharger.setType(newDeviceDTO.getType());
        carCharger.setPicture(newDeviceDTO.getPicture());
        carCharger.setVariant(newDeviceDTO.getVariant());
        carCharger.setIsOnline(false);
        carCharger.setPowerStrenght(newDeviceDTO.getPowerStrenght());
        carCharger.setRealEstate(realEstateRepository.findOneById(newDeviceDTO.getRealEstateId()));
        carCharger.setVehicleCapacity(newDeviceDTO.getVehicleCapacity());
        carCharger.setChargerStrength(newDeviceDTO.getChargerStrength());

        deviceRepository.save(carCharger);
        CarCharger saved = carChargerRepository.save(carCharger);

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetails userDetails = (UserDetails) auth.getPrincipal();

        String actionName = saved.getName() + " created.";
        deviceActionService.createAction(saved, actionName, userDetails.getUsername());

        this.registerOrUpdateCharger(saved);

        return carCharger;
    }
    public void registerOrUpdateCharger(CarCharger charger) {
        chargerExecutors.compute(Long.valueOf(charger.getId()), (id, existingExecutor) -> {
            if (existingExecutor != null && !existingExecutor.isShutdown()) {
                existingExecutor.shutdown();
            }
            return Executors.newFixedThreadPool(charger.getVehicleCapacity());
        });
    }

    public List<ChargingVehicle> getConnectedVehicleDTOs(Long chargerId) {
        CarCharger charger = carChargerRepository.findById(chargerId)
                .orElseThrow(() -> new RuntimeException("Charger not found"));
        return charger.getConnectedVehicles();
    }
    public void connectVehicleToCharger(ChargingVehicleDTO vehicle) {
        CarCharger carCharger = carChargerRepository.findById(vehicle.getCarChargerId()).orElse(null);
        if(carCharger != null){
            registerOrUpdateCharger(carCharger);
        }
        else{
            throw new IllegalStateException("Charger does not exist.");
        }
        ExecutorService executor = chargerExecutors.get(vehicle.getCarChargerId());
        if (executor == null) {
            throw new IllegalStateException("Charger not registered or does not exist.");
        }
        int currentConnectedVehicles = getConnectedVehicleDTOs(vehicle.getCarChargerId()).size();
        CarCharger charger = carChargerRepository.findById(vehicle.getCarChargerId())
                .orElseThrow(() -> new RuntimeException("Charger not found"));

        if (currentConnectedVehicles < charger.getVehicleCapacity()) {
            executor.submit(() -> startCharging(vehicle));
            System.out.println("Car is charging!");

        } else {
            System.out.println("Car charger is full!");
        }
    }

    private void startCharging(ChargingVehicleDTO vehicleDTO) {
        try {
            ChargingSession chargingSession = new ChargingSession();
            CarCharger carCharger = carChargerRepository.findById(vehicleDTO.getCarChargerId()).orElse(null);
            ChargingVehicle vehicle = chargingVehicleService.findById(vehicleDTO.getId());
            if (vehicle == null) {
                vehicle = new ChargingVehicle();
                vehicle.setCarCharger(carCharger);
                vehicle.setRegistrationNumber(vehicleDTO.getRegistrationNumber());
            }
            vehicle.setBatteryCapacity(vehicleDTO.getBatteryCapacity());
            vehicle.setCurrenLevelBattery(vehicleDTO.getCurrenLevelBattery());
            vehicle.setWantedLevelBattery(vehicleDTO.getWantedLevelBattery());
            chargingVehicleService.save(vehicle);

            String actionName = "";
            double chargerStrength = carCharger != null ? carCharger.getChargerStrength() : 0;
            double currentLevel = (vehicle.getCurrenLevelBattery() / 100.0) * vehicle.getBatteryCapacity();
            double wantedLevel = (vehicle.getWantedLevelBattery() / 100.0) * vehicle.getBatteryCapacity();
            double requiredEnergy = wantedLevel - currentLevel;
            double energyUsed = 0;
            double energyUsedFromGrid;
            int chargingInterval = 10000;

            RealEstate realEstate = Objects.requireNonNull(carCharger).getRealEstate();
            List<HomeBattery> homeBatteries = homeBatteryService.findAllByBusyness(realEstate.getId())
                    .stream()
                    .sorted(Comparator.comparing(HomeBattery::getEnergyFromPanels).reversed()).toList();

            chargingSession.setStartTime(LocalDateTime.now());
            chargingSession.setChargingVehicle(vehicle);

            actionName = carCharger.getName()
                    + " started charging vehicle : " + vehicleDTO.getRegistrationNumber() + ".";
            deviceActionService.createActionNoUser(carCharger, actionName);
            System.out.println("POCETNI NIVO: " + vehicle.getCurrenLevelBattery()+"%");

            while (requiredEnergy > 0) {
                for (HomeBattery battery : homeBatteries) {
                    if (requiredEnergy <= 0) {
                        break;
                    }
                    double availableEnergy = battery.getEnergyFromPanels();
                    if (availableEnergy > 0) {
                        double energyToUse = Math.min(Math.min(availableEnergy, requiredEnergy), chargerStrength);
                        battery.setEnergyFromPanels(availableEnergy - energyToUse);
                        requiredEnergy -= energyToUse;
                        energyUsed += energyToUse;
                        homeBatteryService.save(battery);

                        double currentBatteryLevelInKWh = currentLevel + energyUsed;
                        vehicle.setCurrenLevelBattery((currentBatteryLevelInKWh / vehicle.getBatteryCapacity()) * 100.0);
                        chargingVehicleService.save(vehicle);
                    }
                }
                if (requiredEnergy > 0) {
                    energyUsedFromGrid = Math.min(requiredEnergy, chargerStrength);
                    requiredEnergy -= energyUsedFromGrid;
                    energyUsed += energyUsedFromGrid;

                    double currentBatteryLevelInKWh = currentLevel + energyUsed;
                    vehicle.setCurrenLevelBattery((currentBatteryLevelInKWh / vehicle.getBatteryCapacity()) * 100.0);
                    chargingVehicleService.save(vehicle);

                    EnergyTransaction energyTransaction = new EnergyTransaction();
                    energyTransaction.setRealEstate(realEstate);
                    energyTransaction.setFromGrid(energyUsedFromGrid);
                    energyTransaction.setTimestamp(LocalDateTime.now());
                    energyTransaction.setToGrid(0.0);
                    energyTransactionService.save(energyTransaction);
                }
                System.out.println("TRENUTNI NIVO: " + vehicle.getCurrenLevelBattery()+"%");
                Thread.sleep(chargingInterval);
            }

            if(requiredEnergy==0.0){
                chargingSession.setEnergyConsumption(energyUsed);
                chargingSession.setEndTime(LocalDateTime.now());

                actionName = carCharger.getName()
                        + " finished charging vehicle : " + vehicleDTO.getRegistrationNumber() + ".";
                deviceActionService.createActionNoUser(carCharger, actionName);
                chargingSessionService.save(chargingSession);

                vehicle.setCurrenLevelBattery(vehicleDTO.getWantedLevelBattery());
                chargingVehicleService.save(vehicle);
                System.out.println("ZAVRSNI NIVO: " + vehicle.getCurrenLevelBattery()+"%");
            }

        }
        catch (Exception e){
            System.out.println(e);
        }
    }


}
