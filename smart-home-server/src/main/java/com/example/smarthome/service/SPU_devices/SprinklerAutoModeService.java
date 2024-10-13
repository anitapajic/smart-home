package com.example.smarthome.service.SPU_devices;

import com.example.smarthome.DTO.Devices.SPU_devices.SprinklerAutoDTO;
import com.example.smarthome.DTO.Devices.SPU_devices.SprinklerDTO;
import com.example.smarthome.model.PKA_devices.AirConditioning;
import com.example.smarthome.model.PKA_devices.AirConditioningAuto;
import com.example.smarthome.model.SPU_devices.Sprinkler;
import com.example.smarthome.model.SPU_devices.SprinklerAuto;
import com.example.smarthome.repository.SPU_devices.SprinklerAutoModeRepository;
import com.example.smarthome.repository.SPU_devices.SprinklerRepository;
import com.example.smarthome.service.DeviceActionService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.support.CronTrigger;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ScheduledFuture;

@Service
@RequiredArgsConstructor
public class SprinklerAutoModeService {

    private final SprinklerAutoModeRepository sprinklerAutoModeRepository;
    private final SprinklerRepository sprinklerRepository;
    private final TaskScheduler taskScheduler;
    private final DeviceActionService deviceActionService;
    private final SimpMessagingTemplate simpMessagingTemplate;

    private Map<String, ScheduledFuture<?>> scheduledTasks = new HashMap<>();
    public SprinklerAuto createAutoMode(SprinklerAutoDTO sprinklerAutoDTO){
        SprinklerAuto sprinklerAuto = new SprinklerAuto();
        String actionName;
        sprinklerAuto.setFromTime(sprinklerAutoDTO.getFrom());
        sprinklerAuto.setToTime(sprinklerAutoDTO.getTo());
        sprinklerAuto.setCondition(sprinklerAutoDTO.getCondition());
        sprinklerAuto.setRepeat(sprinklerAutoDTO.getRepeat());
        Sprinkler sprinkler = sprinklerRepository.findOneById(sprinklerAutoDTO.getSprinklerId());
        sprinklerAuto.setSprinkler(sprinkler);

        sprinklerAuto = sprinklerAutoModeRepository.save(sprinklerAuto);

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetails userDetails = (UserDetails) auth.getPrincipal();

        actionName = sprinkler.getName() + " auto mode created!";
        deviceActionService.createAction(sprinkler, actionName,userDetails.getUsername());

        startAutoMode(sprinkler, sprinklerAuto);
        return sprinklerAuto;
    }



