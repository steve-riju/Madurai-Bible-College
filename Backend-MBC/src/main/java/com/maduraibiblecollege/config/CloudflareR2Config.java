package com.maduraibiblecollege.config;

import java.net.URI;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

@Configuration
public class CloudflareR2Config {

    @Value("${cloudflare.r2.access-key}")
    private String accessKey;

    @Value("${cloudflare.r2.secret-key}")
    private String secretKey;

    @Value("${cloudflare.r2.endpoint}")
    private String endpoint;

    @Bean
    public S3Client r2Client() {
        AwsBasicCredentials creds = AwsBasicCredentials.create(accessKey, secretKey);
        return S3Client.builder()
                .credentialsProvider(StaticCredentialsProvider.create(creds))
                .endpointOverride(URI.create(endpoint))
                .region(Region.of("auto")) // R2 ignores region, "auto" works
                .build();
    }
    
}


