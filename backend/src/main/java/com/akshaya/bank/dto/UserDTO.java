package com.akshaya.bank.dto;

import com.akshaya.bank.entity.User;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDateTime;

public class UserDTO {

    @Data
    public static class CreateRequest {
        @NotBlank @Email
        private String email;
        @NotBlank @Size(min=6)
        private String password;
        @NotBlank
        private String fullName;
        @NotBlank
        private String phone;
        @NotBlank
        private String address;
    }

    @Data
    public static class UpdateRequest {
        private String fullName;
        private String phone;
        private String address;
        private Boolean isActive;
        private String password;
    }

    @Data
    public static class Response {
        private Long id;
        private String email;
        private String fullName;
        private String phone;
        private String address;
        private User.Role role;
        private Boolean isActive;
        private LocalDateTime createdAt;

        public static Response from(User u) {
            Response r = new Response();
            r.id = u.getId(); r.email = u.getEmail(); r.fullName = u.getFullName();
            r.phone = u.getPhone(); r.address = u.getAddress(); r.role = u.getRole();
            r.isActive = u.getIsActive(); r.createdAt = u.getCreatedAt();
            return r;
        }
    }
}
