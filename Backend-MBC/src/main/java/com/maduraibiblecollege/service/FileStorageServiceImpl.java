package com.maduraibiblecollege.service;

import com.maduraibiblecollege.exception.BusinessException;
import com.maduraibiblecollege.exception.ResourceNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Set;
import java.util.UUID;

@Service
@Slf4j
public class FileStorageServiceImpl implements FileStorageService {

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024L; // 5 MB
    private static final Set<String> ALLOWED_MIME_TYPES = Set.of(
            "image/jpeg", "image/png", "image/gif", "image/webp"
    );

    @Value("${app.dp.folder}")
    private String dpFolder;

    @Override
    public String storeProfilePhoto(MultipartFile file, Long userId, String roleFolder, String oldPath) {
        validateFile(file);

        // Determine target directory
        Path targetDir = Paths.get(dpFolder, "profiles", roleFolder);
        try {
            Files.createDirectories(targetDir);
        } catch (IOException e) {
            throw new BusinessException("Failed to create storage directory: " + e.getMessage());
        }

        // Delete old file if it exists
        if (oldPath != null && !oldPath.isBlank()) {
            Path oldFile = Paths.get(dpFolder, "profiles", oldPath);
            try {
                Files.deleteIfExists(oldFile);
            } catch (IOException e) {
                log.warn("Could not delete old profile photo at {}: {}", oldFile, e.getMessage());
            }
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = getExtension(originalFilename);
        String uniqueName = userId + "_" + UUID.randomUUID().toString().replace("-", "").substring(0, 8) + extension;

        Path targetPath = targetDir.resolve(uniqueName);
        try {
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new BusinessException("Failed to store profile photo: " + e.getMessage());
        }

        // Return relative path (e.g. "students/12345_abc.jpg")
        return roleFolder + "/" + uniqueName;
    }

    @Override
    public byte[] readProfilePhoto(String relativePath) {
    	Path filePath = Paths.get(dpFolder, "profiles", relativePath);

        if (!Files.exists(filePath)) {
            throw new ResourceNotFoundException("Profile photo not found at path: " + relativePath);
        }
        try {
            return Files.readAllBytes(filePath);
        } catch (IOException e) {
            throw new BusinessException("Failed to read profile photo: " + e.getMessage());
        }
    }

    @Override
    public String getContentType(String relativePath) {
        String lower = relativePath.toLowerCase();
        if (lower.endsWith(".png")) return "image/png";
        if (lower.endsWith(".gif")) return "image/gif";
        if (lower.endsWith(".webp")) return "image/webp";
        return "image/jpeg";
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BusinessException("Uploaded file is empty.");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new BusinessException("File size exceeds the maximum allowed size of 5 MB.");
        }
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_MIME_TYPES.contains(contentType.toLowerCase())) {
            throw new BusinessException("Invalid file type. Allowed types: JPEG, PNG, GIF, WEBP.");
        }
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) return ".jpg";
        return filename.substring(filename.lastIndexOf('.'));
    }
}
