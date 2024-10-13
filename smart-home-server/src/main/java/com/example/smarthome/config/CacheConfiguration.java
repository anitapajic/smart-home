package com.example.smarthome.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.boot.autoconfigure.cache.RedisCacheManagerBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
// ...

import java.time.Duration;


@Configuration
public class CacheConfiguration {

    // NAPOMENA: podrazumevana adresa Redis baze u lokalu je localhost:6379

    @Bean
    public ObjectMapper objectMapper(Jackson2ObjectMapperBuilder builder) {
        ObjectMapper objectMapper = builder.createXmlMapper(false).build();
        objectMapper.registerModule(new JavaTimeModule());
        // Dodatne konfiguracije po potrebi
        return objectMapper;
    }
    /*
     * Kreiranje posebnog Bean-a za dodatnu konfiguraciju Redis kesa.
     * Bez kreiranja dodatne konfiguracije, defaultna konfiguracija bi se koristila
     * (defaultne vrednosti se mogu videti na:
     * https://docs.spring.io/spring-data/redis/docs/current/api/org/springframework/data/redis/cache/RedisCacheConfiguration.html)
     */
    @Bean
    public RedisCacheConfiguration redisCacheConfiguration(ObjectMapper objectMapper) {
        return RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(15))
                .disableCachingNullValues()
                .serializeValuesWith(RedisSerializationContext.SerializationPair
                        .fromSerializer(new GenericJackson2JsonRedisSerializer(objectMapper)));
    }

    /*
     * Dodatna podesavanja kesiranja za svaku kes kolekciju.
     * Oslanja se na gorenavedenu osnovnu konfiguraciju (defaultCacheConfig)
     * i dodatno je dopunjuje za product kes (svi ostali ce se zapisivati po osnovnoj konfiguraciji)
     */
//    @Bean
//    public RedisCacheManagerBuilderCustomizer redisCacheManagerBuilderCustomizer() {
//        return (builder) -> builder
//                .withCacheConfiguration("realEstate", // defualtna vrednost prefiksa kljuceva u bazi je "ime_kesa::"
//                        RedisCacheConfiguration.defaultCacheConfig() // konfiguacija koju menjamo
//                                .entryTtl(Duration.ofSeconds(15)) // TTL je moguce definisati u sekundama, minutima, satima,...
//                                .prefixCacheNameWith("smart-home-server:") // moze biti izmenjena statickom vrednoscu
//                );
//    }
}

