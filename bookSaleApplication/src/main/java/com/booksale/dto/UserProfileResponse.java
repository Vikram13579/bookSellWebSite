package com.booksale.dto;

import lombok.Data;

@Data
public class UserProfileResponse {
    private Long id;
    private String email;
    private String name;
    private String phone;
    private String address;
} 