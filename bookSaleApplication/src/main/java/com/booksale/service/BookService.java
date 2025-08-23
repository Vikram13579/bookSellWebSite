package com.booksale.service;

import com.booksale.entity.Book;
import com.booksale.repository.BookRepository;
import com.booksale.dto.BookResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
@Slf4j
@Service
public class BookService {
    @Autowired
    private BookRepository bookRepository;

    public List<BookResponse> getAllBooks() {
        log.debug("Getting all books from repository");
        List<Book> books = bookRepository.findAll();
        log.debug("Found {} books", books.size());
        return books.stream().map(this::toBookResponse).collect(Collectors.toList());
    }

    public List<BookResponse> searchBooks(String query) {
        log.debug("Searching books with query: {}", query);
        List<Book> books = bookRepository.findByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query, query, query);
        log.debug("Found {} books for query '{}'", books.size(), query);
        return books.stream().map(this::toBookResponse).collect(Collectors.toList());
    }

    public BookResponse getBookById(Long id) {
        log.debug("Fetching book by id: {}", id);
        Book book = bookRepository.findById(id)
            .orElseThrow(() -> {
                log.error("Book not found with id: {}", id);
                return new RuntimeException("Book not found");
            });
        log.debug("Fetched book: {}", book.getTitle());
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