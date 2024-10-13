package com.example.smarthome.controller;

import com.example.smarthome.model.Device;
import com.example.smarthome.model.Permission;
import com.example.smarthome.model.RealEstate;
import com.example.smarthome.service.PermissionService;
import com.example.smarthome.service.RealEstateService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(value="*")
@RestController
@RequestMapping(value = "/api/permission")
@RequiredArgsConstructor
public class PermissionController {

    @Autowired
    private PermissionService permissionService;


    @PreAuthorize("hasAnyAuthority('USER')")
    @GetMapping(
            value = "/{userId}")
    public ResponseEntity getAllRealEstates(@PathVariable Integer userId){
        try{
            List<RealEstate> response = permissionService.getAllPermissionByUserId(userId);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        catch (Exception e){
            System.out.println(e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }

    }

    @PreAuthorize("hasAnyAuthority('USER')")
    @GetMapping(
            value = "estate/{estateId}")
    public ResponseEntity getAllRealEstatePermissions(@PathVariable Integer estateId){
        try{
            List<Permission> response = permissionService.getAllPermissionByEstateId(estateId);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        catch (Exception e){
            System.out.println(e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }

    }
    @PreAuthorize("hasAnyAuthority('USER')")
    @GetMapping(
            value = "/{userId}/{estateId}")
    public ResponseEntity getAllDevices(@PathVariable Integer userId, @PathVariable Integer estateId){
        try{
            List<Device> response = permissionService.getAllPermissionByUserIdAndRealEstateId(userId, estateId);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        catch (Exception e){
            System.out.println(e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }

    }


    @PreAuthorize("hasAnyAuthority('USER')")
    @GetMapping(
            value = "/device/{deviceId}")
    public ResponseEntity getAllDevicePermissions(@PathVariable Integer deviceId){
        try{
            List<Permission> response = permissionService.getAllPermissionByDeviceId(deviceId);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        catch (Exception e){
            System.out.println(e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }

    }

    @PreAuthorize("hasAnyAuthority('USER')")
    @PutMapping(
            value = "/{username}/{estateId}")
    public ResponseEntity addRealEstatePermission(@PathVariable String username, @PathVariable Integer estateId){
        try{
            List<Permission> response = permissionService.addEstatePermission(username, estateId);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        catch (Exception e){
            System.out.println(e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }

    }

    @PreAuthorize("hasAnyAuthority('USER')")
    @PutMapping(
            value = "/{username}/{estateId}/{deviceId}")
    public ResponseEntity addDevicePermission(@PathVariable String username, @PathVariable Integer estateId, @PathVariable Integer deviceId){
        try{
            Permission response = permissionService.addDevicePermission(username, estateId, deviceId);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        catch (Exception e){
            System.out.println(e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }

    }


    @PreAuthorize("hasAnyAuthority('USER')")
    @DeleteMapping(
            value = "/{username}/{estateId}")
    public ResponseEntity removeRealEstatePermission(@PathVariable String username, @PathVariable Integer estateId){
        try{
            permissionService.removeEstatePermission(username, estateId);
            return new ResponseEntity<>("deleted", HttpStatus.OK);
        }
        catch (Exception e){
            System.out.println(e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }

    }

    @PreAuthorize("hasAnyAuthority('USER')")
    @DeleteMapping(
            value = "/{username}/{estateId}/{deviceId}")
    public ResponseEntity removeDevicePermission(@PathVariable String username, @PathVariable Integer estateId, @PathVariable Integer deviceId){
        try{

            permissionService.removeDevicePermission(username, estateId, deviceId);
            return new ResponseEntity<>("deleted", HttpStatus.OK);
        }
        catch (Exception e){
            System.out.println(e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }

    }

}
