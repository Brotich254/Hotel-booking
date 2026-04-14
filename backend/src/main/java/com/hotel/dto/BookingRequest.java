package com.hotel.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;

@Data
public class BookingRequest {
    @NotNull
    private Long roomId;

    @NotNull
    private LocalDate checkIn;

    @NotNull
    private LocalDate checkOut;

    @Min(1)
    private Integer guests;

    private String specialRequests;
}
