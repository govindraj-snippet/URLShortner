package com.example.shortner.service;

import com.example.shortner.models.User;
import com.example.shortner.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserService {

    private final PasswordEncoder passwordEncoder ;
    private final UserRepository userRepository ;

    public User registerUser(User user ){
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user) ;
    }
}
