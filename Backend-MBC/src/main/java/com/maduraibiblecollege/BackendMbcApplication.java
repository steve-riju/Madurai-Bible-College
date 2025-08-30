package com.maduraibiblecollege;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

//import org.springframework.boot.CommandLineRunner;
//import org.springframework.context.annotation.Bean;
//import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class BackendMbcApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendMbcApplication.class, args);
    }

    // quick test runner
//    @Bean
//    CommandLineRunner encodePassword(PasswordEncoder passwordEncoder) {
//        return args -> {
//            String raw = "password123";
//            String encoded = passwordEncoder.encode(raw);
//            System.out.println(">>> Encoded password for 'password123': " + encoded);
//        };
//    
//    }
}