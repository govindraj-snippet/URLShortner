package com.url.shortner.models;

import jakarta.persistence.*;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;
import java.util.List;

public class UrlMapping {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id ;
    private String originalUrl ;
    private String shortUrl ;
    private int clickCount = 0  ;
    private LocalDateTime createdTime ;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user ;
    @OneToMany(mappedBy = "urlMapping")
    private List<ClickEvent> clickEvents ;
}
