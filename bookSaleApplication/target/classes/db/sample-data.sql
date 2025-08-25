-- ============================================================================
-- BOOK SALE APPLICATION - SAMPLE DATA SCRIPT
-- ============================================================================
-- This script inserts sample data for testing the application
-- File: 02-sample-data.sql

-- ============================================================================
-- INSERT SAMPLE USERS
-- ============================================================================
INSERT INTO users (email, password, name, phone, address) VALUES
('admin@booksale.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin User', '+1234567890', '123 Admin Street, Admin City'),
('john.doe@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John Doe', '+1234567891', '456 Main Street, New York, NY 10001'),
('jane.smith@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Jane Smith', '+1234567892', '789 Oak Avenue, Los Angeles, CA 90210'),
('bob.wilson@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Bob Wilson', '+1234567893', '321 Pine Road, Chicago, IL 60601'),
('alice.brown@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Alice Brown', '+1234567894', '654 Elm Street, Houston, TX 77001');

-- ============================================================================
-- INSERT SAMPLE BOOKS
-- ============================================================================
INSERT INTO books (title, author, price, description, stock_quantity, image_url, isbn) VALUES
-- Fiction
('The Great Gatsby', 'F. Scott Fitzgerald', 12.99, 'A classic American novel about the Jazz Age and the American Dream.', 50, 'https://example.com/images/great-gatsby.jpg', '978-0-7432-7356-5'),
('To Kill a Mockingbird', 'Harper Lee', 14.99, 'A gripping tale of racial injustice and childhood innocence in the American South.', 30, 'https://example.com/images/mockingbird.jpg', '978-0-06-112008-4'),
('1984', 'George Orwell', 13.99, 'A dystopian social science fiction novel about totalitarian control.', 45, 'https://example.com/images/1984.jpg', '978-0-452-28423-4'),
('Pride and Prejudice', 'Jane Austen', 11.99, 'A romantic novel about manners, upbringing, morality, and marriage.', 25, 'https://example.com/images/pride-prejudice.jpg', '978-0-14-143951-8'),

-- Programming & Technology
('Clean Code', 'Robert C. Martin', 45.99, 'A handbook of agile software craftsmanship for writing better code.', 35, 'https://example.com/images/clean-code.jpg', '978-0-13-235088-4'),
('Design Patterns', 'Gang of Four', 54.99, 'Elements of reusable object-oriented software design patterns.', 20, 'https://example.com/images/design-patterns.jpg', '978-0-20163361-0'),
('Spring Boot in Action', 'Craig Walls', 42.99, 'Comprehensive guide to building applications with Spring Boot.', 40, 'https://example.com/images/spring-boot.jpg', '978-1-61729-120-3'),
('Java: The Complete Reference', 'Herbert Schildt', 49.99, 'Complete guide to Java programming language.', 30, 'https://example.com/images/java-complete.jpg', '978-1-26-047417-6'),

-- Science & Nature
('Sapiens', 'Yuval Noah Harari', 16.99, 'A brief history of humankind from the Stone Age to the present.', 60, 'https://example.com/images/sapiens.jpg', '978-0-06-231609-7'),
('The Selfish Gene', 'Richard Dawkins', 15.99, 'Revolutionary approach to understanding evolution and genetics.', 25, 'https://example.com/images/selfish-gene.jpg', '978-0-19-929114-4'),

-- Business & Economics
('Think and Grow Rich', 'Napoleon Hill', 12.99, 'Classic self-help book about achieving success and wealth.', 40, 'https://example.com/images/think-grow-rich.jpg', '978-1-58542-433-7'),
('The Lean Startup', 'Eric Ries', 18.99, 'How constant innovation creates radically successful businesses.', 35, 'https://example.com/images/lean-startup.jpg', '978-0-307-88789-4'),

-- Mystery & Thriller
('The Girl with the Dragon Tattoo', 'Stieg Larsson', 14.99, 'Swedish crime thriller featuring hacker Lisbeth Salander.', 30, 'https://example.com/images/dragon-tattoo.jpg', '978-0-307-45454-1'),
('Gone Girl', 'Gillian Flynn', 13.99, 'Psychological thriller about a marriage gone wrong.', 25, 'https://example.com/images/gone-girl.jpg', '978-0-307-58836-4'),

