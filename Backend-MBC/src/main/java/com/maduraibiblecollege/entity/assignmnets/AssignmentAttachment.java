package com.maduraibiblecollege.entity.assignmnets;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "assignment_attachments")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class AssignmentAttachment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileUrl; // R2 public or signed URL
    private String fileName;
    private String contentType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignment_id")
    private Assignment assignment;
}

