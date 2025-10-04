package com.maduraibiblecollege;

import lombok.Data;

@Data
public class RejectRequest {
    private Long submissionId;
    private String reason;
}

