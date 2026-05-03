package com.eduxchange.eduxchange.dto;

import lombok.Data;

@Data
public class SkillRequest {
    private String name;
    private String level;
    private String type; // TEACH or LEARN
}
