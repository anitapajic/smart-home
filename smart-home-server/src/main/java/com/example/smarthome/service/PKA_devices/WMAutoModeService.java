package com.example.smarthome.service.PKA_devices;

import com.example.smarthome.DTO.Devices.WMAutoDTO;
import com.example.smarthome.model.PKA_devices.WashingMachine;
import com.example.smarthome.model.PKA_devices.WashingMachineAuto;
import com.example.smarthome.repository.PKA_devices.WMAutoModeRepository;
import com.example.smarthome.repository.PKA_devices.WashingMachineRepository;
import com.example.smarthome.service.DeviceActionService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.support.CronTrigger;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class WMAutoModeService {
    @Autowired
    private WMAutoModeRepository wmAutoModeRepository;
    @Autowired
    private WashingMachineRepository washingMachineRepository;
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
    @Autowired
    private DeviceActionService deviceActionService;

    private Map<String, ScheduledFuture<?>> scheduledTasks = new HashMap<>();
    public WashingMachineAuto createAutoMode(WMAutoDTO wmAutoDTO){
        WashingMachineAuto wmAuto = new WashingMachineAuto();
        wmAuto.setMode(wmAutoDTO.getMode());
        wmAuto.setTime(wmAutoDTO.getTime());
        wmAuto.setDate(wmAutoDTO.getDate());

        WashingMachine wm = washingMachineRepository.findOneById(wmAutoDTO.getWmId());
        wmAuto.setWashingMachine(wm);

        wmAuto = wmAutoModeRepository.save(wmAuto);
        startAutoMode(wm, wmAuto);
        return wmAuto;
    }

    public void startAutoMode(WashingMachine washingMachine, WashingMachineAuto wmAuto) {

        try{
            long delay = calculateDelay(wmAuto.getTime(), wmAuto.getDate());
            if (delay > 0){

            ScheduledFuture<?> startTask = scheduler.schedule(() -> {
                    System.out.println("STARTED " + wmAuto.id);

                    washingMachine.setIsOn(true);
                    washingMachine.setWmcurrentMode(wmAuto.getMode());

                    String actionName = String.format("%s turned on - mode :  %s %s°C", washingMachine.getName(), washingMachine.getWmcurrentMode().getName(), washingMachine.getWmcurrentMode().getTemperature());
                    deviceActionService.createActionNoUser(washingMachine, actionName);

            }, delay, TimeUnit.MILLISECONDS) ;
            scheduledTasks.put("start_"+wmAuto.id, startTask);


            ScheduledFuture<?> stopTask = scheduler.schedule(() -> {
                System.out.println("STOPPED " + wmAuto.id);

                washingMachine.setIsOn(false);

                String actionName = String.format("%s turned off", washingMachine.getName());
                deviceActionService.createActionNoUser(washingMachine, actionName);


            }, calculateDelay(wmAuto.getTime().plusMinutes(wmAuto.getMode().getDuration()), wmAuto.getDate()), TimeUnit.MILLISECONDS);

            scheduledTasks.put("stop_"+wmAuto.id, stopTask);
            }
        }catch (Exception e){
            System.out.println("Error " + e);
        }


    }

    public void stopAutoMode(Integer wmAutoId) {
        ScheduledFuture<?> startTask = scheduledTasks.remove("start_"+wmAutoId);
        ScheduledFuture<?> stopTask = scheduledTasks.remove("stop_"+wmAutoId);
        if (startTask != null) {
            startTask.cancel(true);
        }
        if (stopTask != null) {
            stopTask.cancel(true);
        }
        wmAutoModeRepository.deleteById(Long.valueOf(wmAutoId));
    }

    private long calculateDelay(LocalTime time, LocalDate date) {
        LocalDateTime scheduledDateTime = LocalDateTime.of(date, time);
        LocalDateTime currentDateTime = LocalDateTime.now();
        return ChronoUnit.MILLIS.between(currentDateTime, scheduledDateTime);
    }



    @PostConstruct
    public void initializeScheduledTasks() {
        List<WashingMachineAuto> wmAutos = wmAutoModeRepository.findAll();

        for (WashingMachineAuto wmAuto : wmAutos) {
            startAutoMode(wmAuto.getWashingMachine(), wmAuto);
        }
    }

}
