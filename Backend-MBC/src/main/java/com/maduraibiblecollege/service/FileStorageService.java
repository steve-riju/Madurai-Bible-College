package com.maduraibiblecollege.service;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {

    /**
     * Stores a profile photo for the given user.
     *
     * @param file       the uploaded multipart file
     * @param userId     the user's ID (used in filename)
     * @param roleFolder "students" or "teachers"
     * @param oldPath    the existing relative path to delete (may be null)
     * @return the relative path stored in the database, e.g. "students/12345_abc.jpg"
     */
    String storeProfilePhoto(MultipartFile file, Long userId, String roleFolder, String oldPath);

    /**
     * Reads a profile photo from the filesystem.
     *
     * @param relativePath the relative path stored in the database
     * @return the file bytes
     */
    byte[] readProfilePhoto(String relativePath);

    /**
     * Returns the MIME type for the given relative path.
     */
    String getContentType(String relativePath);
}
