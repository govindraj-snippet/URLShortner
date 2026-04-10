package com.example.shortner.dtos;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ClickEventDTO {
    private String clickDate;
    private Long count;
    private String shortUrl;
    private String originalUrl;

}
