package com.maduraibiblecollege.config;

import com.maduraibiblecollege.entity.Role;
import com.maduraibiblecollege.entity.User;
import com.maduraibiblecollege.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Component to ensure a default Admin user exists in the database on application startup.
 */
@Component
@RequiredArgsConstructor
public class DefaultUserInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Hardcoded credentials for the initial admin user
    private static final String DEFAULT_USERNAME = "digi_user";
    private static final String DEFAULT_EMAIL = "steveriju2006@gmail.com";
    private static final String DEFAULT_RAW_PASSWORD = "password123";
    private static final String DEFAULT_NAME = "Digital Admin";
    private static final Role DEFAULT_ROLE = Role.ADMIN;

    @PostConstruct
    @Transactional // Ensures the check and insert happen in one transaction
    public void init() {
    	System.out.println("===========================Trying to insert default user============");
        // 1. Check if the default admin user already exists
        if (userRepository.findByUsername(DEFAULT_USERNAME).isEmpty() && userRepository.findByEmail(DEFAULT_EMAIL).isEmpty()) {
            
            // 2. Encode the password
            String encodedPassword = passwordEncoder.encode(DEFAULT_RAW_PASSWORD);

            // 3. Create and save the user
            User defaultAdmin = User.builder()
                    .username(DEFAULT_USERNAME)
                    .email(DEFAULT_EMAIL)
                    .password(encodedPassword)
                    .role(DEFAULT_ROLE)
                    .name(DEFAULT_NAME)
                    .enabled(true)
                    .build();

            userRepository.save(defaultAdmin);

            // Log the creation (will appear in the DigitalOcean container logs)
            System.out.println("=======================================================================");
            System.out.println("== ✅ INITIAL ADMIN USER CREATED SUCCESSFULLY ==");
            System.out.println("== USERNAME: " + DEFAULT_USERNAME);
            System.out.println("== TEMPORARY PASSWORD: " + DEFAULT_RAW_PASSWORD);
            System.out.println("== ACTION: PLEASE LOG IN AND CHANGE THIS PASSWORD IMMEDIATELY! ==");
            System.out.println("=======================================================================");
        }
    }
}