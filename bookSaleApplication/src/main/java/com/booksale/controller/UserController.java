package com.booksale.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        // Implementation here
        return ResponseEntity.ok().build();
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile() {
        // Implementation here
        return ResponseEntity.ok().build();
    }
} 