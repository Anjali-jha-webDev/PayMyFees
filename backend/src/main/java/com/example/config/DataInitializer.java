package com.example.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.example.model.*;
import com.example.repository.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;
    private final ReceiptRepository receiptRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final CourseRepository courseRepository;
    private final CourseFeeRepository courseFeeRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           PaymentRepository paymentRepository,
                           ReceiptRepository receiptRepository,
                           StudentProfileRepository studentProfileRepository,
                           CourseRepository courseRepository,
                           CourseFeeRepository courseFeeRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository           = userRepository;
        this.paymentRepository        = paymentRepository;
        this.receiptRepository        = receiptRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.courseRepository         = courseRepository;
        this.courseFeeRepository      = courseFeeRepository;
        this.passwordEncoder          = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Guard: only seed once — skip if admin already exists
        if (userRepository.findByUsername("admin") != null) return;

        // ── ADMIN USER ───────────────────────────────────────────────────────
        User admin = new User();
        admin.setUsername("admin");
        admin.setEmail("admin@college.edu");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole("ADMIN");
        userRepository.save(admin);

        // ── COURSES ──────────────────────────────────────────────────────────
        Course bca = new Course();
        bca.setName("BCA");
        bca.setDuration("3 Years");
        courseRepository.save(bca);

        Course btech = new Course();
        btech.setName("B.Tech");
        btech.setDuration("4 Years");
        courseRepository.save(btech);

        // ── FEES FOR BCA ─────────────────────────────────────────────────────
        CourseFee bcaTuition = new CourseFee();
        bcaTuition.setCourse(bca);
        bcaTuition.setFeeLabel("Tuition Fee");
        bcaTuition.setAmount(new BigDecimal("15000"));
        bcaTuition.setDueDate(LocalDate.of(2025, 6, 30));
        courseFeeRepository.save(bcaTuition);

        CourseFee bcaLibrary = new CourseFee();
        bcaLibrary.setCourse(bca);
        bcaLibrary.setFeeLabel("Library Fee");
        bcaLibrary.setAmount(new BigDecimal("500"));
        bcaLibrary.setDueDate(LocalDate.of(2025, 6, 30));
        courseFeeRepository.save(bcaLibrary);

        CourseFee bcaExam = new CourseFee();
        bcaExam.setCourse(bca);
        bcaExam.setFeeLabel("Exam Fee");
        bcaExam.setAmount(new BigDecimal("1000"));
        bcaExam.setDueDate(LocalDate.of(2025, 11, 30));
        courseFeeRepository.save(bcaExam);

        // ── FEES FOR B.TECH ──────────────────────────────────────────────────
        CourseFee btechTuition = new CourseFee();
        btechTuition.setCourse(btech);
        btechTuition.setFeeLabel("Tuition Fee");
        btechTuition.setAmount(new BigDecimal("25000"));
        btechTuition.setDueDate(LocalDate.of(2025, 6, 30));
        courseFeeRepository.save(btechTuition);

        CourseFee btechLab = new CourseFee();
        btechLab.setCourse(btech);
        btechLab.setFeeLabel("Lab Fee");
        btechLab.setAmount(new BigDecimal("3000"));
        btechLab.setDueDate(LocalDate.of(2025, 6, 30));
        courseFeeRepository.save(btechLab);

        // ── DEMO STUDENT ─────────────────────────────────────────────────────
        User student = new User();
        student.setUsername("john_doe");
        student.setEmail("john.doe@college.edu");
        student.setPassword(passwordEncoder.encode("password123"));
        student.setRole("STUDENT");
        student.setCourse(bca);
        userRepository.save(student);

        // ── STUDENT PROFILE ──────────────────────────────────────────────────
        StudentProfile profile = new StudentProfile();
        profile.setUser(student);
        profile.setStudentId("STU2025001");
        profile.setEnrollmentYear("2022");
        profile.setProgram("BCA");
        profile.setPhone("+91-9999999999");
        profile.setAddress("123 Main St, Mumbai");
        studentProfileRepository.save(profile);

        // ── DEMO PAYMENTS ────────────────────────────────────────────────────
        Payment payment1 = new Payment();
        payment1.setUser(student);
        payment1.setTransactionId("T123456");
        payment1.setPaymentDate(LocalDate.of(2025, 3, 15));
        payment1.setAmount(new BigDecimal("15000"));
        payment1.setStatus("PAID");
        payment1.setPaymentMethod("UPI");
        paymentRepository.save(payment1);

        Payment payment2 = new Payment();
        payment2.setUser(student);
        payment2.setTransactionId("T123457");
        payment2.setPaymentDate(LocalDate.of(2025, 2, 1));
        payment2.setAmount(new BigDecimal("500"));
        payment2.setStatus("PAID");
        payment2.setPaymentMethod("Credit Card");
        paymentRepository.save(payment2);

        // ── DEMO RECEIPT ─────────────────────────────────────────────────────
        Receipt receipt1 = new Receipt();
        receipt1.setUser(student);
        receipt1.setReceiptId("R001");
        receipt1.setReceiptDate(LocalDate.of(2025, 3, 15));
        receipt1.setAmount(new BigDecimal("15000"));
        receipt1.setPaymentMethod("UPI");
        receipt1.setStatus("PAID");
        receiptRepository.save(receipt1);

        System.out.println("✅ Sample data initialized!");
        System.out.println("   Admin   → username: admin     / password: admin123");
        System.out.println("   Student → username: john_doe  / password: password123");
    }
}