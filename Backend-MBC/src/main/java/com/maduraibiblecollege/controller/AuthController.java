package com.maduraibiblecollege.controller;

import com.maduraibiblecollege.dto.AuthRequest;
import com.maduraibiblecollege.dto.RegisterRequest;
import com.maduraibiblecollege.dto.AuthResponse;
import com.maduraibiblecollege.dto.RefreshTokenRequest;
import com.maduraibiblecollege.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

  private final AuthService authService;

  @PostMapping("/register")
  public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest req) {
    return ResponseEntity.ok(authService.register(req));
  }

  @PostMapping("/login")
  public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest req) {
	  System.out.println("Attempted to login :"+ authService.authenticate(req));
    return ResponseEntity.ok(authService.authenticate(req));
  }

  @PostMapping("/refresh")
  public ResponseEntity<AuthResponse> refresh(@RequestBody RefreshTokenRequest request) {
      return ResponseEntity.ok(authService.refresh(request.getRefreshToken()));
  }


  @GetMapping("/me")
  public ResponseEntity<?> me(@AuthenticationPrincipal Object user) {
    return ResponseEntity.ok(user);
  }
}
