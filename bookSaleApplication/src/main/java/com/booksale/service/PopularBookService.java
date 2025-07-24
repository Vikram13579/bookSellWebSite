package com.booksale.service;

import com.booksale.entity.PopularBook;
import com.booksale.repository.PopularBookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PopularBookService {
    private final PopularBookRepository popularBookRepository;

    public List<PopularBook> getPopularBooks() {
        return popularBookRepository.findAll()
            .stream()
            .sorted((a, b) -> {
                if (a.getRank() == null && b.getRank() == null) return 0;
                if (a.getRank() == null) return 1;
                if (b.getRank() == null) return -1;
                return a.getRank() - b.getRank();
            })
            .toList();
    }
} 