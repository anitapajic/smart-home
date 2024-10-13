package com.example.smarthome.service.VEU_devices;

import com.example.smarthome.DTO.Devices.VEU_devices.EnergyTransactionDTO;
import com.example.smarthome.model.VEU_devices.EnergyTransaction;
import com.example.smarthome.repository.RealEstateRepository;
import com.example.smarthome.repository.VEU_devices.EnergyTransactionRepository;
import com.example.smarthome.service.InfluxDbService;
import com.example.smarthome.service.RealEstateService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@EnableScheduling
public class EnergyTransactionService {
    private final EnergyTransactionRepository energyTransactionRepository;
    private final InfluxDbService influxDbService;
    private final RealEstateRepository realEstateRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final RealEstateService realEstateService;

    public void save(EnergyTransaction energyTransaction){
        energyTransactionRepository.save(energyTransaction);
    }

    @Scheduled(fixedRate = 60000) 
    public void processAndClearEnergyTransactions() {
        try{
            List<EnergyTransaction> transactions = energyTransactionRepository.findAll();

            Map<Integer, Double> totalFromGridMap = new HashMap<>();
            Map<Integer, Double> totalToGridMap = new HashMap<>();

            for (EnergyTransaction transaction : transactions) {
                Integer realEstateId = transaction.getRealEstate().getId();
                totalFromGridMap.put(realEstateId, totalFromGridMap.getOrDefault(realEstateId, 0.0) + transaction.getFromGrid());
                totalToGridMap.put(realEstateId, totalToGridMap.getOrDefault(realEstateId, 0.0) + transaction.getToGrid());
            }

            totalFromGridMap.forEach((realEstateId, totalFromGrid) -> {
                double totalToGrid = totalToGridMap.get(realEstateId);
                EnergyTransactionDTO aggregatedTransaction = new EnergyTransactionDTO();
                aggregatedTransaction.setRealEstateId(realEstateRepository.findOneById(realEstateId).getId());
                aggregatedTransaction.setFromGrid(totalFromGrid);
                aggregatedTransaction.setToGrid(totalToGrid);
                aggregatedTransaction.setTimestamp(LocalDateTime.now());
                aggregatedTransaction.setRealEstateCity(realEstateRepository.findOneById(realEstateId).getAddress().getCity());
                influxDbService.writeEnergyTransaction(aggregatedTransaction);
                simpMessagingTemplate.convertAndSend("energyTransactions", aggregatedTransaction);
            });


            energyTransactionRepository.deleteAll(transactions);
        }catch(Exception e){
            System.out.println(e);
        }
    }




}
