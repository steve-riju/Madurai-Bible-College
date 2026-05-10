package com.maduraibiblecollege.service;

import org.springframework.stereotype.Service;

import com.maduraibiblecollege.dto.AdminDashboardDto;
import com.maduraibiblecollege.entity.AdmissionSubmissionStatus;
import com.maduraibiblecollege.entity.Role;
import com.maduraibiblecollege.repository.AdmissionSubmissionRepository;
import com.maduraibiblecollege.repository.CourseRepository;
import com.maduraibiblecollege.repository.EnrollmentRepository;
import com.maduraibiblecollege.repository.UserRepository;

//import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
//import java.util.stream.Collectors;

@Service
public class AdminDashboardServiceImpl implements AdminDashboardService {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final AdmissionSubmissionRepository admissionSubmissionRepository;
//    private final AdmissionRepository admissionRepository; // optional
//    private final OfferingRepository offeringRepository; // optional
//    private final EventRepository eventRepository; // optional

    public AdminDashboardServiceImpl(
            UserRepository userRepository,
            CourseRepository courseRepository,
            EnrollmentRepository enrollmentRepository,
            AdmissionSubmissionRepository admissionSubmissionRepository //,
//            AdmissionRepository admissionRepository,
//            OfferingRepository offeringRepository,
//            EventRepository eventRepository
    ) {
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.admissionSubmissionRepository = admissionSubmissionRepository;
//        this.admissionRepository = admissionRepository;
//        this.offeringRepository = offeringRepository;
//        this.eventRepository = eventRepository;
    }

    @Override
    public AdminDashboardDto getDashboardSummary() {
        AdminDashboardDto dto = new AdminDashboardDto();

        // Users
        AdminDashboardDto.UserStats userStats = new AdminDashboardDto.UserStats();
        userStats.students = safeCount(() -> userRepository.countByRole(Role.STUDENT));
        userStats.teachers = safeCount(() -> userRepository.countByRole(Role.TEACHER));
        userStats.admins = safeCount(() -> userRepository.countByRole(Role.ADMIN));
        dto.userStats = userStats;

        // Courses
        AdminDashboardDto.CourseStats courseStats = new AdminDashboardDto.CourseStats();
        courseStats.totalCourses = safeCount(() -> courseRepository.count());
        // these methods assume boolean 'active' in Course
        courseStats.active = safeCount(() -> courseRepository.countByActiveTrue());
        courseStats.inactive = safeCount(() -> courseRepository.countByActiveFalse());
        dto.courseStats = courseStats;

        // Enrollments: simple current vs previous (example uses month buckets)
        AdminDashboardDto.EnrollmentStats enrollmentStats = new AdminDashboardDto.EnrollmentStats();
        YearMonth now = YearMonth.now();
        LocalDate startCurrent = now.atDay(1);
        LocalDate endCurrent = now.atEndOfMonth();
        YearMonth prev = now.minusMonths(1);
        LocalDate startPrev = prev.atDay(1);
        LocalDate endPrev = prev.atEndOfMonth();

        // If Enrollment has createdAt LocalDate/LocalDateTime methods:
        long currentEnrollments = safeCount(() ->
                enrollmentRepository.countByEnrolledAtBetween(startCurrent.atStartOfDay(), endCurrent.atTime(23,59,59))
        );
        long previousEnrollments = safeCount(() ->
                enrollmentRepository.countByEnrolledAtBetween(startPrev.atStartOfDay(), endPrev.atTime(23,59,59))
        );

        // fallback if those repo methods are not present: use total count
        if (currentEnrollments == -1 || previousEnrollments == -1) {
            currentEnrollments = safeCount(() -> enrollmentRepository.count());
            previousEnrollments = 0;
        }

        enrollmentStats.current = currentEnrollments;
        enrollmentStats.previous = previousEnrollments;
        dto.enrollmentStats = enrollmentStats;

        AdminDashboardDto.AdmissionsStats admissionsStats = new AdminDashboardDto.AdmissionsStats();
        admissionsStats.pending = safeCount(() -> admissionSubmissionRepository.countByStatus(AdmissionSubmissionStatus.PENDING));
        admissionsStats.approved = safeCount(() -> admissionSubmissionRepository.countByStatus(AdmissionSubmissionStatus.ACCEPTED));
        admissionsStats.rejected = safeCount(() -> admissionSubmissionRepository.countByStatus(AdmissionSubmissionStatus.REJECTED));
        dto.admissionsStats = admissionsStats;
        dto.admissions = admissionSubmissionRepository.findTop5ByOrderBySubmittedAtDesc()
                .stream()
                .map(a -> {
                    AdminDashboardDto.SimpleAdmissionDto s = new AdminDashboardDto.SimpleAdmissionDto();
                    s.id = a.getId();
                    s.name = a.getFullNameWithInitials();
                    s.status = toDashboardAdmissionStatus(a.getStatus());
                    return s;
                }).toList();
        dto.recentAdmissions = dto.admissions;
//
//        // Offerings (optional)
//        if (offeringRepository != null) {
//            YearMonth ym = YearMonth.now();
//            LocalDate monthStart = ym.atDay(1);
//            LocalDate monthEnd = ym.atEndOfMonth();
//
//            BigDecimal totalThisMonth = offeringRepository.sumAmountBetween(monthStart, monthEnd);
//            BigDecimal totalThisYear = offeringRepository.sumAmountBetween(ym.atDay(1).withDayOfMonth(1), ym.atEndOfMonth()); // adjust for year range to Jan..Dec if desired
//
//            AdminDashboardDto.OfferingsSummary summary = new AdminDashboardDto.OfferingsSummary();
//            summary.totalThisMonth = totalThisMonth == null ? BigDecimal.ZERO : totalThisMonth;
//            summary.totalThisYear = totalThisYear == null ? BigDecimal.ZERO : totalThisYear;
//            dto.offerings = summary;
//
//            dto.recentOfferings = offeringRepository.findTop5ByOrderByDateDesc()
//                    .stream()
//                    .map(o -> {
//                        AdminDashboardDto.OfferingDto od = new AdminDashboardDto.OfferingDto();
//                        od.id = o.getId();
//                        od.donor = o.getDonorName();
//                        od.amount = o.getAmount();
//                        od.date = o.getDate();
//                        return od;
//                    }).collect(Collectors.toList());
//        }
//
//        // Events (optional)
//        if (eventRepository != null) {
//            LocalDate today = LocalDate.now();
//            dto.events = eventRepository.findTop5ByDateAfterOrderByDateAsc(today)
//                    .stream()
//                    .map(e -> {
//                        AdminDashboardDto.EventDto ed = new AdminDashboardDto.EventDto();
//                        ed.id = e.getId();
//                        ed.title = e.getTitle();
//                        ed.date = e.getDate();
//                        return ed;
//                    }).collect(Collectors.toList());
//        }

        return dto;
    }

    // utility to catch missing methods (returns -1 on exception)
    private long safeCount(SupplierWithException<Long> supplier) {
        try {
            Long v = supplier.get();
            return v == null ? 0L : v;
        } catch (Throwable ex) {
            // repo method not present or other error -> return -1 for caller to fallback
            return -1L;
        }
    }

    @FunctionalInterface
    private interface SupplierWithException<T> {
        T get() throws Exception;
    }

    private String toDashboardAdmissionStatus(AdmissionSubmissionStatus status) {
        if (status == null) return "Pending";
        return switch (status) {
            case ACCEPTED -> "Approved";
            case REJECTED -> "Rejected";
            case REVIEWED -> "Reviewed";
            case PENDING -> "Pending";
        };
    }
}

