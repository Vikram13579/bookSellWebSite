package com.booksale.controller;

import com.booksale.entity.PopularBook;
import com.booksale.service.PopularBookService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/popular-books")
@RequiredArgsConstructor
public class PopularBookController {
    private final PopularBookService popularBookService;

    @GetMapping
    public List<PopularBook> getPopularBooks() {
        return popularBookService.getPopularBooks();
    }
} 