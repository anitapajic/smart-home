package com.example.smarthome.service.PKA_devices;

import com.example.smarthome.DTO.Devices.ACAutoDTO;
import com.example.smarthome.model.PKA_devices.AirConditioningAuto;
import com.example.smarthome.model.PKA_devices.AirConditioning;
import com.example.smarthome.repository.PKA_devices.ACAutoModeRepository;
import com.example.smarthome.repository.PKA_devices.AirConditioningRepository;
import com.example.smarthome.service.DeviceActionService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.support.CronTrigger;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ScheduledFuture;

@Service
@RequiredArgsConstructor
public class ACAutoModeService {
    @Autowired
    private ACAutoModeRepository acAutoModeRepository;
    @Autowired
    private AirConditioningRepository airConditioningRepository;
    @Autowired
    private TaskScheduler taskScheduler;
    @Autowired
    private DeviceActionService deviceActionService;


    private Map<String, ScheduledFuture<?>> scheduledTasks = new HashMap<>();
    public AirConditioningAuto createAutoMode(ACAutoDTO acAutoDTO){
        AirConditioningAuto acAuto = new AirConditioningAuto();
        acAuto.setMode(acAutoDTO.getMode());
        acAuto.setTemperature(acAutoDTO.getTemperature());
        acAuto.setFromTime(acAutoDTO.getFrom());
        acAuto.setToTime(acAutoDTO.getTo());
        acAuto.setCondition(acAutoDTO.getCondition());
        acAuto.setConditionTemperature(acAutoDTO.getConditionTemperature());

        AirConditioning ac = airConditioningRepository.findOneById(acAutoDTO.getAcId());
        acAuto.setAirConditioning(ac);

        acAuto = acAutoModeRepository.save(acAuto);
        startAutoMode(ac, acAuto);
        return acAuto;
    }

    public void startAutoMode(AirConditioning airConditioning, AirConditioningAuto acAuto) {
        String cronExpressionStartTime = generateCronExpression(acAuto.getFromTime());
        String cronExpressionEndTime = generateCronExpression(acAuto.getToTime());


        try{
            ScheduledFuture<?> startTask = taskScheduler.schedule(() -> {
                if (conditionsSatisfied(acAuto.getConditionTemperature(), acAuto.getCondition())) {
                    System.out.println("STARTED " + acAuto.id);

                    airConditioning.setIsOn(true);
                    airConditioning.setCurrentMode(acAuto.getMode());
                    airConditioning.setCurrentTemperature(acAuto.getTemperature());

                    String actionName = String.format("%s turned on - mode :  %s and temperature : %s", airConditioning.getName(), airConditioning.getCurrentMode(), airConditioning.getCurrentTemperature());
                    deviceActionService.createActionNoUser(airConditioning, actionName);

                }
            }, new CronTrigger(cronExpressionStartTime));
            scheduledTasks.put("start_"+acAuto.id, startTask);


            ScheduledFuture<?> stopTask = taskScheduler.schedule(() -> {
                System.out.println("STOPPED " + acAuto.id);

                airConditioning.setIsOn(false);

                String actionName = String.format("%s turned off", airConditioning.getName());
                deviceActionService.createActionNoUser(airConditioning, actionName);


            }, new CronTrigger(cronExpressionEndTime));

            scheduledTasks.put("stop_"+acAuto.id, stopTask);

        }catch (Exception e){
            System.out.println("Error " + e);
        }


    }

    public void stopAutoMode(Integer acAutoId) {
        ScheduledFuture<?> startTask = scheduledTasks.remove("start_"+acAutoId);
        ScheduledFuture<?> stopTask = scheduledTasks.remove("stop_"+acAutoId);
        if (startTask != null) {
            startTask.cancel(true);
        }
        if (stopTask != null) {
            stopTask.cancel(true);
        }
        acAutoModeRepository.deleteById(Long.valueOf(acAutoId));
    }

    private String generateCronExpression(LocalTime time) {
        return String.format("%s %s %s * * *", time.getSecond(), time.getMinute(), time.getHour());
    }

    private boolean conditionsSatisfied(Integer conditionTemperature, Boolean condition) {
        Integer currentTemperature = 20;  //nekako dobavi trenutnu temp
        System.out.println(condition + " : condition " + conditionTemperature + " : condition temperature");
        if(condition)   //condition is true when current temp goes below condition temp
        {
            System.out.println("SAD TREBA DA ZAGREJE ");
              System.out.println(currentTemperature<conditionTemperature);
            return currentTemperature < conditionTemperature;  // treba da zagreje
        }
        System.out.println("SAD TREBA DA RASHLADI ");
        System.out.println(currentTemperature>conditionTemperature);

        return currentTemperature > conditionTemperature;   // treba da rashladi
    }

    @PostConstruct
    public void initializeScheduledTasks() {
        List<AirConditioningAuto> acAutos = acAutoModeRepository.findAll();

        for (AirConditioningAuto acAuto : acAutos) {
            startAutoMode(acAuto.getAirConditioning(), acAuto);
        }
    }

}
