package com.booksale.service;

import com.booksale.entity.Book;
import com.booksale.repository.BookRepository;
import com.booksale.dto.BookResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookService {
    @Autowired
    private BookRepository bookRepository;

    public List<BookResponse> getAllBooks() {
        return bookRepository.findAll().stream().map(this::toBookResponse).collect(Collectors.toList());
    }

    public BookResponse getBookById(Long id) {
        Book book = bookRepository.findById(id).orElseThrow(() -> new RuntimeException("Book not found"));
        return toBookResponse(book);
    }

    private BookResponse toBookResponse(Book book) {
        BookResponse dto = new BookResponse();
        dto.setId(book.getId());
        dto.setTitle(book.getTitle());
        dto.setAuthor(book.getAuthor());
        dto.setPrice(book.getPrice());
        dto.setDescription(book.getDescription());
        dto.setStockQuantity(book.getStockQuantity());
        dto.setIsbn(book.getIsbn());
        // Assume imageUrl in Book is just the filename, e.g., "book1.jpg"
        if (book.getImageUrl() != null && !book.getImageUrl().isEmpty()) {
            dto.setImageUrl("/images/" + book.getImageUrl());
        } else {
            dto.setImageUrl(null);
        }
        return dto;
    }
} 