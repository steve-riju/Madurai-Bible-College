package com.maduraibiblecollege.service;

import com.maduraibiblecollege.dto.*;
import com.maduraibiblecollege.entity.*;
import com.maduraibiblecollege.exception.BusinessException;
import com.maduraibiblecollege.exception.ResourceNotFoundException;
import com.maduraibiblecollege.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProfileServiceImpl implements ProfileService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final TeacherProfileRepository teacherProfileRepository;
    private final FileStorageService fileStorageService;
    private final PasswordEncoder passwordEncoder;

    // ─── Helpers ────────────────────────────────────────────────────────────────

    private User getUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", username));
    }

    private User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id));
    }

    private UserProfile getOrCreateUserProfile(User user) {
        return userProfileRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    UserProfile p = UserProfile.builder().user(user).build();
                    return userProfileRepository.save(p);
                });
    }

    private StudentProfile getOrCreateStudentProfile(User user) {
        return studentProfileRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    StudentProfile p = StudentProfile.builder().user(user).build();
                    return studentProfileRepository.save(p);
                });
    }

    private TeacherProfile getOrCreateTeacherProfile(User user) {
        return teacherProfileRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    TeacherProfile p = TeacherProfile.builder().user(user).build();
                    return teacherProfileRepository.save(p);
                });
    }

    // ─── DTO Mappers ─────────────────────────────────────────────────────────────

    private UserProfileDto toUserProfileDto(User user, UserProfile up) {
        return UserProfileDto.builder()
                .userId(user.getId())
                .username(user.getUsername())
                .role(user.getRole())
                .accountStatus(user.isEnabled())
                .createdAt(user.getCreatedAt())
                .firstName(up.getFirstName())
                .lastName(up.getLastName())
                .preferredName(up.getPreferredName())
                .gender(up.getGender())
                .dateOfBirth(up.getDateOfBirth())
                .maritalStatus(up.getMaritalStatus())
                .profilePhotoPath(up.getProfilePhotoPath())
                .primaryMobile(up.getPrimaryMobile())
                .alternateMobile(up.getAlternateMobile())
                .personalEmail(up.getPersonalEmail())
                .permanentAddress(up.getPermanentAddress())
                .emergencyContactName(up.getEmergencyContactName())
                .emergencyContactRelationship(up.getEmergencyContactRelationship())
                .emergencyContactPhone(up.getEmergencyContactPhone())
                .languagePreference(up.getLanguagePreference())
                .build();
    }

    private StudentProfileDto toStudentProfileDto(User user, UserProfile up, StudentProfile sp) {
        return StudentProfileDto.builder()
                .userId(user.getId())
                .username(user.getUsername())
                .role(user.getRole())
                .accountStatus(user.isEnabled())
                .createdAt(user.getCreatedAt())
                .firstName(up.getFirstName())
                .lastName(up.getLastName())
                .preferredName(up.getPreferredName())
                .gender(up.getGender())
                .dateOfBirth(up.getDateOfBirth())
                .maritalStatus(up.getMaritalStatus())
                .profilePhotoPath(up.getProfilePhotoPath())
                .primaryMobile(up.getPrimaryMobile())
                .alternateMobile(up.getAlternateMobile())
                .personalEmail(up.getPersonalEmail())
                .permanentAddress(up.getPermanentAddress())
                .emergencyContactName(up.getEmergencyContactName())
                .emergencyContactRelationship(up.getEmergencyContactRelationship())
                .emergencyContactPhone(up.getEmergencyContactPhone())
                .languagePreference(up.getLanguagePreference())
                .studentIdNumber(sp.getStudentIdNumber())
                .admissionNumber(sp.getAdmissionNumber())
                .batch(sp.getBatch())
                .academicYear(sp.getAcademicYear())
                .program(sp.getProgram())
                .semester(sp.getSemester())
                .admissionDate(sp.getAdmissionDate())
                .homeChurch(sp.getHomeChurch())
                .churchDenomination(sp.getChurchDenomination())
                .baptized(sp.isBaptized())
                .ministryExperience(sp.getMinistryExperience())
                .ministryInterests(sp.getMinistryInterests())
                .callingTestimony(sp.getCallingTestimony())
                .fatherName(sp.getFatherName())
                .motherName(sp.getMotherName())
                .guardianName(sp.getGuardianName())
                .guardianRelationship(sp.getGuardianRelationship())
                .guardianPhone(sp.getGuardianPhone())
                .build();
    }

    private TeacherProfileDto toTeacherProfileDto(User user, UserProfile up, TeacherProfile tp) {
        return TeacherProfileDto.builder()
                .userId(user.getId())
                .username(user.getUsername())
                .role(user.getRole())
                .accountStatus(user.isEnabled())
                .createdAt(user.getCreatedAt())
                .firstName(up.getFirstName())
                .lastName(up.getLastName())
                .preferredName(up.getPreferredName())
                .gender(up.getGender())
                .dateOfBirth(up.getDateOfBirth())
                .maritalStatus(up.getMaritalStatus())
                .profilePhotoPath(up.getProfilePhotoPath())
                .primaryMobile(up.getPrimaryMobile())
                .alternateMobile(up.getAlternateMobile())
                .personalEmail(up.getPersonalEmail())
                .permanentAddress(up.getPermanentAddress())
                .emergencyContactName(up.getEmergencyContactName())
                .emergencyContactRelationship(up.getEmergencyContactRelationship())
                .emergencyContactPhone(up.getEmergencyContactPhone())
                .languagePreference(up.getLanguagePreference())
                .employeeId(tp.getEmployeeId())
                .designation(tp.getDesignation())
                .employmentType(tp.getEmploymentType())
                .homeChurch(tp.getHomeChurch())
                .churchDenomination(tp.getChurchDenomination())
                .baptized(tp.isBaptized())
                .ministryExperience(tp.getMinistryExperience())
                .ministryInterests(tp.getMinistryInterests())
                .callingTestimony(tp.getCallingTestimony())
                .build();
    }

    private void applyUserProfileFields(UserProfile up, UpdateProfileRequest req) {
        if (req.getFirstName() != null) up.setFirstName(req.getFirstName());
        if (req.getLastName() != null) up.setLastName(req.getLastName());
        if (req.getPreferredName() != null) up.setPreferredName(req.getPreferredName());
        if (req.getGender() != null) up.setGender(req.getGender());
        if (req.getDateOfBirth() != null) up.setDateOfBirth(req.getDateOfBirth());
        if (req.getMaritalStatus() != null) up.setMaritalStatus(req.getMaritalStatus());
        if (req.getPrimaryMobile() != null) up.setPrimaryMobile(req.getPrimaryMobile());
        if (req.getAlternateMobile() != null) up.setAlternateMobile(req.getAlternateMobile());
        if (req.getPersonalEmail() != null) up.setPersonalEmail(req.getPersonalEmail());
        if (req.getPermanentAddress() != null) up.setPermanentAddress(req.getPermanentAddress());
        if (req.getEmergencyContactName() != null) up.setEmergencyContactName(req.getEmergencyContactName());
        if (req.getEmergencyContactRelationship() != null) up.setEmergencyContactRelationship(req.getEmergencyContactRelationship());
        if (req.getEmergencyContactPhone() != null) up.setEmergencyContactPhone(req.getEmergencyContactPhone());
        if (req.getLanguagePreference() != null) up.setLanguagePreference(req.getLanguagePreference());
    }

    // ─── Public API ──────────────────────────────────────────────────────────────

    @Override
