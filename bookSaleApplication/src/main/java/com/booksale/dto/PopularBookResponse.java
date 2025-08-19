package com.booksale.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PopularBookResponse {
    private Long id;
    private Integer rank;
    private LocalDateTime addedAt;
    private BookResponse book;
} 