package com.example.smarthome.service;

import com.example.smarthome.DTO.Devices.ActionDTO;
import com.example.smarthome.model.Device;
import com.example.smarthome.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class DeviceActionService {

    private final UserService userService;
    private final InfluxDbService influxDbService;
    private final SimpMessagingTemplate simpMessagingTemplate;


    public void createAction(Device device, String actionName, String username){
        try{
            User user = userService.findByUsername(username);

            ActionDTO action = new ActionDTO();
            action.setActionName(actionName);
            action.setUsername(username);
            action.setUserFullName(user.getName());
            action.setUserId(user.getId());
            action.setDeviceId(device.getId());
            action.setTimestamp(LocalDateTime.now());
            this.influxDbService.writeAction(action);
            simpMessagingTemplate.convertAndSend("actions", action);
        }
        catch (Exception e){
            System.out.println(e);
        }

    }

    public void createActionNoUser(Device device, String actionName){
        try{


            ActionDTO action = new ActionDTO();
            action.setActionName(actionName);
            action.setUsername("AUTO");
            action.setUserFullName(device.getName());
            action.setUserId(0);
            action.setDeviceId(device.getId());
            action.setTimestamp(LocalDateTime.now());
            this.influxDbService.writeAction(action);
            simpMessagingTemplate.convertAndSend("actions", action);
        }
        catch (Exception e){
            System.out.println(e);
        }

    }


}
