package com.maduraibiblecollege.service;

import com.maduraibiblecollege.entity.User;
import com.maduraibiblecollege.repository.UserRepository;
import com.maduraibiblecollege.config.JwtService;
import com.maduraibiblecollege.dto.AuthRequest;
import com.maduraibiblecollege.dto.AuthResponse;
import com.maduraibiblecollege.dto.RegisterRequest;

import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final AuthenticationManager authManager;
  private final JwtService jwtService;

  public AuthResponse register(RegisterRequest
		  req) {
    if (userRepository.existsByUsername(req.username()))
      throw new IllegalArgumentException("Username already taken");
    if (userRepository.existsByEmail(req.email()))
      throw new IllegalArgumentException("Email already registered");

    User user = User.builder()
        .username(req.username())
        .email(req.email())
        .password(passwordEncoder.encode(req.password()))
        .role(req.role())
        .enabled(true)
        .build();
    userRepository.save(user);

    String access = jwtService.generateAccessToken(user);
    String refresh = jwtService.generateRefreshToken(user);
    return AuthResponse.of(access, refresh, user.getUsername(), user.getRole().name(), user.getId(), user.getName());
  }

  public AuthResponse authenticate(AuthRequest req) {

	    authManager.authenticate(
	        new UsernamePasswordAuthenticationToken(req.username(), req.password())
	    );

	    UserDetails user = userRepository.findByUsername(req.username()).orElseThrow();
	    String access = jwtService.generateAccessToken(user);
	    String refresh = jwtService.generateRefreshToken(user);
	    var u = (User) user;
	    return AuthResponse.of(access, refresh, u.getUsername(), u.getRole().name(), u.getId(), u.getName());
	}


  public AuthResponse refresh(String refreshToken) {
    String username = jwtService.extractUsername(refreshToken);
    UserDetails user = userRepository.findByUsername(username).orElseThrow();
    if (!jwtService.isTokenValid(refreshToken, user)) throw new IllegalArgumentException("Invalid refresh token");
    String access = jwtService.generateAccessToken(user);
    var u = (User) user;
    return new AuthResponse(access, refreshToken, "Bearer", user.getUsername(), ((User) user).getRole().name(), u.getId(), u.getName());
  }
}