//    @Transactional(readOnly = true)
    public Object getMyProfile(String username) {
        User user = getUser(username);
        UserProfile up = getOrCreateUserProfile(user);
        if (user.getRole() == Role.STUDENT) {
            StudentProfile sp = getOrCreateStudentProfile(user);
            return toStudentProfileDto(user, up, sp);
        } else if (user.getRole() == Role.TEACHER) {
            TeacherProfile tp = getOrCreateTeacherProfile(user);
            return toTeacherProfileDto(user, up, tp);
        }
        return toUserProfileDto(user, up);
    }

    @Override
    public Object updateMyProfile(String username, UpdateStudentProfileRequest request) {
        User user = getUser(username);
        UserProfile up = getOrCreateUserProfile(user);

        // Apply common profile fields
        if (request.getFirstName() != null) up.setFirstName(request.getFirstName());
        if (request.getLastName() != null) up.setLastName(request.getLastName());
        if (request.getPreferredName() != null) up.setPreferredName(request.getPreferredName());
        if (request.getGender() != null) up.setGender(request.getGender());
        if (request.getDateOfBirth() != null) up.setDateOfBirth(request.getDateOfBirth());
        if (request.getMaritalStatus() != null) up.setMaritalStatus(request.getMaritalStatus());
        if (request.getPrimaryMobile() != null) up.setPrimaryMobile(request.getPrimaryMobile());
        if (request.getAlternateMobile() != null) up.setAlternateMobile(request.getAlternateMobile());
        if (request.getPersonalEmail() != null) up.setPersonalEmail(request.getPersonalEmail());
        if (request.getPermanentAddress() != null) up.setPermanentAddress(request.getPermanentAddress());
        if (request.getEmergencyContactName() != null) up.setEmergencyContactName(request.getEmergencyContactName());
        if (request.getEmergencyContactRelationship() != null) up.setEmergencyContactRelationship(request.getEmergencyContactRelationship());
        if (request.getEmergencyContactPhone() != null) up.setEmergencyContactPhone(request.getEmergencyContactPhone());
        if (request.getLanguagePreference() != null) up.setLanguagePreference(request.getLanguagePreference());
        userProfileRepository.save(up);

        // Apply student-specific editable fields (academic fields are ignored)
        StudentProfile sp = getOrCreateStudentProfile(user);
        if (request.getHomeChurch() != null) sp.setHomeChurch(request.getHomeChurch());
        if (request.getChurchDenomination() != null) sp.setChurchDenomination(request.getChurchDenomination());
        if (request.getBaptized() != null) sp.setBaptized(request.getBaptized());
        if (request.getMinistryExperience() != null) sp.setMinistryExperience(request.getMinistryExperience());
        if (request.getMinistryInterests() != null) sp.setMinistryInterests(request.getMinistryInterests());
        if (request.getCallingTestimony() != null) sp.setCallingTestimony(request.getCallingTestimony());
        if (request.getFatherName() != null) sp.setFatherName(request.getFatherName());
        if (request.getMotherName() != null) sp.setMotherName(request.getMotherName());
        if (request.getGuardianName() != null) sp.setGuardianName(request.getGuardianName());
        if (request.getGuardianRelationship() != null) sp.setGuardianRelationship(request.getGuardianRelationship());
        if (request.getGuardianPhone() != null) sp.setGuardianPhone(request.getGuardianPhone());
        studentProfileRepository.save(sp);

        return toStudentProfileDto(user, up, sp);
    }

    @Override
    public Object updateMyTeacherProfile(String username, UpdateTeacherProfileRequest request) {
        User user = getUser(username);
        UserProfile up = getOrCreateUserProfile(user);

        if (request.getFirstName() != null) up.setFirstName(request.getFirstName());
        if (request.getLastName() != null) up.setLastName(request.getLastName());
        if (request.getPreferredName() != null) up.setPreferredName(request.getPreferredName());
        if (request.getGender() != null) up.setGender(request.getGender());
        if (request.getDateOfBirth() != null) up.setDateOfBirth(request.getDateOfBirth());
        if (request.getMaritalStatus() != null) up.setMaritalStatus(request.getMaritalStatus());
        if (request.getPrimaryMobile() != null) up.setPrimaryMobile(request.getPrimaryMobile());
        if (request.getAlternateMobile() != null) up.setAlternateMobile(request.getAlternateMobile());
        if (request.getPersonalEmail() != null) up.setPersonalEmail(request.getPersonalEmail());
        if (request.getPermanentAddress() != null) up.setPermanentAddress(request.getPermanentAddress());
        if (request.getEmergencyContactName() != null) up.setEmergencyContactName(request.getEmergencyContactName());
        if (request.getEmergencyContactRelationship() != null) up.setEmergencyContactRelationship(request.getEmergencyContactRelationship());
        if (request.getEmergencyContactPhone() != null) up.setEmergencyContactPhone(request.getEmergencyContactPhone());
        if (request.getLanguagePreference() != null) up.setLanguagePreference(request.getLanguagePreference());
        userProfileRepository.save(up);

        // Apply teacher-specific editable fields (employment fields are ignored)
        TeacherProfile tp = getOrCreateTeacherProfile(user);
        if (request.getHomeChurch() != null) tp.setHomeChurch(request.getHomeChurch());
        if (request.getChurchDenomination() != null) tp.setChurchDenomination(request.getChurchDenomination());
        if (request.getBaptized() != null) tp.setBaptized(request.getBaptized());
        if (request.getMinistryExperience() != null) tp.setMinistryExperience(request.getMinistryExperience());
        if (request.getMinistryInterests() != null) tp.setMinistryInterests(request.getMinistryInterests());
        if (request.getCallingTestimony() != null) tp.setCallingTestimony(request.getCallingTestimony());
        teacherProfileRepository.save(tp);

        return toTeacherProfileDto(user, up, tp);
    }

    @Override
    public String uploadProfilePhoto(String username, MultipartFile file) {
        User user = getUser(username);
        UserProfile up = getOrCreateUserProfile(user);

        String roleFolder = user.getRole() == Role.STUDENT ? "students" : "teachers";
        String relativePath = fileStorageService.storeProfilePhoto(file, user.getId(), roleFolder, up.getProfilePhotoPath());
        up.setProfilePhotoPath(relativePath);
        userProfileRepository.save(up);
        return relativePath;
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] getProfilePhoto(Long userId, String requestingUsername) {
        User requestingUser = getUser(requestingUsername);
        
        // Only allow own photo or admin
        if (!requestingUser.getId().equals(userId) && requestingUser.getRole() != Role.ADMIN) {
            throw new BusinessException("Access denied: you can only view your own profile photo.");
        }
        UserProfile up = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile photo", userId));
        if (up.getProfilePhotoPath() == null || up.getProfilePhotoPath().isBlank()) {
            throw new ResourceNotFoundException("No profile photo found for user ID: " + userId);
        }
       
        return fileStorageService.readProfilePhoto(up.getProfilePhotoPath());
    }

    @Override
    @Transactional(readOnly = true)
    public String getPhotoContentType(Long userId) {
        UserProfile up = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile", userId));
        if (up.getProfilePhotoPath() == null) return "image/jpeg";
        return fileStorageService.getContentType(up.getProfilePhotoPath());
    }

    @Override
    public ApiResponse changePassword(String username, ChangePasswordRequest request) {
        if (request.getCurrentPassword() == null || request.getCurrentPassword().isBlank() ||
            request.getNewPassword() == null || request.getNewPassword().isBlank() ||
            request.getConfirmPassword() == null || request.getConfirmPassword().isBlank()) {
            throw new BusinessException("All password fields are required.");
        }
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BusinessException("New password and confirm password do not match.");
        }
        if (request.getNewPassword().length() < 8) {
            throw new BusinessException("Password must be at least 8 characters.");
        }
        User user = getUser(username);
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BusinessException("Current password is incorrect.");
        }
        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new BusinessException("New password must be different from the current password.");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        return new ApiResponse("Password changed successfully.", true);
    }

    // ─── Admin Methods ───────────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public Page<ProfileCardDto> getProfileCards(String role, String name, String academicYear,
                                                 String semester, String batch, String program,
                                                 Pageable pageable) {
        List<User> users;
        if ("STUDENT".equalsIgnoreCase(role)) {
            users = userRepository.findByRole(Role.STUDENT);
        } else if ("TEACHER".equalsIgnoreCase(role)) {
            users = userRepository.findByRole(Role.TEACHER);
        } else {
            users = new ArrayList<>();
            users.addAll(userRepository.findByRole(Role.STUDENT));
            users.addAll(userRepository.findByRole(Role.TEACHER));
        }

        // Apply name filter
        if (name != null && !name.isBlank()) {
            String lowerName = name.trim().toLowerCase();
            users = users.stream().filter(u -> {
                UserProfile up = userProfileRepository.findByUserId(u.getId()).orElse(null);
                String fullName = up != null
                        ? ((up.getFirstName() != null ? up.getFirstName() : "") + " " +
                           (up.getLastName() != null ? up.getLastName() : "")).trim()
                        : (u.getName() != null ? u.getName() : u.getUsername());
                return fullName.toLowerCase().contains(lowerName);
            }).toList();
        }

        List<ProfileCardDto> cards = users.stream().map(u -> {
            UserProfile up = userProfileRepository.findByUserId(u.getId()).orElse(null);
            String fullName = up != null && (up.getFirstName() != null || up.getLastName() != null)
                    ? ((up.getFirstName() != null ? up.getFirstName() : "") + " " +
                       (up.getLastName() != null ? up.getLastName() : "")).trim()
                    : (u.getName() != null ? u.getName() : u.getUsername());
            String photoPath = up != null ? up.getProfilePhotoPath() : null;

            ProfileCardDto.ProfileCardDtoBuilder builder = ProfileCardDto.builder()
                    .userId(u.getId())
                    .fullName(fullName)
                    .profilePhotoPath(photoPath)
                    .role(u.getRole());

            if (u.getRole() == Role.STUDENT) {
                StudentProfile sp = studentProfileRepository.findByUserId(u.getId()).orElse(null);
                if (sp != null) {
                    // Apply student filters
                    if (academicYear != null && !academicYear.isBlank() &&
                        !academicYear.equalsIgnoreCase(sp.getAcademicYear())) return null;
                    if (semester != null && !semester.isBlank() &&
                        !semester.equalsIgnoreCase(sp.getSemester())) return null;
                    if (batch != null && !batch.isBlank() &&
                        !batch.equalsIgnoreCase(sp.getBatch())) return null;
                    if (program != null && !program.isBlank() &&
                        !program.equalsIgnoreCase(sp.getProgram())) return null;
                    builder.batch(sp.getBatch()).academicYear(sp.getAcademicYear()).program(sp.getProgram());
                }
            } else if (u.getRole() == Role.TEACHER) {
                TeacherProfile tp = teacherProfileRepository.findByUserId(u.getId()).orElse(null);
                if (tp != null) {
                    builder.designation(tp.getDesignation()).employmentType(tp.getEmploymentType());
                }
            }
            return builder.build();
        }).filter(c -> c != null).toList();

        // Manual pagination
        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), cards.size());
        List<ProfileCardDto> pageContent = start >= cards.size() ? List.of() : cards.subList(start, end);
        return new PageImpl<>(pageContent, pageable, cards.size());
    }

    @Override
