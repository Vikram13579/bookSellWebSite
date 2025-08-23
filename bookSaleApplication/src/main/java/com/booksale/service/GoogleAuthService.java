package com.booksale.service;

import com.booksale.dto.GoogleAuthRequest;
import com.booksale.entity.User;
import com.booksale.repository.UserRepository;
import com.booksale.security.JwtUtil;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class GoogleAuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Value("${google.client.id}")
    private String googleClientId;
    
    public String authenticateWithGoogle(GoogleAuthRequest request) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();
            
            GoogleIdToken idToken = verifier.verify(request.getCredential());
            if (idToken != null) {
                Payload payload = idToken.getPayload();
                
                // Get profile information from payload
                String email = payload.getEmail();
                String name = (String) payload.get("name");
                String picture = (String) payload.get("picture");
                
                // Check if user exists, if not create new user
                java.util.Optional<User> userOpt = userRepository.findByEmail(email);
                User user;
                if (userOpt.isEmpty()) {
                    user = new User();
                    user.setEmail(email);
                    user.setName(name);
                    user.setPassword("GOOGLE_AUTH"); // Set a placeholder password for Google users
                    user.setPhone(""); // Set default values
                    user.setAddress("");
                    userRepository.save(user);
                } else {
                    user = userOpt.get();
                }
                
                // Generate JWT token
                return jwtUtil.generateToken(user.getEmail());
            } else {
                throw new RuntimeException("Invalid ID token");
            }
        } catch (Exception e) {
            throw new RuntimeException("Google authentication failed: " + e.getMessage());
        }
    }
} 