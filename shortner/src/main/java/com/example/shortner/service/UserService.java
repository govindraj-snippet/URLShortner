package com.example.shortner.service;

import com.example.shortner.dtos.LoginRequest;
import com.example.shortner.models.User;
import com.example.shortner.repository.UserRepository;
import com.example.shortner.security.JwtAuthenticationResponse;
import com.example.shortner.security.JwtUtils;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

@Service
@AllArgsConstructor
public class UserService {

    private final PasswordEncoder passwordEncoder ;
    private final UserRepository userRepository ;
    private AuthenticationManager authenticationManager ;
    private JwtUtils jwtUtils ;

    public User registerUser(User user ){
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user) ;
    }
    public JwtAuthenticationResponse authenticate ( @RequestBody LoginRequest loginRequest){
      //  return null  ;
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername() , loginRequest.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal() ;
        String jwt = jwtUtils.generateToken(userDetails ) ;
        return new JwtAuthenticationResponse(jwt) ;

    }
}