//    @Transactional(readOnly = true)
    public StudentProfileDto getStudentProfileById(Long userId) {
        User user = getUserById(userId);
        if (user.getRole() != Role.STUDENT) {
            throw new ResourceNotFoundException("Student", userId);
        }
        UserProfile up = getOrCreateUserProfile(user);
        StudentProfile sp = getOrCreateStudentProfile(user);
        return toStudentProfileDto(user, up, sp);
    }

    @Override
    public StudentProfileDto adminUpdateStudent(Long userId, AdminUpdateStudentRequest request) {
        User user = getUserById(userId);
        if (user.getRole() != Role.STUDENT) {
            throw new ResourceNotFoundException("Student", userId);
        }
        UserProfile up = getOrCreateUserProfile(user);
        if (request.getFirstName() != null) up.setFirstName(request.getFirstName());
        if (request.getLastName() != null) up.setLastName(request.getLastName());
        if (request.getPreferredName() != null) up.setPreferredName(request.getPreferredName());
        if (request.getGender() != null) up.setGender(request.getGender());
        if (request.getDateOfBirth() != null) up.setDateOfBirth(request.getDateOfBirth());
        if (request.getMaritalStatus() != null) up.setMaritalStatus(request.getMaritalStatus());
        if (request.getPrimaryMobile() != null) up.setPrimaryMobile(request.getPrimaryMobile());
        if (request.getAlternateMobile() != null) up.setAlternateMobile(request.getAlternateMobile());
        if (request.getPersonalEmail() != null) up.setPersonalEmail(request.getPersonalEmail());
        if (request.getPermanentAddress() != null) up.setPermanentAddress(request.getPermanentAddress());
        if (request.getEmergencyContactName() != null) up.setEmergencyContactName(request.getEmergencyContactName());
        if (request.getEmergencyContactRelationship() != null) up.setEmergencyContactRelationship(request.getEmergencyContactRelationship());
        if (request.getEmergencyContactPhone() != null) up.setEmergencyContactPhone(request.getEmergencyContactPhone());
        if (request.getLanguagePreference() != null) up.setLanguagePreference(request.getLanguagePreference());
        userProfileRepository.save(up);

        StudentProfile sp = getOrCreateStudentProfile(user);
        if (request.getStudentIdNumber() != null) sp.setStudentIdNumber(request.getStudentIdNumber());
        if (request.getAdmissionNumber() != null) sp.setAdmissionNumber(request.getAdmissionNumber());
        if (request.getBatch() != null) sp.setBatch(request.getBatch());
        if (request.getAcademicYear() != null) sp.setAcademicYear(request.getAcademicYear());
        if (request.getProgram() != null) sp.setProgram(request.getProgram());
        if (request.getSemester() != null) sp.setSemester(request.getSemester());
        if (request.getAdmissionDate() != null) sp.setAdmissionDate(request.getAdmissionDate());
        if (request.getHomeChurch() != null) sp.setHomeChurch(request.getHomeChurch());
        if (request.getChurchDenomination() != null) sp.setChurchDenomination(request.getChurchDenomination());
        if (request.getBaptized() != null) sp.setBaptized(request.getBaptized());
        if (request.getMinistryExperience() != null) sp.setMinistryExperience(request.getMinistryExperience());
        if (request.getMinistryInterests() != null) sp.setMinistryInterests(request.getMinistryInterests());
        if (request.getCallingTestimony() != null) sp.setCallingTestimony(request.getCallingTestimony());
        if (request.getFatherName() != null) sp.setFatherName(request.getFatherName());
        if (request.getMotherName() != null) sp.setMotherName(request.getMotherName());
        if (request.getGuardianName() != null) sp.setGuardianName(request.getGuardianName());
        if (request.getGuardianRelationship() != null) sp.setGuardianRelationship(request.getGuardianRelationship());
        if (request.getGuardianPhone() != null) sp.setGuardianPhone(request.getGuardianPhone());
        studentProfileRepository.save(sp);

        return toStudentProfileDto(user, up, sp);
    }

    @Override
