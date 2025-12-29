package com.example.shortner.security;

import com.example.shortner.service.UserDetailsImpl;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Date;
import java.util.stream.Collectors;

public class JwtUtils {
    // Authorization -> Bearer <TOKEN>
    @Value("${jwt.secret}")
    private String jwtSecret ;
    @Value("${jwt.expirationMs}")
    private int jwtExpirationMs ;

    public String getJwtFromHeader(HttpServletRequest request ){
        String bearerToken = request.getHeader("Authorization") ;
        if(bearerToken != null && bearerToken.startsWith("Bearer ") ){
            return bearerToken.substring(7) ;
        }
        return null ;
    }
    public String generateToken( UserDetailsImpl userDetails ){
        String username = userDetails.getUsername() ;
        String roles = userDetails.getAuthorities().stream()
                .map( auth -> auth.getAuthority())
                .collect(Collectors.joining(",")) ;

        return Jwts.builder().
                setSubject(username)
                .claim("roles", roles)
                .issuedAt( new Date())
                .expiration( new Date( System.currentTimeMillis() + 172800000))
                .signWith(key())
                .compact() ;

    }

    private String getUserNameFromJwtToken( String token ){
        return Jwts.parser()
                .verifyWith((SecretKey) key())
                .build().parseSignedClaims(token)
                .getPayload().getSubject() ;
    }

    private Key key (){
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret)) ;

    }

    public boolean validateToken( String authToken ){

        try{
            Jwts.parser().verifyWith((SecretKey) key()).build().parseClaimsJws(authToken) ;
            return true ;
        }
        catch( JwtException e ){
            throw new RuntimeException(e) ;
        }
        catch( IllegalArgumentException e ){
            throw new RuntimeException(e) ;
        }
        catch( Exception e ){
            throw new RuntimeException(e) ;
        }

    }


}
