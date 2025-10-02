package com.maduraibiblecollege.service.cloud;

import java.io.IOException;
import java.time.Duration;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;

@Service
@RequiredArgsConstructor
public class R2CloudStorageService implements CloudStorageService {

    private final S3Client r2Client;
    private final S3Presigner presigner;

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
            return key; // ✅ only key
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file to R2", e);
        }
    }

    @Override
    public void deleteFile(String key) {
        if (key == null || key.isBlank()) return;

        DeleteObjectRequest delReq = DeleteObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .build();
        r2Client.deleteObject(delReq);
    }

 // ✅ Generate signed URL (30 min)
    @Override
    public String generateSignedUrl(String key) {
        if (key == null || key.isBlank()) {
            throw new IllegalArgumentException("Key cannot be null");
        }

        GetObjectRequest getReq = GetObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .build();

        GetObjectPresignRequest presignReq = GetObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(30)) // ✅ works here
                .getObjectRequest(getReq)
                .build();

        return presigner.presignGetObject(presignReq).url().toString();
    }

}
