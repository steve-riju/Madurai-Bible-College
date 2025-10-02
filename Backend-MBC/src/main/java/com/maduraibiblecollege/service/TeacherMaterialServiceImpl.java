package com.maduraibiblecollege.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.maduraibiblecollege.dto.MaterialDto;
import com.maduraibiblecollege.entity.Course;
import com.maduraibiblecollege.entity.Material;
import com.maduraibiblecollege.entity.User;
import com.maduraibiblecollege.repository.CourseRepository;
import com.maduraibiblecollege.repository.MaterialRepository;
import com.maduraibiblecollege.repository.UserRepository;
import com.maduraibiblecollege.service.cloud.CloudStorageService;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class TeacherMaterialServiceImpl implements TeacherMaterialService {

    private final MaterialRepository materialRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final CloudStorageService cloudStorageService; 

    @Override
    public MaterialDto uploadMaterial(MultipartFile file, String title, String description, Long courseId, String teacherUsername) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        User teacher = userRepository.findByUsername(teacherUsername)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        String fileKey = cloudStorageService.uploadFile(file);

        Material material = new Material();
        material.setTitle(title);
        material.setDescription(description);
        material.setFileKey(fileKey); // ✅ store key
        material.setUploadedAt(LocalDateTime.now());
        material.setCourse(course);
        material.setTeacher(teacher);

        Material saved = materialRepository.save(material);

        return new MaterialDto(
                saved.getId(), saved.getTitle(), saved.getDescription(),
                null, saved.getUploadedAt(), // fileUrl = null here
                course.getId(), course.getName(),
                teacher.getId(), teacher.getName()
        );
    }

    @Override
    @Transactional
    public void deleteMaterial(Long id) {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Material not found"));

        try {
            // Delete file from Cloudflare R2
            cloudStorageService.deleteFile(material.getFileKey());

            // Delete material from DB
            materialRepository.deleteById(id);

        } catch (Exception e) {
            throw new RuntimeException("Failed to delete material and file: " + e.getMessage(), e);
        }
    }



    @Override
    public List<MaterialDto> getMaterialsByCourse(Long courseId) {
        return materialRepository.findByCourseId(courseId).stream()
                .map(m -> new MaterialDto(
                        m.getId(),
                        m.getTitle(),
                        m.getDescription(),
                        m.getFileKey() != null ? cloudStorageService.generateSignedUrl(m.getFileKey()) : null, // ✅ signed URL
                        m.getUploadedAt(),
                        m.getCourse().getId(),
                        m.getCourse().getName(),
                        m.getTeacher().getId(),
                        m.getTeacher().getName()
                ))
                .toList();
    }


    @Override
    public List<MaterialDto> getMaterialsByTeacher(Long teacherId) {
        return materialRepository.findByTeacherId(teacherId).stream()
                .map(m -> new MaterialDto(
                        m.getId(), m.getTitle(), m.getDescription(), m.getFileKey() != null ? cloudStorageService.generateSignedUrl(m.getFileKey()) : null,
                        m.getUploadedAt(),
                        m.getCourse().getId(), m.getCourse().getName(),
                        m.getTeacher().getId(), m.getTeacher().getName()
                ))
                .toList();
    }

    @Override
    public MaterialDto updateMaterial(Long id, MaterialDto updatedMaterial) {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Material not found"));

        material.setTitle(updatedMaterial.getTitle());
        material.setDescription(updatedMaterial.getDescription());

        Material saved = materialRepository.save(material);

        return new MaterialDto(
                saved.getId(), saved.getTitle(), saved.getDescription(),
                saved.getFileUrl(), saved.getUploadedAt(),
                saved.getCourse().getId(), saved.getCourse().getName(),
                saved.getTeacher().getId(), saved.getTeacher().getName()
        );
    }


}
