package com.maduraibiblecollege.controller.teacher;


import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.maduraibiblecollege.dto.CourseDto;
import com.maduraibiblecollege.dto.MaterialDto;
import com.maduraibiblecollege.service.CourseService;
import com.maduraibiblecollege.service.TeacherMaterialService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/teacher/materials")
@RequiredArgsConstructor
public class TeacherMaterialController {

    private final TeacherMaterialService materialService;
    private final CourseService courseService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MaterialDto> uploadMaterial(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("courseId") Long courseId,
            @RequestParam("teacherUsername") String teacherUsername
    ) {
        return ResponseEntity.ok(
            materialService.uploadMaterial(file, title, description, courseId, teacherUsername)
        );
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<MaterialDto>> getByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(materialService.getMaterialsByCourse(courseId));
    }

    @GetMapping("/assigned/teacher/username/{username}")
    public ResponseEntity<List<CourseDto>> getCoursesByTeacherUsername(@PathVariable String username) {
        return ResponseEntity.ok(courseService.getCoursesByTeacherUsername(username));
    }

    // 🔹 Update existing material (title + description only)
    @PutMapping("/{id}")
    public ResponseEntity<MaterialDto> updateMaterial(
            @PathVariable Long id,
            @RequestBody MaterialDto updatedMaterial
    ) {
        return ResponseEntity.ok(materialService.updateMaterial(id, updatedMaterial));
    }

    // 🔹 Delete material
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMaterial(@PathVariable Long id) {
        materialService.deleteMaterial(id);
        return ResponseEntity.noContent().build();
    }
    
//    ON DELETION FILE SHOULD ALSO BE DELETED FROM THE CLOUD STORAGE WHICH IS NOT HAPPENING NOW BUILD THAT ONCE REGISTED WITH COULD STORAGE
}

