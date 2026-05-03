package com.eduxchange.eduxchange.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CreateSessionRequestDto {
    private Long receiverId;
    private Long skillId;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    private LocalDateTime scheduledTime;
}
