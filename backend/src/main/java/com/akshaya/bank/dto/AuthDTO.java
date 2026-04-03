package com.akshaya.bank.dto;

import com.akshaya.bank.entity.User;
import jakarta.validation.constraints.*;
import lombok.Data;

public class AuthDTO {
    @Data
    public static class LoginRequest {
        @NotBlank @Email private String email;
        @NotBlank        private String password;
    }

    @Data
    public static class LoginResponse {
        private String token;
        private String email;
        private String fullName;
        private User.Role role;
        private Long userId;

        public LoginResponse(String token, String email, String fullName, User.Role role, Long userId) {
            this.token=token; this.email=email; this.fullName=fullName;
            this.role=role; this.userId=userId;
        }
    }
}
