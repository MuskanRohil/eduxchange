package com.eduxchange.eduxchange.repository;

import com.eduxchange.eduxchange.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    @org.springframework.data.jpa.repository.Query("SELECT r FROM Rating r WHERE r.reviewed.id = :reviewedId")
    List<Rating> findByReviewedId(@org.springframework.data.repository.query.Param("reviewedId") Long reviewedId);
}