//    @Transactional(readOnly = true)
    public TeacherProfileDto getTeacherProfileById(Long userId) {
        User user = getUserById(userId);
        if (user.getRole() != Role.TEACHER) {
            throw new ResourceNotFoundException("Teacher", userId);
        }
        UserProfile up = getOrCreateUserProfile(user);
        TeacherProfile tp = getOrCreateTeacherProfile(user);
        return toTeacherProfileDto(user, up, tp);
    }

    @Override
    public TeacherProfileDto adminUpdateTeacher(Long userId, AdminUpdateTeacherRequest request) {
        User user = getUserById(userId);
        if (user.getRole() != Role.TEACHER) {
            throw new ResourceNotFoundException("Teacher", userId);
        }
        UserProfile up = getOrCreateUserProfile(user);
        if (request.getFirstName() != null) up.setFirstName(request.getFirstName());
        if (request.getLastName() != null) up.setLastName(request.getLastName());
        if (request.getPreferredName() != null) up.setPreferredName(request.getPreferredName());
        if (request.getGender() != null) up.setGender(request.getGender());
        if (request.getDateOfBirth() != null) up.setDateOfBirth(request.getDateOfBirth());
        if (request.getMaritalStatus() != null) up.setMaritalStatus(request.getMaritalStatus());
        if (request.getPrimaryMobile() != null) up.setPrimaryMobile(request.getPrimaryMobile());
        if (request.getAlternateMobile() != null) up.setAlternateMobile(request.getAlternateMobile());
        if (request.getPersonalEmail() != null) up.setPersonalEmail(request.getPersonalEmail());
        if (request.getPermanentAddress() != null) up.setPermanentAddress(request.getPermanentAddress());
        if (request.getEmergencyContactName() != null) up.setEmergencyContactName(request.getEmergencyContactName());
        if (request.getEmergencyContactRelationship() != null) up.setEmergencyContactRelationship(request.getEmergencyContactRelationship());
        if (request.getEmergencyContactPhone() != null) up.setEmergencyContactPhone(request.getEmergencyContactPhone());
        if (request.getLanguagePreference() != null) up.setLanguagePreference(request.getLanguagePreference());
        userProfileRepository.save(up);

        TeacherProfile tp = getOrCreateTeacherProfile(user);
        if (request.getEmployeeId() != null) tp.setEmployeeId(request.getEmployeeId());
        if (request.getDesignation() != null) tp.setDesignation(request.getDesignation());
        if (request.getEmploymentType() != null) tp.setEmploymentType(request.getEmploymentType());
        if (request.getHomeChurch() != null) tp.setHomeChurch(request.getHomeChurch());
        if (request.getChurchDenomination() != null) tp.setChurchDenomination(request.getChurchDenomination());
        if (request.getBaptized() != null) tp.setBaptized(request.getBaptized());
        if (request.getMinistryExperience() != null) tp.setMinistryExperience(request.getMinistryExperience());
        if (request.getMinistryInterests() != null) tp.setMinistryInterests(request.getMinistryInterests());
        if (request.getCallingTestimony() != null) tp.setCallingTestimony(request.getCallingTestimony());
        teacherProfileRepository.save(tp);

        return toTeacherProfileDto(user, up, tp);
    }
}
