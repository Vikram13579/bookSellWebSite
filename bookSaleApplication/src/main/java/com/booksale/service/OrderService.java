package com.booksale.service;

import com.booksale.entity.*;
import com.booksale.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private OrderItemRepository orderItemRepository;
    @Autowired
    private CartItemRepository cartItemRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BookRepository bookRepository;

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByEmail(auth.getName()).orElseThrow();
    }

    @Transactional
    public Order checkout() {
        User user = getCurrentUser();
        List<CartItem> cartItems = cartItemRepository.findAll().stream()
            .filter(ci -> ci.getUser().getId().equals(user.getId()))
            .toList();
        
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // Calculate total
        BigDecimal total = cartItems.stream()
            .map(item -> item.getBook().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Create order
        Order order = Order.builder()
            .user(user)
            .totalAmount(total)
            .status("PENDING")
            .paymentStatus("PENDING")
            .shippingAddress(user.getAddress())
            .build();
        
        order = orderRepository.save(order);

        // Create order items
        for (CartItem cartItem : cartItems) {
            OrderItem orderItem = OrderItem.builder()
                .order(order)
                .book(cartItem.getBook())
                .quantity(cartItem.getQuantity())
                .priceAtPurchase(cartItem.getBook().getPrice())
                .build();
            orderItemRepository.save(orderItem);
        }

        // Clear cart
        cartItemRepository.deleteAll(cartItems);

        return order;
    }

    public List<Order> getUserOrders() {
        User user = getCurrentUser();
        return orderRepository.findAll().stream()
            .filter(order -> order.getUser().getId().equals(user.getId()))
            .toList();
    }
} 