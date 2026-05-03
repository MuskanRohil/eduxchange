package com.eduxchange.eduxchange.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "session_requests")
public class SessionRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "requester_id", nullable = false)
    private User requester;

    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;

    @ManyToOne
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    private String status; // PENDING, ACCEPTED, REJECTED

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    private LocalDateTime requestTime;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    private LocalDateTime scheduledTime;

}
