package com.akshaya.bank.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity @Table(name="transactions")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Transaction {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false, unique=true)
    private String transactionId;

    @Enumerated(EnumType.STRING) @Column(nullable=false)
    private TransactionType type;

    @Column(nullable=false, precision=15, scale=2)
    private BigDecimal amount;

    @Column(nullable=false, precision=15, scale=2)
    private BigDecimal balanceBefore;

    @Column(nullable=false, precision=15, scale=2)
    private BigDecimal balanceAfter;

    private String description;
    private String referenceAccountNumber;

    @Builder.Default
    @Enumerated(EnumType.STRING) @Column(nullable=false)
    private TransactionStatus status = TransactionStatus.SUCCESS;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="account_id", nullable=false)
    private BankAccount account;

    @Column(updatable=false)
    private LocalDateTime createdAt;

    @PrePersist void onCreate(){ createdAt=LocalDateTime.now(); }

    public enum TransactionType   { DEPOSIT, WITHDRAWAL, TRANSFER_IN, TRANSFER_OUT }
    public enum TransactionStatus { SUCCESS, FAILED, PENDING }
}
