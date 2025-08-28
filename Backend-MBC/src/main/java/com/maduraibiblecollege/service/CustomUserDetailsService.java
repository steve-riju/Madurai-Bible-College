package com.maduraibiblecollege.service;

import com.maduraibiblecollege.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println(">>> Trying to fetch user: " + username);

        return userRepository.findByUsername(username)
                .map(user -> {
                    System.out.println(">>> Found user in DB: " + user.getUsername());
                    System.out.println(">>> Stored (encoded) password: " + user.getPassword());
                    System.out.println(">>> Role: " + user.getRole());
                    return user;
                })
                .orElseThrow(() -> {
                    System.out.println(">>> User not found: " + username);
                    return new UsernameNotFoundException("User not found: " + username);
                });
    }
}
