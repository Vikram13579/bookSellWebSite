package com.booksale.service;

import com.booksale.entity.Book;
import com.booksale.entity.CartItem;
import com.booksale.entity.User;
import com.booksale.repository.BookRepository;
import com.booksale.repository.CartItemRepository;
import com.booksale.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class CartService {
    @Autowired
    private CartItemRepository cartItemRepository;
    @Autowired
    private BookRepository bookRepository;
    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByEmail(auth.getName()).orElseThrow();
    }

    @Transactional
    public CartItem addToCart(Long bookId, int quantity) {
        User user = getCurrentUser();
        Book book = bookRepository.findById(bookId).orElseThrow();
        CartItem item = cartItemRepository.findAll().stream()
            .filter(ci -> ci.getUser().getId().equals(user.getId()) && ci.getBook().getId().equals(bookId))
            .findFirst().orElse(null);
        if (item == null) {
            item = CartItem.builder().user(user).book(book).quantity(quantity).build();
        } else {
            item.setQuantity(item.getQuantity() + quantity);
        }
        return cartItemRepository.save(item);
    }

    @Transactional
    public void removeFromCart(Long itemId) {
        cartItemRepository.deleteById(itemId);
    }

    public List<CartItem> getCart() {
        User user = getCurrentUser();
        return cartItemRepository.findAll().stream().filter(ci -> ci.getUser().getId().equals(user.getId())).toList();
    }

    @Transactional
    public CartItem updateCartItem(Long itemId, int quantity) {
        CartItem item = cartItemRepository.findById(itemId).orElseThrow();
        item.setQuantity(quantity);
        return cartItemRepository.save(item);
    }
} 