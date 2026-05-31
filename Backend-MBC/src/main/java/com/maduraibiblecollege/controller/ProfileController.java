package com.maduraibiblecollege.controller;

import com.maduraibiblecollege.dto.*;
import com.maduraibiblecollege.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping("/me")
    public ResponseEntity<Object> getMyProfile(Authentication auth) {
        return ResponseEntity.ok(profileService.getMyProfile(auth.getName()));
    }

    @PutMapping("/me")
    public ResponseEntity<Object> updateMyProfile(
            Authentication auth,
            @Valid @RequestBody UpdateStudentProfileRequest request) {
        // Determine role and delegate to appropriate update method
        Object result = profileService.updateMyProfile(auth.getName(), request);
        return ResponseEntity.ok(result);
    }

    @PutMapping("/me/teacher")
    public ResponseEntity<Object> updateMyTeacherProfile(
            Authentication auth,
            @Valid @RequestBody UpdateTeacherProfileRequest request) {
        return ResponseEntity.ok(profileService.updateMyTeacherProfile(auth.getName(), request));
    }

    @PostMapping("/photo")
    public ResponseEntity<ApiResponse> uploadPhoto(
            Authentication auth,
            @RequestParam("file") MultipartFile file) {
        String path = profileService.uploadProfilePhoto(auth.getName(), file);
        return ResponseEntity.ok(new ApiResponse("Profile photo uploaded successfully. Path: " + path, true));
    }

    @GetMapping("/photo/{userId}")
    public ResponseEntity<byte[]> getPhoto(
            @PathVariable Long userId,
            Authentication auth) {
        byte[] imageBytes = profileService.getProfilePhoto(userId, auth.getName());
        String contentType = profileService.getPhotoContentType(userId);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .cacheControl(CacheControl.maxAge(7, TimeUnit.DAYS).cachePublic())
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline")
                .body(imageBytes);
    }

    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse> changePassword(
            Authentication auth,
            @Valid @RequestBody ChangePasswordRequest request) {
        return ResponseEntity.ok(profileService.changePassword(auth.getName(), request));
    }
}
