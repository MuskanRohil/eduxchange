package com.eduxchange.eduxchange.controller;

import com.eduxchange.eduxchange.dto.SkillRequest;
import com.eduxchange.eduxchange.entity.Skill;
import com.eduxchange.eduxchange.entity.User;
import com.eduxchange.eduxchange.service.SkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/skills")
public class SkillController {

    @Autowired
    private SkillService skillService;

    @PostMapping
    public ResponseEntity<Skill> addSkill(@RequestBody SkillRequest request, Authentication authentication) {
        Skill skill = skillService.addSkill(request, authentication.getName());
        return ResponseEntity.ok(skill);
    }

    @GetMapping
    public ResponseEntity<List<Skill>> getMySkills(Authentication authentication) {
        List<Skill> skills = skillService.getUserSkills(authentication.getName());
        return ResponseEntity.ok(skills);
    }

    @GetMapping("/matches")
    public ResponseEntity<List<Skill>> getMatchedSkills(Authentication authentication) {
        List<Skill> matches = skillService.getMatchedSkills(authentication.getName());
        return ResponseEntity.ok(matches);
    }
}
