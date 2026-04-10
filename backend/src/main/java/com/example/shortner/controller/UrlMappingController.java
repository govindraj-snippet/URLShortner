package com.example.shortner.controller;

import com.example.shortner.dtos.ClickEventDTO;
import com.example.shortner.dtos.UrlMappingDTO;
import com.example.shortner.models.User;
import com.example.shortner.service.UrlMappingService;
import com.example.shortner.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/urls")
@AllArgsConstructor
public class UrlMappingController {
    private final UrlMappingService urlMappingService;
    private final UserService userService;

    @PostMapping("/shorten")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<UrlMappingDTO> createShortUrl(@RequestBody Map<String, String> request, Principal principal) {
        String originalUrl = request.get("originalUrl");
        User user = userService.findByUsername(principal.getName());
        UrlMappingDTO urlMappingDTO = urlMappingService.createShortUrl(originalUrl, user);
        return ResponseEntity.ok(urlMappingDTO);
    }

    @GetMapping("/myurls")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<UrlMappingDTO>> getUserUrls(Principal principal) {
        User user = userService.findByUsername(principal.getName());
        List<UrlMappingDTO> urls = urlMappingService.getUrlsByUser(user);
        return ResponseEntity.ok(urls);
    }

    @GetMapping("/analytics/{shortUrl}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<ClickEventDTO>> getUrlAnalytics(@PathVariable String shortUrl,
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate) {
        DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
        LocalDateTime start = ZonedDateTime.parse(startDate, formatter).withZoneSameInstant(ZoneId.systemDefault())
                .toLocalDateTime();
        LocalDateTime end = ZonedDateTime.parse(endDate, formatter).withZoneSameInstant(ZoneId.systemDefault())
                .toLocalDateTime();
        List<ClickEventDTO> clickEventDTOS = urlMappingService.getClickEventsByDate(shortUrl, start, end);
        return ResponseEntity.ok(clickEventDTOS);
    }

    @GetMapping("/totalclicks")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<String, Long>> getTotalClicksByDate(Principal principal,
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate) {
        DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE;
        User user = userService.findByUsername(principal.getName());
        LocalDate start = LocalDate.parse(startDate, formatter);
        LocalDate end = LocalDate.parse(endDate, formatter);
        Map<LocalDate, Long> totalClicks = urlMappingService.getTotalClicksByUserAndDate(user, start, end);

        Map<String, Long> response = totalClicks.entrySet().stream()
                .collect(Collectors.toMap(
                        entry -> entry.getKey().toString(),
                        Map.Entry::getValue));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/analytics/creation")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<String, Long>> getUrlCreationAnalytics(Principal principal,
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate) {
        DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE;
        User user = userService.findByUsername(principal.getName());
        LocalDate start = LocalDate.parse(startDate, formatter);
        LocalDate end = LocalDate.parse(endDate, formatter);
        Map<LocalDate, Long> stats = urlMappingService.getUrlCreationStats(user, start, end);

        Map<String, Long> response = stats.entrySet().stream()
                .collect(Collectors.toMap(
                        entry -> entry.getKey().toString(),
                        Map.Entry::getValue));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/analytics/summary")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<String, Long>> getAnalyticsSummary(Principal principal) {
        User user = userService.findByUsername(principal.getName());
        List<UrlMappingDTO> urls = urlMappingService.getUrlsByUser(user);
        long totalUrls = urls.size();
        long totalClicks = urls.stream().mapToLong(UrlMappingDTO::getClickCount).sum();
        long todayClicks = urlMappingService.getTodayClicks(user);

        return ResponseEntity.ok(Map.of(
                "totalUrls", totalUrls,
                "totalClicks", totalClicks,
                "todayClicks", todayClicks,
                "activeUrls", totalUrls));
    }

    @GetMapping("/analytics/recent")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<String, List<?>>> getRecentActivity(Principal principal) {
        User user = userService.findByUsername(principal.getName());
        List<UrlMappingDTO> urls = urlMappingService.getUrlsByUser(user);
        List<UrlMappingDTO> recentUrls = urls.stream()
                .sorted((a, b) -> b.getCreatedDate().compareTo(a.getCreatedDate()))
                .limit(10)
                .collect(Collectors.toList());

        List<ClickEventDTO> recentClicks = urlMappingService.getRecentClickEvents(user).stream()
                .limit(10)
                .map(event -> {
                    ClickEventDTO dto = new ClickEventDTO();
                    dto.setClickDate(event.getClickDate().toString());
                    dto.setCount(1L);
                    if (event.getUrlMapping() != null) {
                        dto.setShortUrl(event.getUrlMapping().getShortUrl());
                        dto.setOriginalUrl(event.getUrlMapping().getOriginalUrl());
                    }
                    return dto;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(Map.of(
                "urls", recentUrls,
                "clicks", recentClicks));
    }
}
