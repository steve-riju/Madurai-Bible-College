package com.maduraibiblecollege.controller.admin;

import com.maduraibiblecollege.config.EmailService;
import com.maduraibiblecollege.config.PasswordGenerator;
import com.maduraibiblecollege.dto.ApiResponse;
import com.maduraibiblecollege.entity.Role;
import com.maduraibiblecollege.entity.User;
import com.maduraibiblecollege.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    // ✅ Get all users
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    // ✅ Get single user by ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Create new user (Admin can add Student/Teacher/Admin)
    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new ApiResponse("❌ Username already exists!", false));
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new ApiResponse("❌ Email already exists!", false));
        }

        // Generate password
        String rawPassword = PasswordGenerator.generatePassword();
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setName(user.getUsername()); // new line
        User savedUser = userRepository.save(user);

        // Send mail
        emailService.sendPasswordEmail(user.getEmail(), user.getUsername(), rawPassword, user.getRole());

        return ResponseEntity.ok(new ApiResponse("✅ User created successfully!", true));
    }



    // ✅ Update user (role, email, etc.)
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setEmail(updatedUser.getEmail());
                    user.setRole(updatedUser.getRole());
                    if (updatedUser.getPassword() != null && !updatedUser.getPassword().isBlank()) {
                        user.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
                    }
                    return ResponseEntity.ok(userRepository.save(user));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Delete user
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse("❌ User not found!", false));
        }
        userRepository.deleteById(id);
        return ResponseEntity.ok(new ApiResponse("✅ User deleted successfully!", true));
    }

    
 // ✅ Get only Teachers
    @GetMapping("/teachers")
    public ResponseEntity<List<User>> getTeachers() {
        return ResponseEntity.ok(userRepository.findByRole(Role.TEACHER));
    }
    
 // ✅ Get only Students
    @GetMapping("/students")
    public ResponseEntity<List<User>> getStudents() {
        return ResponseEntity.ok(userRepository.findByRole(Role.STUDENT));
    }


}
