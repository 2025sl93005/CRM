package com.resolveai.crm.controller;

import com.resolveai.crm.dto.ApiResponse;
import com.resolveai.crm.entity.Role;
import com.resolveai.crm.entity.User;
import com.resolveai.crm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/csr")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<List<User>>> getAllCsrs() {
        List<User> csrs = userRepository.findAllByRole(Role.CSR);
        csrs.forEach(u -> u.setPassword(null)); // do not expose password
        return ResponseEntity.ok(ApiResponse.ok(csrs));
    }
}
