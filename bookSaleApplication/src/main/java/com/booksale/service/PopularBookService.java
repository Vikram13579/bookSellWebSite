package com.booksale.service;

import com.booksale.entity.PopularBook;
import com.booksale.repository.PopularBookRepository;
import com.booksale.dto.PopularBookResponse;
import com.booksale.dto.BookResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PopularBookService {
    private final PopularBookRepository popularBookRepository;

    public List<PopularBookResponse> getPopularBooks() {
        return popularBookRepository.findAll()
            .stream()
            .sorted((a, b) -> {
                if (a.getRank() == null && b.getRank() == null) return 0;
                if (a.getRank() == null) return 1;
                if (b.getRank() == null) return -1;
                return a.getRank() - b.getRank();
            })
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    private PopularBookResponse toDto(PopularBook popularBook) {
        PopularBookResponse dto = new PopularBookResponse();
        dto.setId(popularBook.getId());
        dto.setRank(popularBook.getRank());
        dto.setAddedAt(popularBook.getAddedAt());
        dto.setBook(toBookDto(popularBook.getBook()));
        return dto;
    }

    private BookResponse toBookDto(com.booksale.entity.Book book) {
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