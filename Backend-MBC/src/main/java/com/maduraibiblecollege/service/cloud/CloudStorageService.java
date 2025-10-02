package com.maduraibiblecollege.service.cloud;

import org.springframework.web.multipart.MultipartFile;

public interface CloudStorageService {
    String uploadFile(MultipartFile file);

	void deleteFile(String key);

	String generateSignedUrl(String key);
}
