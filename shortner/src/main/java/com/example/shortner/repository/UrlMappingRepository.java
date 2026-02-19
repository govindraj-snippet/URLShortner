package com.example.shortner.repository;

import com.example.shortner.models.UrlMapping;
import com.example.shortner.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UrlMappingRepository extends JpaRepository<UrlMapping, Long> {
    UrlMapping findByShortUrl(String shortUrl);

    List<UrlMapping> findByUser(User user);

    @Query("SELECT DATE(u.createdDate) as date, COUNT(u) as count FROM UrlMapping u WHERE u.user = :user AND u.createdDate >= :start AND u.createdDate < :end GROUP BY DATE(u.createdDate)")
    List<Object[]> findUrlCreationStatsByUserAndDate(@Param("user") User user, @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);
}
