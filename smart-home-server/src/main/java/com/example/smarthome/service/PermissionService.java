package com.example.smarthome.service;

import com.example.smarthome.model.*;
import com.example.smarthome.repository.DeviceRepository;
import com.example.smarthome.repository.PermissionRepository;
import com.example.smarthome.repository.RealEstateRepository;
import com.example.smarthome.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ExecutionException;

@Service
@RequiredArgsConstructor
public class PermissionService {

    private final PermissionRepository permissionRepository;
    private final RealEstateRepository realEstateRepository;
    private final DeviceRepository deviceRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final CacheManager cacheManager;


    @Cacheable(value = "permissionsByUserId", key = "#userId")
    public List<RealEstate> getAllPermissionByUserId(Integer userId){
        List<Permission> permissions =  permissionRepository.findAllByUserId(userId);
        List<RealEstate> estates = new ArrayList<>();
        for (Permission permission : permissions){
            RealEstate realEstate = permission.getEstate();
            if(!estates.contains(realEstate)){
                estates.add(realEstate);
            }
        }

        return estates;
    }

    @Cacheable(value = "permissionsByEstateId", key = "#estateId")
    public List<Permission> getAllPermissionByEstateId(Integer estateId){
        return permissionRepository.findAllByEstateId(estateId);
    }
    @Cacheable(value = "permissionsByDeviceId", key = "#deviceId")
    public List<Permission> getAllPermissionByDeviceId(Integer deviceId){
        return permissionRepository.findAllByDeviceId(deviceId);
    }

    @Cacheable(value = "permissionsByUserIdAndEstateId", key = "{#userId, #estateId}")
    public List<Device> getAllPermissionByUserIdAndRealEstateId(Integer userId, Integer estateId ){
        List<Permission> permissions =  permissionRepository.findAllByUserIdAndEstateId(userId, estateId);
        List<Device> devices = new ArrayList<>();
        for (Permission permission : permissions){
            Device device = permission.getDevice();
            devices.add(device);
        }

        return devices;
    }


    public Permission addDevicePermission(String username, Integer estateId, Integer deviceId ){
        this.removeFromCache();
        Permission permission = new Permission();
        permission.setDevice(deviceRepository.findDeviceById(deviceId));
        permission.setEstate(realEstateRepository.findOneById(estateId));
        Optional<User> userOptional = userRepository.findByUsername(username);
        try{
            permission.setUser(userOptional.get());
            simpMessagingTemplate.convertAndSend("new-permission", permission);

            return permissionRepository.save(permission);
        }
        catch (Exception e){
            throw e;
        }
    }


    public List<Permission> addEstatePermission(String username, Integer estateId){
        this.removeFromCache();
        List<Permission> permissions = new ArrayList<>();
        RealEstate realEstate = realEstateRepository.findOneById(estateId);
        Optional<User> userOptional = userRepository.findByUsername(username);
        List<Device> devices = deviceRepository.findAllByRealEstateId(estateId);
        for (Device device : devices){
            Permission permission = new Permission();
            permission.setEstate(realEstate);
            permission.setDevice(device);
            try{
                permission.setUser(userOptional.get());
                permission = permissionRepository.save(permission);
                permissions.add(permission);
            }
            catch (NoSuchElementException e){
               throw e;
            }
            catch (Exception ignore){
                continue;
            }


        }
        simpMessagingTemplate.convertAndSend("new-permissions", permissions);

        return permissions;

    }

    public void removeDevicePermission(String username, Integer estateId, Integer deviceId ){
        this.removeFromCache();
        Optional<User> userOptional = userRepository.findByUsername(username);
       try {
           User user = userOptional.get();
           List<Permission> permissions = permissionRepository.findAllByUserIdAndEstateIdAndDeviceId(user.getId(), estateId, deviceId);
           permissionRepository.deleteAll(permissions);
           simpMessagingTemplate.convertAndSend("delete-permissions", permissions);

       }
       catch (Exception e){
           throw e;
       }

    }


    public void removeEstatePermission(String username, Integer estateId){
        this.removeFromCache();
        Optional<User> userOptional = userRepository.findByUsername(username);
        try {
            User user = userOptional.get();
            List<Permission> permissions = permissionRepository.findAllByUserIdAndEstateId(user.getId(), estateId);
            permissionRepository.deleteAll(permissions);
            simpMessagingTemplate.convertAndSend("delete-permissions", permissions);
        }
        catch (Exception e){
            throw e;
        }
    }

    @CacheEvict(cacheNames = {"permissionsByUserIdAndEstateId", "permissionsByDeviceId", "permissionsByEstateId",
            "permissionsByUserId"}, allEntries = true)
    public void removeFromCache() {
        System.out.println("Permissions removed from cache!");
        Objects.requireNonNull(this.cacheManager.getCache("permissionsByUserIdAndEstateId")).clear();
        Objects.requireNonNull(this.cacheManager.getCache("permissionsByDeviceId")).clear();
        Objects.requireNonNull(this.cacheManager.getCache("permissionsByEstateId")).clear();
        Objects.requireNonNull(this.cacheManager.getCache("permissionsByUserId")).clear();
    }



}
