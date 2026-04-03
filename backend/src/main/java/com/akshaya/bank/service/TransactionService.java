package com.akshaya.bank.service;

import com.akshaya.bank.dto.TransactionDTO;
import com.akshaya.bank.entity.*;
import com.akshaya.bank.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor
public class TransactionService {
    private final BankAccountRepository accountRepo;
    private final TransactionRepository txRepo;

    @Transactional
    public TransactionDTO.Response deposit(TransactionDTO.DepositRequest req) {
        BankAccount acc = getActiveAccount(req.getAccountNumber());
        BigDecimal before = acc.getBalance();
        BigDecimal after  = before.add(req.getAmount());
        acc.setBalance(after);
        accountRepo.save(acc);

        Transaction tx = Transaction.builder()
                .transactionId(genTxId())
                .type(Transaction.TransactionType.DEPOSIT)
                .amount(req.getAmount())
                .balanceBefore(before)
                .balanceAfter(after)
                .description(req.getDescription() != null ? req.getDescription() : "Deposit")
                .status(Transaction.TransactionStatus.SUCCESS)
                .account(acc)
                .build();
        return TransactionDTO.Response.from(txRepo.save(tx));
    }

    @Transactional
    public TransactionDTO.Response withdraw(TransactionDTO.WithdrawRequest req) {
        BankAccount acc = getActiveAccount(req.getAccountNumber());
        if (acc.getBalance().compareTo(req.getAmount()) < 0)
            throw new RuntimeException("Insufficient balance");
        BigDecimal before = acc.getBalance();
        BigDecimal after  = before.subtract(req.getAmount());
        acc.setBalance(after);
        accountRepo.save(acc);

        Transaction tx = Transaction.builder()
                .transactionId(genTxId())
                .type(Transaction.TransactionType.WITHDRAWAL)
                .amount(req.getAmount())
                .balanceBefore(before)
                .balanceAfter(after)
                .description(req.getDescription() != null ? req.getDescription() : "Withdrawal")
                .status(Transaction.TransactionStatus.SUCCESS)
                .account(acc)
                .build();
        return TransactionDTO.Response.from(txRepo.save(tx));
    }

    @Transactional
    public TransactionDTO.Response transfer(TransactionDTO.TransferRequest req) {
        if (req.getFromAccountNumber().equals(req.getToAccountNumber()))
            throw new RuntimeException("Cannot transfer to the same account");

        BankAccount from = getActiveAccount(req.getFromAccountNumber());
        BankAccount to   = getActiveAccount(req.getToAccountNumber());

        if (from.getBalance().compareTo(req.getAmount()) < 0)
            throw new RuntimeException("Insufficient balance");

        BigDecimal fromBefore = from.getBalance();
        BigDecimal fromAfter  = fromBefore.subtract(req.getAmount());
        BigDecimal toBefore   = to.getBalance();
        BigDecimal toAfter    = toBefore.add(req.getAmount());

        from.setBalance(fromAfter);
        to.setBalance(toAfter);
        accountRepo.save(from);
        accountRepo.save(to);

        String desc = req.getDescription() != null ? req.getDescription() : "Fund Transfer";
        String txId = genTxId();

        Transaction outTx = Transaction.builder()
                .transactionId(txId + "_OUT")
                .type(Transaction.TransactionType.TRANSFER_OUT)
                .amount(req.getAmount())
                .balanceBefore(fromBefore).balanceAfter(fromAfter)
                .description(desc).referenceAccountNumber(req.getToAccountNumber())
                .status(Transaction.TransactionStatus.SUCCESS)
                .account(from).build();

        Transaction inTx = Transaction.builder()
                .transactionId(txId + "_IN")
                .type(Transaction.TransactionType.TRANSFER_IN)
                .amount(req.getAmount())
                .balanceBefore(toBefore).balanceAfter(toAfter)
                .description(desc).referenceAccountNumber(req.getFromAccountNumber())
                .status(Transaction.TransactionStatus.SUCCESS)
                .account(to).build();

        txRepo.save(inTx);
        return TransactionDTO.Response.from(txRepo.save(outTx));
    }

    public List<TransactionDTO.Response> getByAccount(String accNo) {
        BankAccount acc = accountRepo.findByAccountNumber(accNo)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        return txRepo.findByAccountIdOrderByCreatedAtDesc(acc.getId())
                .stream().map(TransactionDTO.Response::from).collect(Collectors.toList());
    }

    public List<TransactionDTO.Response> getMiniStatement(String accNo) {
        BankAccount acc = accountRepo.findByAccountNumber(accNo)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        return txRepo.findTop10ByAccountIdOrderByCreatedAtDesc(acc.getId())
                .stream().map(TransactionDTO.Response::from).collect(Collectors.toList());
    }

    public List<TransactionDTO.Response> getAllByUser(Long userId) {
        return txRepo.findAllByUserId(userId)
                .stream().map(TransactionDTO.Response::from).collect(Collectors.toList());
    }

    public List<TransactionDTO.Response> getAllTransactions() {
        return txRepo.findAll().stream()
                .map(TransactionDTO.Response::from).collect(Collectors.toList());
    }

    private BankAccount getActiveAccount(String accNo) {
        BankAccount acc = accountRepo.findByAccountNumber(accNo)
                .orElseThrow(() -> new RuntimeException("Account not found: " + accNo));
        if (acc.getStatus() != BankAccount.AccountStatus.ACTIVE)
            throw new RuntimeException("Account is not active: " + accNo);
        return acc;
    }

    private String genTxId() {
        return "TXN" + System.currentTimeMillis() + (int)(Math.random()*1000);
    }
}
