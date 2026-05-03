package com.eduxchange.eduxchange.controller;

import com.eduxchange.eduxchange.entity.Message;
import com.eduxchange.eduxchange.entity.User;
import com.eduxchange.eduxchange.repository.MessageRepository;
import com.eduxchange.eduxchange.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/{otherUserId}")
    public ResponseEntity<List<Message>> getConversation(@PathVariable Long otherUserId, Authentication auth) {
        User currentUser = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(messageRepository.findConversation(currentUser.getId(), otherUserId));
    }

    @PostMapping
    public ResponseEntity<Message> sendMessage(@RequestBody Map<String, Object> payload, Authentication auth) {
        User sender = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        
        Long receiverId = Long.valueOf(payload.get("receiverId").toString());
        String content = payload.get("content").toString();
        
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        Message message = Message.builder()
                .sender(sender)
                .receiver(receiver)
                .content(content)
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.ok(messageRepository.save(message));
    }
}
