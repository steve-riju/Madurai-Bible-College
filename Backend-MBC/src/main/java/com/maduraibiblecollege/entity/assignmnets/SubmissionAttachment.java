package com.maduraibiblecollege.entity.assignmnets;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "submission_attachments")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class SubmissionAttachment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileUrl;
    private String fileName;
    private String contentType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submission_id")
    private AssignmentSubmission submission;
}
