package com.eduxchange.eduxchange.service;

import com.eduxchange.eduxchange.dto.CreateSessionRequestDto;
import com.eduxchange.eduxchange.dto.RatingRequestDto;
import com.eduxchange.eduxchange.entity.Rating;
import com.eduxchange.eduxchange.entity.SessionRequest;
import com.eduxchange.eduxchange.entity.Skill;
import com.eduxchange.eduxchange.entity.User;
import com.eduxchange.eduxchange.repository.RatingRepository;
import com.eduxchange.eduxchange.repository.SessionRepository;
import com.eduxchange.eduxchange.repository.SkillRepository;
import com.eduxchange.eduxchange.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SessionService {

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private RatingRepository ratingRepository;

    public SessionRequest sendRequest(CreateSessionRequestDto dto, String requesterEmail) {
        User requester = userRepository.findByEmail(requesterEmail)
                .orElseThrow(() -> new RuntimeException("Requester not found"));

        User receiver = userRepository.findById(dto.getReceiverId())
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        Skill skill = skillRepository.findById(dto.getSkillId())
                .orElseThrow(() -> new RuntimeException("Skill not found"));

        SessionRequest request = SessionRequest.builder()
                .requester(requester)
                .receiver(receiver)
                .skill(skill)
                .status("PENDING")
                .requestTime(LocalDateTime.now())
                .scheduledTime(dto.getScheduledTime())
                .build();

        return sessionRepository.save(request);
    }

    public SessionRequest updateRequestStatus(Long requestId, String status, String receiverEmail) {
        SessionRequest request = sessionRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Session request not found"));

        if (!request.getReceiver().getEmail().equals(receiverEmail)) {
            throw new RuntimeException("Not authorized to update this request");
        }

        request.setStatus(status);
        return sessionRepository.save(request);
    }

    public List<SessionRequest> getMyRequests(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return sessionRepository.findByReceiverId(user.getId());
    }

    public List<SessionRequest> getSentRequests(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return sessionRepository.findByRequesterId(user.getId());
    }

    public Rating giveRating(RatingRequestDto dto, String reviewerEmail) {
        User reviewer = userRepository.findByEmail(reviewerEmail)
                .orElseThrow(() -> new RuntimeException("Reviewer not found"));

        User reviewed = userRepository.findById(dto.getReviewedId())
                .orElseThrow(() -> new RuntimeException("Reviewed user not found"));

        Rating rating = Rating.builder()
                .reviewer(reviewer)
                .reviewed(reviewed)
                .score(dto.getScore())
                .feedback(dto.getFeedback())
                .build();

        return ratingRepository.save(rating);
    }

    public Double getAverageRating(Long userId) {
        List<Rating> ratings = ratingRepository.findByReviewedId(userId);
        if (ratings.isEmpty()) return 0.0;
        return ratings.stream().mapToInt(Rating::getScore).average().orElse(0.0);
    }
}
