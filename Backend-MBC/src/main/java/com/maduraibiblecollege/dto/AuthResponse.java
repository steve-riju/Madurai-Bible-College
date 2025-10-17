package com.maduraibiblecollege.dto;

public record AuthResponse(
    String accessToken,
    String refreshToken,
    String tokenType,
    String username,
    String role,
    Long id,
    String name
) {
  public static AuthResponse of(String access, String refresh, String username, String role, Long id, String name) {
    return new AuthResponse(access, refresh, "Bearer", username, role, id, name);
  }
}
