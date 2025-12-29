package com.example.shortner.service;

import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.Objects;
import com.example.shortner.models.User;

public class UserDetailsImpl implements UserDetails {
    private static final long  serialVersionUID = 1L ;
    private Long id ;
    private String username ;
    private String password ;

    private Collection< ? extends GrantedAuthority> authorities ;
    public UserDetailsImpl( Long id , String username , String password ,
                            Collection< ? extends GrantedAuthority> authorities ) {
        this.id = id ;
        this.username = username ;
        this.password = password ;
        this.authorities = authorities ;
    }

    public static UserDetailsImpl build( User user ){

        List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(user.getRole()));
        return new UserDetailsImpl(user.getId(), user.getUsername(), user.getPassword(), authorities);
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
        return username ;
    }


}
