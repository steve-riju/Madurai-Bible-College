package com.maduraibiblecollege.config;

import com.maduraibiblecollege.repository.UserRepository;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

  private final JwtService jwtService;
  private final UserRepository userRepository;

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
      throws ServletException, IOException {
    final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
      chain.doFilter(request, response);
      return;
    }

    final String jwt = authHeader.substring(7);
	  if (jwt == null || jwt.trim().isEmpty() || jwt.equalsIgnoreCase("null")) {
	      chain.doFilter(request, response);
	      return;
	  }
    try {
      final String username = jwtService.extractUsername(jwt);

      if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
        UserDetails user = userRepository.findByUsername(username).orElse(null);
        if (user != null && jwtService.isTokenValid(jwt, user)) {
          var authToken = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
          SecurityContextHolder.getContext().setAuthentication(authToken);
        }
      }

      chain.doFilter(request, response);
    } catch (JwtException | IllegalArgumentException ex) {
      SecurityContextHolder.clearContext();
      writeUnauthorized(response, request, ex);
    }
  }

  @Override
  protected boolean shouldNotFilter(HttpServletRequest request) {
    String path = request.getServletPath();
    return "OPTIONS".equalsIgnoreCase(request.getMethod())
        || isPublicAuthPath(path)
        || path.startsWith("/api/public/")
        || "/actuator/health".equals(path)
        || "/health.html".equals(path);
  }

  private boolean isPublicAuthPath(String path) {
    return path.equals("/api/auth/login")
        || path.equals("/api/auth/register")
        || path.equals("/api/auth/refresh")
        || path.equals("/api/auth/forgot-password")
        || path.equals("/api/auth/reset-password")
        || path.equals("/api/auth/reset-password/validate");
  }

  private void writeUnauthorized(HttpServletResponse response, HttpServletRequest request, Exception ex) throws IOException {
    response.setStatus(HttpStatus.UNAUTHORIZED.value());
    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
    String safeMessage = ex instanceof io.jsonwebtoken.ExpiredJwtException
        ? "Authentication token has expired."
        : "Invalid authentication token.";
    String body = String.format(
        "{\"status\":401,\"error\":\"JWT Authentication Failed\",\"message\":\"%s\",\"path\":\"%s\"}",
        safeMessage,
        request.getRequestURI()
    );
    response.getWriter().write(body);
  }
}
