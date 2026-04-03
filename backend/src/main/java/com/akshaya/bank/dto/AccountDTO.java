package com.akshaya.bank.dto;

import com.akshaya.bank.entity.BankAccount;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class AccountDTO {
    @Data
    public static class CreateRequest {
        @NotNull private Long userId;
        @NotNull private BankAccount.AccountType accountType;
        @NotNull @PositiveOrZero private BigDecimal initialDeposit;
    }

    @Data
    public static class UpdateRequest {
        private BankAccount.AccountStatus status;
        private BankAccount.AccountType accountType;
    }

    @Data
    public static class Response {
        private Long id;
        private String accountNumber;
        private BankAccount.AccountType accountType;
        private BigDecimal balance;
        private BankAccount.AccountStatus status;
        private Long userId;
        private String userFullName;
        private String userEmail;
        private LocalDateTime createdAt;

        public static Response from(BankAccount a) {
            Response r = new Response();
            r.id=a.getId(); r.accountNumber=a.getAccountNumber();
            r.accountType=a.getAccountType(); r.balance=a.getBalance();
            r.status=a.getStatus(); r.userId=a.getUser().getId();
            r.userFullName=a.getUser().getFullName(); r.userEmail=a.getUser().getEmail();
            r.createdAt=a.getCreatedAt();
            return r;
        }
    }
}
