package com.example.smarthome.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "influxdb")
@Data
public class InfluxDBProperties {
    private String url;
    private String token;
    private String org;
    private String bucket;
}
