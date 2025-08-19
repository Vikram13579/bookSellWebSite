package com.booksale.service;

import com.booksale.entity.Book;
import com.booksale.entity.CartItem;
import com.booksale.entity.User;
import com.booksale.repository.BookRepository;
import com.booksale.repository.CartItemRepository;
import com.booksale.repository.UserRepository;
import com.booksale.dto.CartItemResponse;
import com.booksale.dto.BookResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

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
    public CartItemResponse addToCart(Long bookId, int quantity) {
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
        CartItem savedItem = cartItemRepository.save(item);
        return toCartItemResponse(savedItem);
    }

    @Transactional
    public void removeFromCart(Long itemId) {
        cartItemRepository.deleteById(itemId);
    }

    public List<CartItemResponse> getCart() {
        User user = getCurrentUser();
        return cartItemRepository.findAll().stream()
            .filter(ci -> ci.getUser().getId().equals(user.getId()))
            .map(this::toCartItemResponse)
            .collect(Collectors.toList());
    }

    @Transactional
    public CartItemResponse updateCartItem(Long itemId, int quantity) {
        CartItem item = cartItemRepository.findById(itemId).orElseThrow();
        item.setQuantity(quantity);
        CartItem savedItem = cartItemRepository.save(item);
        return toCartItemResponse(savedItem);
    }

    private CartItemResponse toCartItemResponse(CartItem cartItem) {
        CartItemResponse dto = new CartItemResponse();
        dto.setId(cartItem.getId());
        dto.setQuantity(cartItem.getQuantity());
        dto.setBook(toBookResponse(cartItem.getBook()));
        return dto;
    }

    private BookResponse toBookResponse(Book book) {
        if (book == null) return null;
        BookResponse dto = new BookResponse();
        dto.setId(book.getId());
        dto.setTitle(book.getTitle());
        dto.setAuthor(book.getAuthor());
        dto.setPrice(book.getPrice());
        dto.setDescription(book.getDescription());
        dto.setStockQuantity(book.getStockQuantity());
        dto.setImageUrl(book.getImageUrl());
        dto.setIsbn(book.getIsbn());
        return dto;
    }
} 