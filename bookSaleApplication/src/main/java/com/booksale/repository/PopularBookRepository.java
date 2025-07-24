package com.booksale.repository;

import com.booksale.entity.PopularBook;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PopularBookRepository extends JpaRepository<PopularBook, Long> {
} 