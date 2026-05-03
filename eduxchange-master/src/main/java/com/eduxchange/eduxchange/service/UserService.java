package com.eduxchange.eduxchange.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.eduxchange.eduxchange.entity.User;
import com.eduxchange.eduxchange.repository.UserRepository;
import com.eduxchange.eduxchange.repository.RatingRepository;
import com.eduxchange.eduxchange.repository.SessionRepository;
import com.eduxchange.eduxchange.repository.SkillRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service 
public class UserService {
    @Autowired private UserRepository userRepository;
    @Autowired private SkillRepository skillRepository;
    @Autowired private SessionRepository sessionRepository;
    @Autowired private RatingRepository ratingRepository;

    public User saveUser(User user) {
        return userRepository.save(user);
    }
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Map<String, Object> getUserProfileSummary(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        long skillCount = skillRepository.findByUserId(user.getId()).size();
        
        long sessionCount = sessionRepository.findByRequesterId(user.getId()).stream()
                .filter(s -> "ACCEPTED".equalsIgnoreCase(s.getStatus())).count();
        sessionCount += sessionRepository.findByReceiverId(user.getId()).stream()
                .filter(s -> "ACCEPTED".equalsIgnoreCase(s.getStatus())).count();

        // Calculate matches (same logic as in SkillController/Service)
        List<com.eduxchange.eduxchange.entity.Skill> mySkills = skillRepository.findByUserId(user.getId());
        java.util.Set<Long> matchIds = new java.util.HashSet<>();
        for (com.eduxchange.eduxchange.entity.Skill mySkill : mySkills) {
            String targetType = "TEACH".equals(mySkill.getType()) ? "LEARN" : "TEACH";
            String skillName = mySkill.getName().toLowerCase().trim();
            List<com.eduxchange.eduxchange.entity.Skill> complementarySkills = skillRepository.findAll().stream()
                .filter(s -> s.getName().toLowerCase().trim().equals(skillName) && s.getType().equals(targetType))
                .collect(java.util.stream.Collectors.toList());
            for (com.eduxchange.eduxchange.entity.Skill comp : complementarySkills) {
                if (!comp.getUser().getId().equals(user.getId())) {
                    matchIds.add(comp.getUser().getId());
                }
            }
        }

        List<com.eduxchange.eduxchange.entity.Rating> ratings = ratingRepository.findByReviewedId(user.getId());
        double avgRating = ratings.stream().mapToInt(r -> r.getScore()).average().orElse(0.0);

        Map<String, Object> summary = new HashMap<>();
        summary.put("skillCount", skillCount);
        summary.put("sessionCount", sessionCount);
        summary.put("matchCount", matchIds.size());
        summary.put("averageRating", avgRating);
        summary.put("ratings", ratings.stream().map(r -> {
            Map<String, Object> rm = new HashMap<>();
            rm.put("reviewerName", r.getReviewer().getName());
            rm.put("score", r.getScore());
            rm.put("feedback", r.getFeedback());
            return rm;
        }).collect(java.util.stream.Collectors.toList()));
        summary.put("name", user.getName());
        summary.put("email", user.getEmail());
        
        return summary;
    }
}