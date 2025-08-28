package com.maduraibiblecollege.dto;

public record AuthResponse(
    String accessToken,
    String refreshToken,
    String tokenType,
    String username,
    String role
) {
  public static AuthResponse of(String access, String refresh, String username, String role) {
    return new AuthResponse(access, refresh, "Bearer", username, role);
  }
}
