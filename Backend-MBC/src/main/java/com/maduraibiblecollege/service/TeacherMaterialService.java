package com.maduraibiblecollege.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.maduraibiblecollege.dto.MaterialDto;

public interface TeacherMaterialService {
    MaterialDto uploadMaterial(MultipartFile file, String title, String description, Long courseId, String teacherUsername);
    List<MaterialDto> getMaterialsByCourse(Long courseId);
    List<MaterialDto> getMaterialsByTeacher(Long teacherId);
	MaterialDto updateMaterial(Long id, MaterialDto updatedMaterial);
	void deleteMaterial(Long id);
}


