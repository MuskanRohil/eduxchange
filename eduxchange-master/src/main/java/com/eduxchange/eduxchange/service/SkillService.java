package com.eduxchange.eduxchange.service;

import com.eduxchange.eduxchange.dto.SkillRequest;
import com.eduxchange.eduxchange.entity.Skill;
import com.eduxchange.eduxchange.entity.User;
import com.eduxchange.eduxchange.repository.SkillRepository;
import com.eduxchange.eduxchange.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SkillService {

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private UserRepository userRepository;

    public Skill addSkill(SkillRequest request, String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        
        Skill skill = Skill.builder()
                .name(request.getName())
                .level(request.getLevel())
                .type(request.getType())
                .user(user)
                .build();
                
        return skillRepository.save(skill);
    }

    public List<Skill> getUserSkills(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        return skillRepository.findByUserId(user.getId());
    }

    public List<Skill> getMatchedSkills(String email) {
        User currentUser = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Skill> userWantsToLearn = skillRepository.findByUserId(currentUser.getId()).stream()
                .filter(s -> "LEARN".equals(s.getType()))
                .collect(Collectors.toList());

        // Find skills that others teach that the current user wants to learn
        return userWantsToLearn.stream()
                .flatMap(skillToLearn -> skillRepository.findByNameAndType(skillToLearn.getName(), "TEACH").stream())
                .filter(s -> !s.getUser().getId().equals(currentUser.getId()))
                .collect(Collectors.toList());
    }
}
