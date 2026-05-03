package com.eduxchange.eduxchange.controller;

import com.eduxchange.eduxchange.dto.CreateSessionRequestDto;
import com.eduxchange.eduxchange.dto.RatingRequestDto;
import com.eduxchange.eduxchange.entity.Rating;
import com.eduxchange.eduxchange.entity.SessionRequest;
import com.eduxchange.eduxchange.service.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:5174"})
@RestController
@RequestMapping("/api/sessions")
public class SessionController {

    @Autowired
    private SessionService sessionService;

    @PostMapping("/request")
    public ResponseEntity<SessionRequest> sendRequest(@RequestBody CreateSessionRequestDto dto, Authentication auth) {
        return ResponseEntity.ok(sessionService.sendRequest(dto, auth.getName()));
    }

    @PutMapping("/{requestId}/status")
    public ResponseEntity<SessionRequest> updateStatus(@PathVariable Long requestId, @RequestParam String status, Authentication auth) {
        return ResponseEntity.ok(sessionService.updateRequestStatus(requestId, status, auth.getName()));
    }

    @GetMapping("/incoming")
    public ResponseEntity<List<SessionRequest>> getIncomingRequests(Authentication auth) {
        return ResponseEntity.ok(sessionService.getMyRequests(auth.getName()));
    }

    @GetMapping("/outgoing")
    public ResponseEntity<List<SessionRequest>> getOutgoingRequests(Authentication auth) {
        return ResponseEntity.ok(sessionService.getSentRequests(auth.getName()));
    }

    @PostMapping("/rating")
    public ResponseEntity<Rating> giveRating(@RequestBody RatingRequestDto dto, Authentication auth) {
        return ResponseEntity.ok(sessionService.giveRating(dto, auth.getName()));
    }

    @GetMapping("/rating/{userId}")
    public ResponseEntity<Double> getAverageRating(@PathVariable Long userId) {
        return ResponseEntity.ok(sessionService.getAverageRating(userId));
    }
}
