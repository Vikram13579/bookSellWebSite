package com.booksale.dto;

import lombok.Data;

@Data
public class CartItemResponse {
    private Long id;
    private Integer quantity;
    private BookResponse book;
} 