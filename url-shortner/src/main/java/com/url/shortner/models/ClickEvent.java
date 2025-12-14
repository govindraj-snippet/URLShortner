package com.url.shortner.models;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

import java.time.LocalDateTime;
@Entity
@Data
public class ClickEvent {
    private Long id ;
    private LocalDateTime clickDate ;
   // private LocalDateTime clickDate ;

    @ManyToOne
    @JoinColumn(name = "url_mapping_id")
    private UrlMapping urlMapping ;





}
