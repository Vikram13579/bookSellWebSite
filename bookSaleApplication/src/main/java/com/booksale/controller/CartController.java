package com.booksale.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    @PostMapping("/add")
    public ResponseEntity<?> addToCart() {
        // Implementation here
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/remove/{itemId}")
    public ResponseEntity<?> removeFromCart(@PathVariable Long itemId) {
        // Implementation here
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<?> getCart() {
        // Implementation here
        return ResponseEntity.ok().build();
    }

    @PutMapping("/update/{itemId}")
    public ResponseEntity<?> updateCartItem(@PathVariable Long itemId) {
        // Implementation here
        return ResponseEntity.ok().build();
    }
} 