package com.maduraibiblecollege.controller;

import com.maduraibiblecollege.dto.AuthRequest;
import com.maduraibiblecollege.dto.RegisterRequest;
import com.maduraibiblecollege.dto.ResetPasswordRequest;
import com.maduraibiblecollege.entity.User;
import com.maduraibiblecollege.dto.AuthResponse;
import com.maduraibiblecollege.dto.ForgotPasswordRequest;
import com.maduraibiblecollege.dto.RefreshTokenRequest;
import com.maduraibiblecollege.service.AuthService;
import com.maduraibiblecollege.service.PasswordResetService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

  private final AuthService authService;
  private final PasswordResetService resetService;

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
  
  @PostMapping("/forgot-password")
  public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest req) {
      boolean sent = resetService.sendPasswordResetToken(req.getEmail());

      if (!sent) {
          return ResponseEntity.badRequest().body("No account found with email: " + req.getEmail());
      }

      return ResponseEntity.ok("Password reset link has been sent to " + req.getEmail());
  }


  @PostMapping("/reset-password")
  public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest req) {
      boolean success = resetService.resetPassword(req.getToken(), req.getNewPassword());
      if (success) {
    	  System.out.println("Password reseted");
          return ResponseEntity.ok("Password reset successful.");
      } else {
    	  System.out.println("Pass not reseted ");
          return ResponseEntity.badRequest().body("Invalid or expired token.");
      }
  }
  
  @GetMapping("/reset-password/validate")
  public ResponseEntity<?> validateResetToken(@RequestParam String token) {
      Optional<User> userOpt = resetService.getUserByResetToken(token);

      if (userOpt.isEmpty()) {
          return ResponseEntity.badRequest().body("Invalid or expired token.");
      }

      User user = userOpt.get();
      return ResponseEntity.ok(Map.of(
              "email", user.getEmail(),
              "username", user.getUsername()
      ));
  }

}