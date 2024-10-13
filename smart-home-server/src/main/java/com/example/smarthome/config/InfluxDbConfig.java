package com.example.smarthome.config;

import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.InfluxDBClientFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class InfluxDbConfig {
    private final InfluxDBProperties influxDBProperties;

    @Bean
    public InfluxDBClient influxDBClient() {
        return InfluxDBClientFactory.create(
                influxDBProperties.getUrl(),
                influxDBProperties.getToken().toCharArray(),
                influxDBProperties.getOrg(),
                influxDBProperties.getBucket()
        );
    }
}
