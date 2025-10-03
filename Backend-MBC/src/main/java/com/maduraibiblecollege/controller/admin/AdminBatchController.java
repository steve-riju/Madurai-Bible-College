package com.maduraibiblecollege.controller.admin;


import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.maduraibiblecollege.dto.BatchCourseRequest;
import com.maduraibiblecollege.dto.BatchCreateRequest;
import com.maduraibiblecollege.dto.BatchDto;
import com.maduraibiblecollege.dto.BatchEnrollmentRequest;
import com.maduraibiblecollege.dto.CreateBatchWithEnrollmentsRequest;
import com.maduraibiblecollege.entity.User;
import com.maduraibiblecollege.repository.UserRepository;
import com.maduraibiblecollege.service.BatchService;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/admin/batches")
@RequiredArgsConstructor
public class AdminBatchController {

	private final BatchService batchService;
	private final UserRepository userRepository;

	@PostMapping
	public ResponseEntity<BatchDto> createBatch(@RequestBody BatchCreateRequest request) {
		return ResponseEntity.ok(batchService.createBatch(request));
	}

	@PutMapping("/{id}/students")
	public ResponseEntity<BatchDto> addStudents(@PathVariable Long id, @RequestBody BatchEnrollmentRequest request) {
		return ResponseEntity.ok(batchService.addStudents(id, request));
	}

	@PutMapping("/{id}/courses")
	public ResponseEntity<BatchDto> addCourses(@PathVariable Long id, @RequestBody BatchCourseRequest request) {
		return ResponseEntity.ok(batchService.addCourses(id, request));
	}

	@GetMapping("/{id}")
	public ResponseEntity<BatchDto> getBatch(@PathVariable Long id) {
		return ResponseEntity.ok(batchService.getBatch(id));
	}

	@GetMapping("/search")
	public ResponseEntity<List<BatchDto>> search(@RequestParam String name) {
		return ResponseEntity.ok(batchService.searchBatches(name));
	}

	@PostMapping("/with-enrollments")
	public ResponseEntity<BatchDto> createBatchWithEnrollments(@RequestBody CreateBatchWithEnrollmentsRequest request) {
		return ResponseEntity.ok(batchService.createBatchWithEnrollments(request));
	}
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteBatch(@PathVariable Long id) {
		batchService.deleteBatch(id);
		return ResponseEntity.noContent().build();
	}

	@GetMapping("/student/my-batches")
	public ResponseEntity<List<BatchDto>> getMyBatches(Principal principal) {
		User student = userRepository.findByUsername(principal.getName())
				.orElseThrow(() -> new UsernameNotFoundException("Student not found"));
		return ResponseEntity.ok(batchService.getBatchesForStudent(student.getId()));
	}


}

