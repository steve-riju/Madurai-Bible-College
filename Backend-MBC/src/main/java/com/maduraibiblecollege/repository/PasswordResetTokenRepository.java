package com.maduraibiblecollege.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.maduraibiblecollege.entity.PasswordResetToken;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);
    void deleteByEmail(String email);
}

