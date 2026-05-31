package com.maduraibiblecollege.service;

import com.maduraibiblecollege.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

public interface ProfileService {

    Object getMyProfile(String username);

    Object updateMyProfile(String username, UpdateStudentProfileRequest request);

    Object updateMyTeacherProfile(String username, UpdateTeacherProfileRequest request);

    String uploadProfilePhoto(String username, MultipartFile file);

    byte[] getProfilePhoto(Long userId, String requestingUsername);

    String getPhotoContentType(Long userId);

    ApiResponse changePassword(String username, ChangePasswordRequest request);

    // Admin methods
    Page<ProfileCardDto> getProfileCards(String role, String name, String academicYear,
                                         String semester, String batch, String program,
                                         Pageable pageable);

    StudentProfileDto getStudentProfileById(Long userId);

    StudentProfileDto adminUpdateStudent(Long userId, AdminUpdateStudentRequest request);

    TeacherProfileDto getTeacherProfileById(Long userId);

    TeacherProfileDto adminUpdateTeacher(Long userId, AdminUpdateTeacherRequest request);
}
