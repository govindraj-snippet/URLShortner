package com.example.shortner.security;

import com.example.shortner.service.UserDetailsServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@AllArgsConstructor
public class WebSecurityConfig {

    private UserDetailsServiceImpl userDetailsService ;

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter(){
        return new JwtAuthenticationFilter();
    }
    public SecurityFilterChain filterChain(HttpSecurity http ) throws Exception {
        http.csrf(AbstractHttpConfigurer ::disable )
                .authorizeHttpRequests(auth -> auth.requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/{shortUrl}").permitAll()
                        .requestMatchers("/api/urls/**").authenticated()
                        .requestMatchers("/{shortUrl}").permitAll()
                        .anyRequest().authenticated()

                );
        http.addFilterBefore(jwtAuthenticationFilter() , UsernamePasswordAuthenticationFilter.class) ; 
        return http.build();
    }

}