-- Fantasy
('The Hobbit', 'J.R.R. Tolkien', 12.99, 'A fantasy adventure about Bilbo Baggins and his unexpected journey.', 55, 'https://example.com/images/hobbit.jpg', '978-0-547-92822-7'),
('Harry Potter and the Philosopher''s Stone', 'J.K. Rowling', 11.99, 'The first book in the magical Harry Potter series.', 70, 'https://example.com/images/harry-potter-1.jpg', '978-0-439-70818-8');

-- ============================================================================
-- INSERT POPULAR BOOKS
-- ============================================================================
INSERT INTO popular_books (book_id, rank) VALUES
(1, 1),  -- The Great Gatsby
(9, 2),  -- Sapiens
(15, 3), -- Harry Potter
(5, 4),  -- Clean Code
(3, 5),  -- 1984
(14, 6), -- The Hobbit
(2, 7),  -- To Kill a Mockingbird
(12, 8), -- The Lean Startup
(13, 9), -- The Girl with the Dragon Tattoo
(8, 10); -- Java: The Complete Reference

-- ============================================================================
-- INSERT SAMPLE CART ITEMS
-- ============================================================================
INSERT INTO cart_items (user_id, book_id, quantity) VALUES
(2, 1, 1),  -- John has The Great Gatsby in cart
(2, 5, 1),  -- John has Clean Code in cart
(2, 9, 2),  -- John has 2 copies of Sapiens in cart
(3, 2, 1),  -- Jane has To Kill a Mockingbird in cart
(3, 15, 1), -- Jane has Harry Potter in cart
(4, 7, 1),  -- Bob has Spring Boot in Action in cart
(4, 8, 1),  -- Bob has Java Complete Reference in cart
(5, 14, 1), -- Alice has The Hobbit in cart
(5, 13, 1); -- Alice has Dragon Tattoo in cart

-- ============================================================================
-- INSERT SAMPLE ORDERS
-- ============================================================================
INSERT INTO orders (user_id, total_amount, status, payment_status, shipping_address) VALUES
(2, 58.98, 'DELIVERED', 'PAID', '456 Main Street, New York, NY 10001'),
(3, 26.98, 'SHIPPED', 'PAID', '789 Oak Avenue, Los Angeles, CA 90210'),
(4, 92.98, 'PROCESSING', 'PAID', '321 Pine Road, Chicago, IL 60601'),
(5, 28.98, 'PENDING', 'PENDING', '654 Elm Street, Houston, TX 77001');

-- ============================================================================
-- INSERT SAMPLE ORDER ITEMS
-- ============================================================================
INSERT INTO order_items (order_id, book_id, quantity, price) VALUES
-- Order 1 items (John's delivered order)
(1, 1, 1, 12.99),  -- The Great Gatsby
(1, 5, 1, 45.99),  -- Clean Code

-- Order 2 items (Jane's shipped order)
(2, 2, 1, 14.99),  -- To Kill a Mockingbird
(2, 15, 1, 11.99), -- Harry Potter

-- Order 3 items (Bob's processing order)
(3, 7, 1, 42.99),  -- Spring Boot in Action
(3, 8, 1, 49.99),  -- Java Complete Reference

-- Order 4 items (Alice's pending order)
(4, 14, 1, 12.99), -- The Hobbit
(4, 13, 1, 15.99); -- Dragon Tattoo

-- ============================================================================
-- VERIFY DATA INSERTION
-- ============================================================================
-- Display counts of inserted records
SELECT 'Users' as table_name, COUNT(*) as record_count FROM users
UNION ALL
SELECT 'Books', COUNT(*) FROM books
UNION ALL
SELECT 'Popular Books', COUNT(*) FROM popular_books
UNION ALL
SELECT 'Cart Items', COUNT(*) FROM cart_items
UNION ALL
SELECT 'Orders', COUNT(*) FROM orders
UNION ALL
SELECT 'Order Items', COUNT(*) FROM order_items
ORDER BY table_name;