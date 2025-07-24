package com.booksale.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    @PostMapping("/buy")
    public ResponseEntity<?> buyOrder() {
        // Implementation here
        return ResponseEntity.ok().build();
    }
} 