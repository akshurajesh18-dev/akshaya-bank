package com.akshaya.bank;

import com.akshaya.bank.entity.User;
import com.akshaya.bank.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class BankApplication {
    public static void main(String[] args) {
        SpringApplication.run(BankApplication.class, args);
    }

    @Bean
    CommandLineRunner seedAdmin(UserRepository users, PasswordEncoder encoder) {
        return args -> {
            if (!users.existsByEmail("gaddamakshaya@gmail.com")) {
                users.save(User.builder()
                        .email("gaddamakshaya@gmail.com")
                        .password(encoder.encode("akshaya@123"))
                        .fullName("Akshaya Gaddam")
                        .phone("9999999999")
                        .address("Hyderabad, Telangana")
                        .role(User.Role.ADMIN)
                        .isActive(true)
                        .build());
                System.out.println(">>> Admin seeded: gaddamakshaya@gmail.com / akshaya@123");
            }
        };
    }
}
