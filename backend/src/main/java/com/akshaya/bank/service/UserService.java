package com.akshaya.bank.service;

import com.akshaya.bank.dto.UserDTO;
import com.akshaya.bank.entity.User;
import com.akshaya.bank.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepo;
    private final PasswordEncoder encoder;

    public UserDTO.Response createCustomer(UserDTO.CreateRequest req) {
        if (userRepo.existsByEmail(req.getEmail()))
            throw new RuntimeException("Email already registered: " + req.getEmail());
        User user = User.builder()
                .email(req.getEmail())
                .password(encoder.encode(req.getPassword()))
                .fullName(req.getFullName())
                .phone(req.getPhone())
                .address(req.getAddress())
                .role(User.Role.CUSTOMER)
                .isActive(true)
                .build();
        return UserDTO.Response.from(userRepo.save(user));
    }

    public List<UserDTO.Response> getAllCustomers() {
        return userRepo.findByRole(User.Role.CUSTOMER)
                .stream().map(UserDTO.Response::from).collect(Collectors.toList());
    }

    public UserDTO.Response getUserById(Long id) {
        return UserDTO.Response.from(userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found")));
    }

    public UserDTO.Response getUserByEmail(String email) {
        return UserDTO.Response.from(userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found")));
    }

    public UserDTO.Response updateUser(Long id, UserDTO.UpdateRequest req) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (req.getFullName() != null) user.setFullName(req.getFullName());
        if (req.getPhone()    != null) user.setPhone(req.getPhone());
        if (req.getAddress()  != null) user.setAddress(req.getAddress());
        if (req.getIsActive() != null) user.setIsActive(req.getIsActive());
        if (req.getPassword() != null && !req.getPassword().isBlank())
            user.setPassword(encoder.encode(req.getPassword()));
        return UserDTO.Response.from(userRepo.save(user));
    }

    public void deleteUser(Long id) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsActive(false);
        userRepo.save(user);
    }

    public List<UserDTO.Response> getAllUsers() {
        return userRepo.findAll().stream()
                .map(UserDTO.Response::from).collect(Collectors.toList());
    }
}
