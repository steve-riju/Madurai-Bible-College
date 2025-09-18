package com.maduraibiblecollege.entity.assignmnets;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.List;

import com.maduraibiblecollege.entity.Batch;
import com.maduraibiblecollege.entity.User;

@Entity
@Table(name = "assignments")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Assignment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    // provided you have Batch entity
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "batch_id")
    private Batch batch;

    private Instant startDate;
    private Instant endDate;

    private Integer maxMarks;

    @Enumerated(EnumType.STRING)
    private AssignmentStatus status; // DRAFT, PUBLISHED, ARCHIVED

    // optional teacher owner
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id")
    private User teacher;

    @OneToMany(mappedBy = "assignment", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AssignmentAttachment> attachments;
}

