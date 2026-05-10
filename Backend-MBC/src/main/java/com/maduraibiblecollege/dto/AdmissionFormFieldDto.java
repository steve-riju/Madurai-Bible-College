package com.maduraibiblecollege.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdmissionFormFieldDto {
    private String key;
    private String label;
    private String type;
    private boolean required;
    private Integer maxLength;
    private List<String> options;
}
