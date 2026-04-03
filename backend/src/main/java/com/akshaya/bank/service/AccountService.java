package com.akshaya.bank.service;

import com.akshaya.bank.dto.AccountDTO;
import com.akshaya.bank.entity.BankAccount;
import com.akshaya.bank.entity.Transaction;
import com.akshaya.bank.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor
public class AccountService {
    private final BankAccountRepository accountRepo;
    private final com.akshaya.bank.repository.UserRepository userRepo;
    private final TransactionRepository txRepo;

    @Transactional
    public AccountDTO.Response createAccount(AccountDTO.CreateRequest req) {
        var user = userRepo.findById(req.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String accNo = generateAccountNumber();
        BankAccount account = BankAccount.builder()
                .accountNumber(accNo)
                .accountType(req.getAccountType())
                .balance(req.getInitialDeposit())
                .status(BankAccount.AccountStatus.ACTIVE)
                .user(user)
                .build();
        account = accountRepo.save(account);

        // Record initial deposit if > 0
        if (req.getInitialDeposit().compareTo(BigDecimal.ZERO) > 0) {
            Transaction tx = Transaction.builder()
                    .transactionId("TXN" + System.currentTimeMillis())
                    .type(Transaction.TransactionType.DEPOSIT)
                    .amount(req.getInitialDeposit())
                    .balanceBefore(BigDecimal.ZERO)
                    .balanceAfter(req.getInitialDeposit())
                    .description("Initial deposit")
                    .status(Transaction.TransactionStatus.SUCCESS)
                    .account(account)
                    .build();
            txRepo.save(tx);
        }
        return AccountDTO.Response.from(account);
    }

    public List<AccountDTO.Response> getAllAccounts() {
        return accountRepo.findAll().stream()
                .map(AccountDTO.Response::from).collect(Collectors.toList());
    }

    public List<AccountDTO.Response> getAccountsByUser(Long userId) {
        return accountRepo.findByUserId(userId).stream()
                .map(AccountDTO.Response::from).collect(Collectors.toList());
    }

    public AccountDTO.Response getByAccountNumber(String accNo) {
        return AccountDTO.Response.from(accountRepo.findByAccountNumber(accNo)
                .orElseThrow(() -> new RuntimeException("Account not found: " + accNo)));
    }

    public AccountDTO.Response updateAccount(Long id, AccountDTO.UpdateRequest req) {
        BankAccount acc = accountRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        if (req.getStatus()      != null) acc.setStatus(req.getStatus());
        if (req.getAccountType() != null) acc.setAccountType(req.getAccountType());
        return AccountDTO.Response.from(accountRepo.save(acc));
    }

    private String generateAccountNumber() {
        String accNo;
        do {
            accNo = String.format("%012d", (long)(Math.random() * 1_000_000_000_000L));
        } while (accountRepo.existsByAccountNumber(accNo));
        return accNo;
    }
}
