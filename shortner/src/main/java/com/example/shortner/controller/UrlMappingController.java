package com.example.shortner.controller;

import com.example.shortner.dtos.UrlMappingDTO;
import com.example.shortner.models.User;
import com.example.shortner.service.UrlMappingService;
import com.example.shortner.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/urls")
@AllArgsConstructor
public class UrlMappingController {
    private final UrlMappingService urlMappingService ;
    private final UserService userService ;

    @PostMapping("/shorten")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<UrlMappingDTO>createShortUrl(@RequestBody Map<String , String > request, Principal principal){
        String originalUrl = request.get("originalUrl") ;
       User user =  userService.findByUsername(principal.getName()) ;
       UrlMappingDTO urlMappingDTO = urlMappingService.createShortUrl(originalUrl , user) ;
       return ResponseEntity.ok(urlMappingDTO) ;
    }

    @GetMapping("/myurls")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<UrlMappingDTO>>getUserUrls(Principal principal ){
        User user = userService.findByUsername(principal.getName()) ;
        List<UrlMappingDTO>urls = urlMappingService.getUrlsByUser(user) ;
        return ResponseEntity.ok(urls);
    }


}
