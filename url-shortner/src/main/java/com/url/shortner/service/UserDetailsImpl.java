package com.url.shortner.service;

import com.url.shortner.models.User;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.List;

@Data
@NoArgsConstructor
public class UserDetailsImpl implements UserDetails {
    private static final long serialVersionUID = 1L ;

    private long id ;
    private String username ;
    private String email ;
    private String password ;

    private Collection< ? extends GrantedAuthority>authorities ;

    public UserDetailsImpl(long id, Collection<? extends GrantedAuthority> authorities, String password, String email, String username) {
        this.id = id;
        this.authorities = authorities;
        this.password = password;
        this.email = email;
        this.username = username;
    }

    public static UserDetailsImpl build( User user ){
        GrantedAuthority authority = new SimpleGrantedAuthority(user.getRole()) ;
        return new UserDetailsImpl(
                user.getId(),
                Collections.singleton(authority),
                user.getPassword(),
                user.getEmail(),
                user.getUsername()
        ) ;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public @Nullable String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }
}
