package com.eduxchange.eduxchange.repository;

import com.eduxchange.eduxchange.entity.SessionRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SessionRepository extends JpaRepository<SessionRequest, Long> {
    List<SessionRequest> findByRequesterId(Long requesterId);
    List<SessionRequest> findByReceiverId(Long receiverId);
}
