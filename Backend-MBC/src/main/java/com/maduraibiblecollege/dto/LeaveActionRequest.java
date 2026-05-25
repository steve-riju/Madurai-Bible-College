package com.maduraibiblecollege.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class LeaveActionRequest {

    @Size(max = 1000)
    private String remarks;
}
