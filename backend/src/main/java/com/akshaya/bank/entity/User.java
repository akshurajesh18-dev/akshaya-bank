package com.akshaya.bank.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity @Table(name="users")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class User {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false, unique=true)
    private String email;

    @Column(nullable=false)
    private String password;

    @Column(nullable=false)
    private String fullName;

    @Column(nullable=false)
    private String phone;

    @Column(nullable=false)
    private String address;

    @Enumerated(EnumType.STRING) @Column(nullable=false)
    private Role role;

    @Builder.Default
    @Column(nullable=false)
    private Boolean isActive = true;

    @Column(updatable=false)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy="user", cascade=CascadeType.ALL, fetch=FetchType.LAZY)
    private List<BankAccount> accounts;

    @PrePersist void onCreate(){ createdAt=updatedAt=LocalDateTime.now(); }
    @PreUpdate  void onUpdate(){ updatedAt=LocalDateTime.now(); }

    public enum Role { ADMIN, CUSTOMER }
}