    ///TODO:refaktorisati!!!!!
    public void startAutoMode(Sprinkler sprinkler, SprinklerAuto sprinklerAuto) {
        String cronExpressionStartTime = generateCronExpression(sprinklerAuto.getFromTime(),sprinklerAuto.getRepeat());
        String cronExpressionEndTime = generateCronExpression(sprinklerAuto.getToTime(),sprinklerAuto.getRepeat());

        if (sprinkler.getSprinklerMode()){
            try{
                if (sprinklerAuto.getCondition()){
                    ScheduledFuture<?> startTask = taskScheduler.schedule(() -> {
                        System.out.println("STARTED " + sprinklerAuto.id);

                        sprinkler.setIsSprinklerOn(true);
                        sprinklerRepository.save(sprinkler);
                        SprinklerDTO newState = new SprinklerDTO(sprinkler.getId(), sprinkler.getIsSprinklerOn());
                        simpMessagingTemplate.convertAndSend(String.format("%d/sprinkler-state", sprinkler.getRealEstate().getId()), newState);

                        String actionName = String.format("%s auto turned ON", sprinkler.getName());
                        deviceActionService.createActionNoUser(sprinkler, actionName);


                    }, new CronTrigger(cronExpressionStartTime));
                    scheduledTasks.put("start_"+sprinklerAuto.id, startTask);


                    ScheduledFuture<?> stopTask = taskScheduler.schedule(() -> {
                        System.out.println("STOPPED " + sprinklerAuto.id);

                        sprinkler.setIsSprinklerOn(false);
                        sprinklerRepository.save(sprinkler);
                        SprinklerDTO newState = new SprinklerDTO(sprinkler.getId(), sprinkler.getIsSprinklerOn());
                        simpMessagingTemplate.convertAndSend(String.format("%d/sprinkler-state", sprinkler.getRealEstate().getId()), newState);

                        String actionName = String.format("%s auto turned OFF", sprinkler.getName());
                        deviceActionService.createActionNoUser(sprinkler, actionName);


                    }, new CronTrigger(cronExpressionEndTime));

                    scheduledTasks.put("stop_"+sprinklerAuto.id, stopTask);
                }
                else{
                        ScheduledFuture<?> startTask = taskScheduler.schedule(() -> {
                            System.out.println("STARTED " + sprinklerAuto.id);

                            sprinkler.setIsSprinklerOn(false);
                            sprinklerRepository.save(sprinkler);
                            SprinklerDTO newState = new SprinklerDTO(sprinkler.getId(), sprinkler.getIsSprinklerOn());
                            simpMessagingTemplate.convertAndSend(String.format("%d/sprinkler-state", sprinkler.getRealEstate().getId()), newState);

                            String actionName = String.format("%s auto turned ON", sprinkler.getName());
                            deviceActionService.createActionNoUser(sprinkler, actionName);


                        }, new CronTrigger(cronExpressionStartTime));
                        scheduledTasks.put("start_"+sprinklerAuto.id, startTask);


                        ScheduledFuture<?> stopTask = taskScheduler.schedule(() -> {
                            System.out.println("STOPPED " + sprinklerAuto.id);

                            sprinkler.setIsSprinklerOn(true);
                            sprinklerRepository.save(sprinkler);
                            SprinklerDTO newState = new SprinklerDTO(sprinkler.getId(), sprinkler.getIsSprinklerOn());
                            simpMessagingTemplate.convertAndSend(String.format("%d/sprinkler-state", sprinkler.getRealEstate().getId()), newState);
                            String actionName = String.format("%s auto turned OFF", sprinkler.getName());
                            deviceActionService.createActionNoUser(sprinkler, actionName);


                        }, new CronTrigger(cronExpressionEndTime));

                        scheduledTasks.put("stop_"+sprinklerAuto.id, stopTask);

                }
            }catch (Exception e){
                System.out.println("Error " + e);
            }
        }

    }





    private String generateCronExpression(LocalTime time, Integer repeat) {
        LocalDate today = LocalDate.now();
        if (repeat == 7){
            return String.format("%s %s %s * * *", time.getSecond(), time.getMinute(), time.getHour());
        } else if (repeat != 8 && repeat >= 0 && repeat <= 6) {
        // Ponovi svaki dan u nedelji koji je izabran
            return String.format("%s %s %s * * %s", time.getSecond(), time.getMinute(), time.getHour(), repeat);
        } else if (repeat == 8) {
            return String.format("%s %s %s %s %s ?",time.getSecond(),time.getMinute(),time.getHour(),today.getDayOfMonth(),today.getMonthValue());
        } else {
        // Nije definisano ponavljanje ili nije u podržanom opsegu
            throw new IllegalArgumentException("Nepodržana vrednost repeat");
    }

    }



    public void stopAutoMode(Integer sprinklerAutoId) {
        SprinklerAuto sprinklerAuto = sprinklerAutoModeRepository.findOneById(sprinklerAutoId);

        Sprinkler sprinkler = sprinklerRepository.findOneById(sprinklerAuto.getSprinkler().getId());


        ScheduledFuture<?> startTask = scheduledTasks.remove("start_"+sprinklerAutoId);
        ScheduledFuture<?> stopTask = scheduledTasks.remove("stop_"+sprinklerAutoId);

        System.out.println("STOOOOOP MODEEE ACTIVATED");

        if (startTask != null) {
            startTask.cancel(true);
        }
        if (stopTask != null) {
            stopTask.cancel(true);
        }

        sprinklerAutoModeRepository.deleteById(Long.valueOf(sprinklerAutoId));

        System.out.println("STOOOOOP MODEEE ...");
        System.out.println(sprinkler.getName());
        String actionName = String.format("%s auto mode deleted!", sprinkler.getName());
        deviceActionService.createActionNoUser(sprinkler, actionName);
        System.out.println("STOOOOOP MODEEE FINISHED");
    }

}
