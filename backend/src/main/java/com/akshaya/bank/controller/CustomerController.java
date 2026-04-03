package com.akshaya.bank.controller;

import com.akshaya.bank.dto.*;
import com.akshaya.bank.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/customer")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CUSTOMER')")
public class CustomerController {

    private final UserService userService;
    private final AccountService accountService;
    private final TransactionService txService;

    // ── Profile ───────────────────────────────────────────────────────────────
    @GetMapping("/profile")
    public ResponseEntity<UserDTO.Response> getProfile(@AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(userService.getUserByEmail(ud.getUsername()));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserDTO.Response> updateProfile(
            @AuthenticationPrincipal UserDetails ud,
            @RequestBody UserDTO.UpdateRequest req) {
        var user = userService.getUserByEmail(ud.getUsername());
        // Customers cannot change isActive themselves
        req.setIsActive(null);
        return ResponseEntity.ok(userService.updateUser(user.getId(), req));
    }

    // ── Accounts ──────────────────────────────────────────────────────────────
    @GetMapping("/accounts")
    public ResponseEntity<List<AccountDTO.Response>> getMyAccounts(@AuthenticationPrincipal UserDetails ud) {
        var user = userService.getUserByEmail(ud.getUsername());
        return ResponseEntity.ok(accountService.getAccountsByUser(user.getId()));
    }

    @GetMapping("/accounts/{accNo}")
    public ResponseEntity<AccountDTO.Response> getAccount(
            @PathVariable String accNo,
            @AuthenticationPrincipal UserDetails ud) {
        var acc = accountService.getByAccountNumber(accNo);
        var user = userService.getUserByEmail(ud.getUsername());
        if (!acc.getUserId().equals(user.getId()))
            return ResponseEntity.status(403).build();
        return ResponseEntity.ok(acc);
    }

    // ── Transactions ──────────────────────────────────────────────────────────
    @PostMapping("/deposit")
    public ResponseEntity<TransactionDTO.Response> deposit(
            @Valid @RequestBody TransactionDTO.DepositRequest req,
            @AuthenticationPrincipal UserDetails ud) {
        verifyAccountOwnership(req.getAccountNumber(), ud.getUsername());
        return ResponseEntity.ok(txService.deposit(req));
    }

    @PostMapping("/withdraw")
    public ResponseEntity<TransactionDTO.Response> withdraw(
            @Valid @RequestBody TransactionDTO.WithdrawRequest req,
            @AuthenticationPrincipal UserDetails ud) {
        verifyAccountOwnership(req.getAccountNumber(), ud.getUsername());
        return ResponseEntity.ok(txService.withdraw(req));
    }

    @PostMapping("/transfer")
    public ResponseEntity<TransactionDTO.Response> transfer(
            @Valid @RequestBody TransactionDTO.TransferRequest req,
            @AuthenticationPrincipal UserDetails ud) {
        verifyAccountOwnership(req.getFromAccountNumber(), ud.getUsername());
        return ResponseEntity.ok(txService.transfer(req));
    }

    @GetMapping("/transactions")
    public ResponseEntity<List<TransactionDTO.Response>> getAllMyTransactions(
            @AuthenticationPrincipal UserDetails ud) {
        var user = userService.getUserByEmail(ud.getUsername());
        return ResponseEntity.ok(txService.getAllByUser(user.getId()));
    }

    @GetMapping("/transactions/{accNo}")
    public ResponseEntity<List<TransactionDTO.Response>> getTransactions(
            @PathVariable String accNo,
            @AuthenticationPrincipal UserDetails ud) {
        verifyAccountOwnership(accNo, ud.getUsername());
        return ResponseEntity.ok(txService.getByAccount(accNo));
    }

    @GetMapping("/mini-statement/{accNo}")
    public ResponseEntity<List<TransactionDTO.Response>> getMiniStatement(
            @PathVariable String accNo,
            @AuthenticationPrincipal UserDetails ud) {
        verifyAccountOwnership(accNo, ud.getUsername());
        return ResponseEntity.ok(txService.getMiniStatement(accNo));
    }

    // ── Helper ────────────────────────────────────────────────────────────────
    private void verifyAccountOwnership(String accNo, String email) {
        var acc  = accountService.getByAccountNumber(accNo);
        var user = userService.getUserByEmail(email);
        if (!acc.getUserId().equals(user.getId()))
            throw new RuntimeException("You do not own this account");
    }
}
