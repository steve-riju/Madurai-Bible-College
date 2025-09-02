package com.maduraibiblecollege.exception;

//GlobalExceptionHandler.java
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLIntegrityConstraintViolationException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@ControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest req) {
		List<String> details = new ArrayList<>();
		ex.getBindingResult().getFieldErrors().forEach(err ->
		details.add(err.getField() + ": " + err.getDefaultMessage()));
		ApiError body = new ApiError(
				Instant.now(),
				HttpStatus.BAD_REQUEST.value(),
				"Validation Failed",
				"One or more fields are invalid.",
				req.getRequestURI(),
				details
				);
		return ResponseEntity.badRequest().body(body);
	}

	@ExceptionHandler(ConstraintViolationException.class)
	public ResponseEntity<ApiError> handleConstraintViolation(ConstraintViolationException ex, HttpServletRequest req) {
		List<String> details = ex.getConstraintViolations().stream()
				.map(v -> v.getPropertyPath() + ": " + v.getMessage()).toList();
		ApiError body = new ApiError(
				Instant.now(),
				HttpStatus.BAD_REQUEST.value(),
				"Validation Failed",
				"Constraint violation.",
				req.getRequestURI(),
				details
				);
		return ResponseEntity.badRequest().body(body);
	}

	@ExceptionHandler({DataIntegrityViolationException.class, SQLIntegrityConstraintViolationException.class})
	public ResponseEntity<ApiError> handleFK(DataIntegrityViolationException ex, HttpServletRequest req) {
		String msg = "Cannot delete or modify because it is referenced by other records.";
		ApiError body = new ApiError(
				Instant.now(),
				HttpStatus.CONFLICT.value(),
				"Data Integrity Violation",
				msg,
				req.getRequestURI(),
				List.of(ex.getMostSpecificCause().getMessage())
				);
		return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
	}

	@ExceptionHandler(NoSuchElementException.class)
	public ResponseEntity<ApiError> handleNotFound(NoSuchElementException ex, HttpServletRequest req) {
		ApiError body = new ApiError(
				Instant.now(),
				HttpStatus.NOT_FOUND.value(),
				"Not Found",
				ex.getMessage() != null ? ex.getMessage() : "Resource not found.",
						req.getRequestURI(),
						null
				);
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ApiError> handleGeneric(Exception ex, HttpServletRequest req) {
		ApiError body = new ApiError(
				Instant.now(),
				HttpStatus.INTERNAL_SERVER_ERROR.value(),
				"Internal Server Error",
				"Unexpected error occurred.",
				req.getRequestURI(),
				List.of(ex.getMessage())
				);
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
	}

	@ExceptionHandler(IllegalStateException.class)
	public ResponseEntity<Map<String, String>> handleIllegalState(IllegalStateException ex) {
		Map<String, String> error = new HashMap<>();
		error.put("error", ex.getMessage());
		return ResponseEntity.badRequest().body(error);
	}
	
	@SuppressWarnings("deprecation")
	@ExceptionHandler({
	    io.jsonwebtoken.ExpiredJwtException.class,
	    io.jsonwebtoken.MalformedJwtException.class,
	    io.jsonwebtoken.SignatureException.class,
	    io.jsonwebtoken.UnsupportedJwtException.class,
	    IllegalArgumentException.class
	})
	public ResponseEntity<ApiError> handleJwtException(RuntimeException ex, HttpServletRequest req) {
	    ApiError body = new ApiError(
	            Instant.now(),
	            HttpStatus.FORBIDDEN.value(),
	            "JWT Authentication Failed",
	            ex.getMessage() != null ? ex.getMessage() : "Invalid or expired token.",
	            req.getRequestURI(),
	            null
	    );
	    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(body);
	}



}

