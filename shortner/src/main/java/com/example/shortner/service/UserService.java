package com.example.shortner.service;

import com.example.shortner.models.User;
import com.example.shortner.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;

public class UserService {

    private PasswordEncoder passwordEncoder ;
    private UserRepository userRepository ;

    public User registerUser(User user ){
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user) ;
    }
}
