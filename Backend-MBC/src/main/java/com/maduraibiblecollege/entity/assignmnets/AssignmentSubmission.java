package com.maduraibiblecollege.entity.assignmnets;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.List;

import com.maduraibiblecollege.entity.User;

@Entity
@Table(name = "assignment_submissions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignmentSubmission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignment_id")
    private Assignment assignment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    private User student;

    @Column(columnDefinition = "TEXT")
    private String textAnswer;

    private Instant submittedAt;

    @Enumerated(EnumType.STRING)
    private SubmissionStatus status; // SUBMITTED, REJECTED, GRADED, DRAFT

    private Integer marksObtained;
    private String teacherRemarks;

    @OneToMany(mappedBy = "submission", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SubmissionAttachment> attachments;

    private Integer attemptNumber;
}
