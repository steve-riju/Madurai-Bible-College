package com.maduraibiblecollege.exception;

//GlobalExceptionHandler.java
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

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

	@ExceptionHandler({NoSuchElementException.class, ResourceNotFoundException.class})
	public ResponseEntity<ApiError> handleNotFound(Exception ex, HttpServletRequest req) {
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

	@ExceptionHandler(BusinessException.class)
	public ResponseEntity<ApiError> handleBusinessException(BusinessException ex, HttpServletRequest req) {
		ApiError body = new ApiError(
				Instant.now(),
				HttpStatus.BAD_REQUEST.value(),
				"Business Error",
				ex.getMessage(),
				req.getRequestURI(),
				null
		);
		return ResponseEntity.badRequest().body(body);
	}

	@ExceptionHandler(ValidationException.class)
	public ResponseEntity<ApiError> handleValidationException(ValidationException ex, HttpServletRequest req) {
		ApiError body = new ApiError(
				Instant.now(),
				HttpStatus.BAD_REQUEST.value(),
				"Validation Error",
				ex.getMessage(),
				req.getRequestURI(),
				ex.getValidationErrors()
		);
		return ResponseEntity.badRequest().body(body);
	}

	@ExceptionHandler(AccessDeniedException.class)
	public ResponseEntity<ApiError> handleAccessDenied(AccessDeniedException ex, HttpServletRequest req) {
		ApiError body = new ApiError(
				Instant.now(),
				HttpStatus.FORBIDDEN.value(),
				"Access Denied",
				"You don't have permission to access this resource.",
				req.getRequestURI(),
				null
		);
		return ResponseEntity.status(HttpStatus.FORBIDDEN).body(body);
	}

	@ExceptionHandler(MaxUploadSizeExceededException.class)
	public ResponseEntity<ApiError> handleMaxUploadSizeExceeded(MaxUploadSizeExceededException ex, HttpServletRequest req) {
		ApiError body = new ApiError(
				Instant.now(),
				HttpStatus.PAYLOAD_TOO_LARGE.value(),
				"File Size Exceeded",
				"The uploaded file exceeds the maximum allowed size of 50MB.",
				req.getRequestURI(),
				null
		);
		return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).body(body);
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ApiError> handleGeneric(Exception ex, HttpServletRequest req) {
		// Log the full exception for debugging
		System.err.println("Unexpected error occurred: " + ex.getClass().getSimpleName() + " - " + ex.getMessage());
		ex.printStackTrace();
		
		ApiError body = new ApiError(
				Instant.now(),
				HttpStatus.INTERNAL_SERVER_ERROR.value(),
				"Internal Server Error",
				"An unexpected error occurred. Please try again later.",
				req.getRequestURI(),
				null
		);
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
	}

	@ExceptionHandler(IllegalStateException.class)
	public ResponseEntity<ApiError> handleIllegalState(IllegalStateException ex, HttpServletRequest req) {
		ApiError body = new ApiError(
				Instant.now(),
				HttpStatus.BAD_REQUEST.value(),
				"Invalid State",
				ex.getMessage(),
				req.getRequestURI(),
				null
		);
		return ResponseEntity.badRequest().body(body);
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

