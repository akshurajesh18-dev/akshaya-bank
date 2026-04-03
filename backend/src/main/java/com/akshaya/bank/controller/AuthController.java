package com.akshaya.bank.controller;
import com.akshaya.bank.dto.AuthDTO;
import com.akshaya.bank.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    @PostMapping("/login")
    public ResponseEntity<AuthDTO.LoginResponse> login(@Valid @RequestBody AuthDTO.LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }
    @GetMapping("/ping")
    public ResponseEntity<String> ping() {
        return ResponseEntity.ok("Akshaya Bank API is running!");
    }
}
