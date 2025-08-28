package com.maduraibiblecollege.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

  private final Key signingKey;

  private final long accessExpirationMs;
  private final long refreshExpirationMs;

  public JwtService(
      @Value("${app.jwt.secret}") String base64Secret,
      @Value("${app.jwt.expiration-ms}") long accessExpirationMs,
      @Value("${app.jwt.refresh-expiration-ms}") long refreshExpirationMs) {
    this.signingKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(base64Secret));
    this.accessExpirationMs = accessExpirationMs;
    this.refreshExpirationMs = refreshExpirationMs;
  }

  public String extractUsername(String token) {
    return extractClaim(token, Claims::getSubject);
  }

  public <T> T extractClaim(String token, Function<Claims, T> resolver) {
    final Claims claims = Jwts.parserBuilder()
        .setSigningKey(signingKey)
        .build()
        .parseClaimsJws(token)
        .getBody();
    return resolver.apply(claims);
  }

  public String generateAccessToken(UserDetails user) {
    return generateToken(Map.of(), user, accessExpirationMs);
  }

  public String generateRefreshToken(UserDetails user) {
    return generateToken(Map.of("type", "refresh"), user, refreshExpirationMs);
  }

  private String generateToken(Map<String, Object> extraClaims, UserDetails user, long ttlMs) {
    long now = System.currentTimeMillis();
    return Jwts.builder()
        .setClaims(extraClaims)
        .setSubject(user.getUsername())
        .setIssuedAt(new Date(now))
        .setExpiration(new Date(now + ttlMs))
        .signWith(signingKey, SignatureAlgorithm.HS256)
        .compact();
  }

  public boolean isTokenValid(String token, UserDetails user) {
    final String username = extractUsername(token);
    return username.equals(user.getUsername()) && !isExpired(token);
  }

  private boolean isExpired(String token) {
    return extractClaim(token, Claims::getExpiration).before(new Date());
  }
}
