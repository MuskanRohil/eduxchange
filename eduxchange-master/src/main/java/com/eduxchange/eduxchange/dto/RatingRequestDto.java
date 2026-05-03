package com.eduxchange.eduxchange.dto;

import lombok.Data;

@Data
public class RatingRequestDto {
    private Long reviewedId;
    private Integer score;
    private String feedback;
}
