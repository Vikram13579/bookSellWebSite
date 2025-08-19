package com.booksale.controller;

import com.booksale.entity.PopularBook;
import com.booksale.service.PopularBookService;
import com.booksale.dto.PopularBookResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/popular-books")
@RequiredArgsConstructor
public class PopularBookController {
    private final PopularBookService popularBookService;

    @GetMapping
    public List<PopularBookResponse> getPopularBooks() {
        return popularBookService.getPopularBooks();
    }
}   