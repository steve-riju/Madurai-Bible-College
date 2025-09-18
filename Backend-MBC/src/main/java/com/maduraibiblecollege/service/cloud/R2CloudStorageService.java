package com.maduraibiblecollege.service.cloud;

import java.io.IOException;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Service
@RequiredArgsConstructor
public class R2CloudStorageService implements CloudStorageService {

    private final S3Client r2Client;

    @Value("${cloudflare.r2.bucket}")
    private String bucket;

    @Override
    public String uploadFile(MultipartFile file) {
        String key = UUID.randomUUID() + "_" + file.getOriginalFilename();

        try {
            PutObjectRequest putReq = PutObjectRequest.builder()
                    .bucket(bucket)
                    .key(key)
                    .contentType(file.getContentType())
                    .build();

            r2Client.putObject(putReq, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

            // 🔹 Public URL (requires Cloudflare public bucket or signed URL setup)
            return String.format("https://%s.r2.cloudflarestorage.com/%s/%s",
                    System.getenv("R2_ACCOUNT_ID"), bucket, key);

        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file to R2", e);
        }
    }
}

