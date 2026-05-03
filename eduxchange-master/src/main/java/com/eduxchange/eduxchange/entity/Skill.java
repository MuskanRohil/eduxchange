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
@Table(name = "skill_name")
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String level;

    private String type; // "TEACH" or "LEARN"

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
