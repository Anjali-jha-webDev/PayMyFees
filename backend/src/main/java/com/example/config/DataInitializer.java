package com.example.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import com.example.model.*;
import com.example.repository.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final FeeRepository feeRepository;
    private final PaymentRepository paymentRepository;
    private final ReceiptRepository receiptRepository;
    private final StudentProfileRepository studentProfileRepository;

    public DataInitializer(UserRepository userRepository, FeeRepository feeRepository,
                          PaymentRepository paymentRepository, ReceiptRepository receiptRepository,
                          StudentProfileRepository studentProfileRepository) {
        this.userRepository = userRepository;
        this.feeRepository = feeRepository;
        this.paymentRepository = paymentRepository;
        this.receiptRepository = receiptRepository;
        this.studentProfileRepository = studentProfileRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Check if data already exists
        if (userRepository.count() > 1) {
            return; // Data already initialized
        }

        // Create a test student user
        User student = new User();
        student.setUsername("john_doe");
        student.setEmail("john.doe@college.edu");
        student.setPassword("password123"); // In production, this should be hashed
        student.setRole("STUDENT");
        userRepository.save(student);

        // Create student profile
        StudentProfile profile = new StudentProfile();
        profile.setUser(student);
        profile.setStudentId("STU001");
        profile.setEnrollmentYear("2022");
        profile.setProgram("Computer Science");
        profile.setPhone("+1-555-0123");
        profile.setAddress("123 Main St, College City, State 12345");
        studentProfileRepository.save(profile);

        // Create fees for the student
        Fee academicFee = new Fee();
        academicFee.setUser(student);
        academicFee.setLabel("Academic Fee");
        academicFee.setAmount(new BigDecimal("3000"));
        academicFee.setDueDate(LocalDate.of(2024, 9, 30));
        academicFee.setStatus("PAID");
        feeRepository.save(academicFee);

        Fee libraryFee = new Fee();
        libraryFee.setUser(student);
        libraryFee.setLabel("Library Fee");
        libraryFee.setAmount(new BigDecimal("500"));
        libraryFee.setDueDate(LocalDate.of(2024, 10, 15));
        libraryFee.setStatus("PAID");
        feeRepository.save(libraryFee);

        Fee hostelFee = new Fee();
        hostelFee.setUser(student);
        hostelFee.setLabel("Hostel/Transport");
        hostelFee.setAmount(new BigDecimal("1000"));
        hostelFee.setDueDate(LocalDate.of(2024, 8, 31));
        hostelFee.setStatus("PENDING");
        feeRepository.save(hostelFee);

        Fee examFee = new Fee();
        examFee.setUser(student);
        examFee.setLabel("Exam Fee");
        examFee.setAmount(new BigDecimal("500"));
        examFee.setDueDate(LocalDate.of(2024, 11, 30));
        examFee.setStatus("PENDING");
        feeRepository.save(examFee);

        // Create payment records
        Payment payment1 = new Payment();
        payment1.setUser(student);
        payment1.setTransactionId("T123456");
        payment1.setPaymentDate(LocalDate.of(2024, 9, 15));
        payment1.setAmount(new BigDecimal("2000"));
        payment1.setStatus("Paid");
        payment1.setPaymentMethod("Credit Card");
        paymentRepository.save(payment1);

        Payment payment2 = new Payment();
        payment2.setUser(student);
        payment2.setTransactionId("T1AE457");
        payment2.setPaymentDate(LocalDate.of(2024, 8, 1));
        payment2.setAmount(new BigDecimal("1500"));
        payment2.setStatus("Paid");
        payment2.setPaymentMethod("Bank Transfer");
        paymentRepository.save(payment2);

        Payment payment3 = new Payment();
        payment3.setUser(student);
        payment3.setTransactionId("T125458");
        payment3.setPaymentDate(LocalDate.of(2024, 10, 1));
        payment3.setAmount(new BigDecimal("1500"));
        payment3.setStatus("Partial");
        payment3.setPaymentMethod("UPI");
        paymentRepository.save(payment3);

        // Create receipts
        Receipt receipt1 = new Receipt();
        receipt1.setUser(student);
        receipt1.setReceiptId("R001");
        receipt1.setReceiptDate(LocalDate.of(2024, 9, 15));
        receipt1.setAmount(new BigDecimal("2000"));
        receipt1.setPaymentMethod("Credit Card");
        receipt1.setStatus("Received");
        receiptRepository.save(receipt1);

        Receipt receipt2 = new Receipt();
        receipt2.setUser(student);
        receipt2.setReceiptId("R002");
        receipt2.setReceiptDate(LocalDate.of(2024, 8, 1));
        receipt2.setAmount(new BigDecimal("1500"));
        receipt2.setPaymentMethod("Bank Transfer");
        receipt2.setStatus("Received");
        receiptRepository.save(receipt2);

        System.out.println("✅ Sample data initialized successfully!");
    }
}
