package com.eduxchange.eduxchange.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "ratings")
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "reviewer_id", nullable = false)
    private User reviewer;

    @ManyToOne
    @JoinColumn(name = "reviewed_id", nullable = false)
    private User reviewed;

    private Integer score; // e.g., 1 to 5
    
    private String feedback;
}
