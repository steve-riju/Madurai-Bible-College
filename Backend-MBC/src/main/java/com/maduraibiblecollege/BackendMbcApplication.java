package com.maduraibiblecollege;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class BackendMbcApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendMbcApplication.class, args);
    }

}
