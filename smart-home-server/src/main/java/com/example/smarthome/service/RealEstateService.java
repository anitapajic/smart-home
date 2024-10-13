package com.example.smarthome.service;

import com.example.smarthome.DTO.RealEstate.CityDTO;
import com.example.smarthome.DTO.RealEstate.RealEstateDTO;
import com.example.smarthome.DTO.RealEstate.RealEstateStatusChangeDTO;
import com.example.smarthome.model.*;
import com.example.smarthome.model.enums.RealEstateStatus;
import com.example.smarthome.repository.AddressRepository;
import com.example.smarthome.repository.CityRepository;
import com.example.smarthome.repository.CountryRepository;
import com.example.smarthome.repository.RealEstateRepository;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@Service
@RequiredArgsConstructor

public class RealEstateService {
    private final RealEstateRepository realEstateRepository;
    private final AddressRepository addressRepository;
    private final CityRepository cityRepository;
    private final CountryRepository countryRepository;
    private final MailService mailService;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final CacheManager cacheManager;

    private final Logger LOG = LoggerFactory.getLogger(RealEstateService.class);
    @Cacheable(value = "country")
    public List<Country> getAllCountries(){
        LOG.info("Countries fetched from DB and successfully cached!");
        return countryRepository.findAll();
    }
    @Cacheable(value = "city")
    public List<City> getCities(Integer countryId){
        LOG.info("Cities fetched from DB and successfully cached!");
        return cityRepository.findOneByCountryId(countryId);
    }
    public void createRealEstate(RealEstateDTO realEstateDTO) {

        this.removeFromCache();

        RealEstate realEstate = new RealEstate();
        realEstate.setName(realEstateDTO.getName());
        realEstate.setQuadrature(realEstateDTO.getQuadrature());
        realEstate.setFloors(realEstateDTO.getFloors());
        realEstate.setPicture(realEstateDTO.getPicture());
        realEstate.setUserId(realEstateDTO.getUserId());
        realEstate.setStatus(RealEstateStatus.PENDING);

        Address address = addressRepository.findOneByCityAndCountryAndLocation(
                realEstateDTO.getAddress().getCity(),
                realEstateDTO.getAddress().getCountry(),
                realEstateDTO.getAddress().getLocation());

        if (address == null) {
            address = new Address();
            address.setLocation(realEstateDTO.getAddress().getLocation());
            address.setCity(realEstateDTO.getAddress().getCity());
            address.setCountry(realEstateDTO.getAddress().getCountry());
            address.setLongitude(realEstateDTO.getAddress().getLongitude());
            address.setLatitude(realEstateDTO.getAddress().getLatitude());
            address = addressRepository.save(address);
        }

        realEstate.setAddress(address);
        realEstateRepository.save(realEstate);
        simpMessagingTemplate.convertAndSend("new-re-request", realEstate);

    }
    public RealEstate changeStatus(RealEstateStatusChangeDTO changeDTO) throws MessagingException, UnsupportedEncodingException {
        this.removeFromCache();
        RealEstate realEstate = realEstateRepository.findOneById(changeDTO.getId());
        realEstate.setStatus(changeDTO.getStatus());

        mailService.sentStatusMail(realEstate, changeDTO.getReason());
        if(changeDTO.getStatus() == RealEstateStatus.ACCEPTED){
            RealEstateDTO newRE = new RealEstateDTO(realEstate);
            simpMessagingTemplate.convertAndSend("new-re", newRE);

        }

        return realEstateRepository.save(realEstate);
    }
    @Cacheable(value = "allRealEstates")
    public List<RealEstate> getRealEstates(){
        System.out.println("getRealEstates fetched from DB and successfully cached!");
        return realEstateRepository.findAll();
    }
    @Cacheable(value = "pendingRealEstates")
    public List<RealEstate> getPendingRealEstates(){
        System.out.println("getPendingRealEstates fetched from DB and successfully cached!");
        return realEstateRepository.findAllByStatus(RealEstateStatus.PENDING);
    }
    @Cacheable(value = "realEstatesByUserId")
    public List<RealEstate> getRealEstatesByUserId(Integer userId){
        System.out.println("getRealEstatesByUserId fetched from DB and successfully cached!");
        return realEstateRepository.findAllByStatusAndUserIdId(RealEstateStatus.ACCEPTED, userId);
    }
    @Cacheable(value = "pendingRealEstatesByUserId")
    public List<RealEstate> getPendingRealEstatesByUserId(Integer userId){
        System.out.println("getPendingRealEstatesByUserId fetched from DB and successfully cached!");
        return realEstateRepository.findAllByStatusAndUserIdId(RealEstateStatus.PENDING, userId);
    }
    @Cacheable(value = "citiesOfRealEstates")
    public List<CityDTO> getCitiesOfRealEstates() {
        System.out.println("getCitiesOfRealEstates fetched from DB and successfully cached!");
        Map<String, Integer> cityCountMap = new HashMap<>();
        List<RealEstate> allRealEstates = realEstateRepository.findAllByStatus(RealEstateStatus.ACCEPTED);

        for(RealEstate realEstate : allRealEstates) {
            String cityName = realEstate.getAddress().getCity();
            cityCountMap.put(cityName, cityCountMap.getOrDefault(cityName, 0) + 1);
        }

        List<CityDTO> cityDTOS = new ArrayList<>();
        for(Map.Entry<String, Integer> entry : cityCountMap.entrySet()) {
            CityDTO city = new CityDTO();
            city.setCity(entry.getKey());
            city.setNumOfRE(entry.getValue());
            cityDTOS.add(city);
        }
        return cityDTOS;
    }

    public List<RealEstate> getRealEstatesByCity(String city){
        return realEstateRepository.findAllByAddress_City(city);
    }

    @Cacheable(value = "realEstates")
    public List<RealEstate> getAllRealEstatesAccepted(){
        System.out.println("getAllRealEstatesAccepted fetched from DB and successfully cached!");
        return realEstateRepository.findAllByStatus(RealEstateStatus.ACCEPTED);
    }


    public RealEstate getRealEstateById(Integer id){
        RealEstate realEstate = new RealEstate();
        try{
            realEstate = realEstateRepository.findOneById(id);
        }
        catch(Exception e){
            System.out.println(e);
        }
        return realEstate;
    }
    @CacheEvict(cacheNames = {"allRealEstates", "pendingRealEstates", "realEstatesByUserId",
            "pendingRealEstatesByUserId", "citiesOfRealEstates", "realEstates", "realEstateById"}, allEntries = true)
    public void removeFromCache() {
        LOG.info("Real estates removed from cache!");
        Objects.requireNonNull(this.cacheManager.getCache("pendingRealEstates")).clear();
        Objects.requireNonNull(this.cacheManager.getCache("realEstatesByUserId")).clear();
        Objects.requireNonNull(this.cacheManager.getCache("allRealEstates")).clear();
        Objects.requireNonNull(this.cacheManager.getCache("pendingRealEstatesByUserId")).clear();
        Objects.requireNonNull(this.cacheManager.getCache("citiesOfRealEstates")).clear();
        Objects.requireNonNull(this.cacheManager.getCache("realEstates")).clear();
        Objects.requireNonNull(this.cacheManager.getCache("realEstateById")).clear();
        Objects.requireNonNull(this.cacheManager.getCache("realEstate")).clear();
    }



}