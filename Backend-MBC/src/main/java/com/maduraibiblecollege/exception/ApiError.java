package com.maduraibiblecollege.exception;

//ApiError.java (simple error payload)
import java.time.Instant;
import java.util.List;

public record ApiError(
     Instant timestamp,
     int status,
     String error,
     String message,
     String path,
     List<String> details
) {}

