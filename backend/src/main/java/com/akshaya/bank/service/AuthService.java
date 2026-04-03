package com.akshaya.bank.service;

import com.akshaya.bank.dto.AuthDTO;
import com.akshaya.bank.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service @RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManager authManager;
    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;
    private final com.akshaya.bank.repository.UserRepository userRepo;

    public AuthDTO.LoginResponse login(AuthDTO.LoginRequest req) {
        authManager.authenticate(
            new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));
        var ud = userDetailsService.loadUserByUsername(req.getEmail());
        var user = userRepo.findByEmail(req.getEmail()).orElseThrow();
        if (!user.getIsActive()) throw new RuntimeException("Account is deactivated");
        String token = jwtUtil.generateToken(ud);
        return new AuthDTO.LoginResponse(token, user.getEmail(),
                user.getFullName(), user.getRole(), user.getId());
    }
}
