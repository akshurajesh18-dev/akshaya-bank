package com.akshaya.bank.controller;

import com.akshaya.bank.dto.*;
import com.akshaya.bank.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserService userService;
    private final AccountService accountService;
    private final TransactionService txService;

    // ── Users ────────────────────────────────────────────────────────────────
    @PostMapping("/users")
    public ResponseEntity<UserDTO.Response> createCustomer(@Valid @RequestBody UserDTO.CreateRequest req) {
        return ResponseEntity.ok(userService.createCustomer(req));
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDTO.Response>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<UserDTO.Response> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<UserDTO.Response> updateUser(@PathVariable Long id,
                                                       @RequestBody UserDTO.UpdateRequest req) {
        return ResponseEntity.ok(userService.updateUser(id, req));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deactivateUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("User deactivated");
    }

    // ── Accounts ─────────────────────────────────────────────────────────────
    @PostMapping("/accounts")
    public ResponseEntity<AccountDTO.Response> createAccount(@Valid @RequestBody AccountDTO.CreateRequest req) {
        return ResponseEntity.ok(accountService.createAccount(req));
    }

    @GetMapping("/accounts")
    public ResponseEntity<List<AccountDTO.Response>> getAllAccounts() {
        return ResponseEntity.ok(accountService.getAllAccounts());
    }

    @GetMapping("/accounts/user/{userId}")
    public ResponseEntity<List<AccountDTO.Response>> getAccountsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(accountService.getAccountsByUser(userId));
    }

    @GetMapping("/accounts/{accNo}")
    public ResponseEntity<AccountDTO.Response> getAccount(@PathVariable String accNo) {
        return ResponseEntity.ok(accountService.getByAccountNumber(accNo));
    }

    @PutMapping("/accounts/{id}")
    public ResponseEntity<AccountDTO.Response> updateAccount(@PathVariable Long id,
                                                              @RequestBody AccountDTO.UpdateRequest req) {
        return ResponseEntity.ok(accountService.updateAccount(id, req));
    }

    // ── Transactions ──────────────────────────────────────────────────────────
    @GetMapping("/transactions")
    public ResponseEntity<List<TransactionDTO.Response>> getAllTransactions() {
        return ResponseEntity.ok(txService.getAllTransactions());
    }

    @GetMapping("/transactions/user/{userId}")
    public ResponseEntity<List<TransactionDTO.Response>> getTxByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(txService.getAllByUser(userId));
    }

    @GetMapping("/transactions/account/{accNo}")
    public ResponseEntity<List<TransactionDTO.Response>> getTxByAccount(@PathVariable String accNo) {
        return ResponseEntity.ok(txService.getByAccount(accNo));
    }

    // ── Admin deposit (admin can credit any account) ─────────────────────────
    @PostMapping("/transactions/deposit")
    public ResponseEntity<TransactionDTO.Response> adminDeposit(
            @Valid @RequestBody TransactionDTO.DepositRequest req) {
        return ResponseEntity.ok(txService.deposit(req));
    }
}
