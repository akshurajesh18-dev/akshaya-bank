package com.akshaya.bank.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity @Table(name="bank_accounts")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class BankAccount {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false, unique=true, length=12)
    private String accountNumber;

    @Enumerated(EnumType.STRING) @Column(nullable=false)
    private AccountType accountType;

    @Builder.Default
    @Column(nullable=false, precision=15, scale=2)
    private BigDecimal balance = BigDecimal.ZERO;

    @Builder.Default
    @Enumerated(EnumType.STRING) @Column(nullable=false)
    private AccountStatus status = AccountStatus.ACTIVE;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="user_id", nullable=false)
    private User user;

    @Column(updatable=false)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy="account", cascade=CascadeType.ALL, fetch=FetchType.LAZY)
    private List<Transaction> transactions;

    @PrePersist void onCreate(){ createdAt=updatedAt=LocalDateTime.now(); }
    @PreUpdate  void onUpdate(){ updatedAt=LocalDateTime.now(); }

    public enum AccountType   { SAVINGS, CURRENT, FIXED_DEPOSIT }
    public enum AccountStatus { ACTIVE, INACTIVE, FROZEN, CLOSED }
}
