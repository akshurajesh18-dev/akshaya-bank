package com.akshaya.bank.dto;

import com.akshaya.bank.entity.Transaction;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TransactionDTO {
    @Data
    public static class DepositRequest {
        @NotBlank private String accountNumber;
        @NotNull @Positive private BigDecimal amount;
        private String description;
    }

    @Data
    public static class WithdrawRequest {
        @NotBlank private String accountNumber;
        @NotNull @Positive private BigDecimal amount;
        private String description;
    }

    @Data
    public static class TransferRequest {
        @NotBlank private String fromAccountNumber;
        @NotBlank private String toAccountNumber;
        @NotNull @Positive private BigDecimal amount;
        private String description;
    }

    @Data
    public static class Response {
        private Long id;
        private String transactionId;
        private Transaction.TransactionType type;
        private BigDecimal amount;
        private BigDecimal balanceBefore;
        private BigDecimal balanceAfter;
        private String description;
        private String referenceAccountNumber;
        private Transaction.TransactionStatus status;
        private String accountNumber;
        private LocalDateTime createdAt;

        public static Response from(Transaction t) {
            Response r = new Response();
            r.id=t.getId(); r.transactionId=t.getTransactionId(); r.type=t.getType();
            r.amount=t.getAmount(); r.balanceBefore=t.getBalanceBefore();
            r.balanceAfter=t.getBalanceAfter(); r.description=t.getDescription();
            r.referenceAccountNumber=t.getReferenceAccountNumber(); r.status=t.getStatus();
            r.accountNumber=t.getAccount().getAccountNumber(); r.createdAt=t.getCreatedAt();
            return r;
        }
    }
}
