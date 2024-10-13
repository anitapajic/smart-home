package com.example.smarthome.controller;


import com.example.smarthome.DTO.RealEstate.CityDTO;
import com.example.smarthome.DTO.RealEstate.RealEstateDTO;
import com.example.smarthome.DTO.RealEstate.RealEstateStatusChangeDTO;
import com.example.smarthome.model.*;
import com.example.smarthome.service.RealEstateService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;

@CrossOrigin(value="*")
@RestController
@RequestMapping(value = "/api/user")
public class RealEstateController {
    @Autowired
    private RealEstateService realEstateService;

    @PreAuthorize("hasAnyAuthority('USER')")
    @PostMapping(
            value = "/real_estate",
            consumes = "application/json")
    public ResponseEntity addRealEstate(@RequestBody RealEstateDTO realEstateDTO){
        HashMap<String, String> resp = new HashMap<>();

        try{
            realEstateService.createRealEstate(realEstateDTO);
            return new ResponseEntity<>(resp.put("response","Successfully added!"), HttpStatus.CREATED);
        }
        catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }

    }

    @PreAuthorize("hasAnyAuthority('ADMIN', 'SUPERADMIN')")
    @PutMapping(
            value = "/real_estate_status")
    public ResponseEntity acceptRealEstate(@RequestBody RealEstateStatusChangeDTO changeDTO){
        try{
            RealEstate response = realEstateService.changeStatus(changeDTO);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }

    }



    @PreAuthorize("hasAnyAuthority('ADMIN', 'SUPERADMIN')")
    @GetMapping(
            value = "/real_estate")
    public ResponseEntity getAllRealEstates(){
        try{
            List<RealEstate> response = realEstateService.getRealEstates();
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }

    }

    @PreAuthorize("hasAnyAuthority('ADMIN', 'SUPERADMIN')")
    @GetMapping(
            value = "/real_estate_pending")
    public ResponseEntity getAllPendingRealEstates(){
        try{
            List<RealEstate> response = realEstateService.getPendingRealEstates();
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }

    }

    @PreAuthorize("hasAnyAuthority('USER')")
    @GetMapping(
            value = "/user_real_estate/{id}")
    public ResponseEntity getAllUserRealEstates(@PathVariable Integer id){
        try{
            List<RealEstate> response = realEstateService.getRealEstatesByUserId(id);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN', 'SUPERADMIN')")
    @GetMapping(
            value = "/realEstate/{id}")
    public ResponseEntity getRealEstateById(@PathVariable Integer id){
        try{
            RealEstate response = realEstateService.getRealEstateById(id);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        catch (Exception e){
            System.out.println("getRealEstateById " + e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PreAuthorize("hasAnyAuthority('USER')")
    @GetMapping(
            value = "/user_real_estate_pending/{id}")
    public ResponseEntity getAllUserPendingRealEstates(@PathVariable Integer id){
        try{
            List<RealEstate> response = realEstateService.getPendingRealEstatesByUserId(id);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }

    }
    @PreAuthorize("hasAnyAuthority('USER')")
    @GetMapping(
            value = "/countries")
    public ResponseEntity getCountries(){

        try{
            List<Country> resp = realEstateService.getAllCountries();
            return new ResponseEntity<>(resp, HttpStatus.OK);
        }
        catch (Exception e){
            System.out.println(e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PreAuthorize("hasAnyAuthority('USER')")
    @GetMapping(
            value = "/cities/{countryId}")
    public ResponseEntity getCities(@PathVariable Integer countryId){

        try{
            List<City> resp = realEstateService.getCities(countryId);
            return new ResponseEntity<>(resp, HttpStatus.OK);
        }
        catch (Exception e){

            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN', 'SUPERADMIN')")
    @GetMapping(
            value = "/cities")
    public ResponseEntity getCitiesOfRealEstates(){

        try{
            List<CityDTO> cities = realEstateService.getCitiesOfRealEstates();
            return new ResponseEntity<>(cities, HttpStatus.CREATED);
        }
        catch (Exception e){
            System.out.println("getCitiesOfRealEstates " + e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PreAuthorize("hasAnyAuthority('ADMIN', 'SUPERADMIN')")
    @GetMapping(
            value = "/realEstates")
    public ResponseEntity getAllRealEstatesAccepted(){
        try{
            List<RealEstate> response = realEstateService.getAllRealEstatesAccepted();
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        catch (Exception e){
            System.out.println("getAllRealEstatesAccepted " + e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }

    }

    @GetMapping(value = "/removeCache")
    public ResponseEntity<String> removeFromCache() {
        realEstateService.removeFromCache();
        return ResponseEntity.ok("Real estates successfully removed from cache!");
    }



}
