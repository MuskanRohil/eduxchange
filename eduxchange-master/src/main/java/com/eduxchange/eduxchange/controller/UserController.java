package com.eduxchange.eduxchange.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import com.eduxchange.eduxchange.entity.User;
import com.eduxchange.eduxchange.service.UserService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/all")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/profile")
    public Map<String, Object> getUserProfile(Authentication auth) {
        return userService.getUserProfileSummary(auth.getName());
    }
}