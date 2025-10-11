package com.maduraibiblecollege.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionAttachmentDto {
    private String fileName;
    private String fileUrl; // signed URL
    private String contentType;
}

