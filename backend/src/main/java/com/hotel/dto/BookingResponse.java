package com.hotel.dto;

import com.hotel.model.Booking;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class BookingResponse {
    private Long id;
    private Long roomId;
    private String roomName;
    private String roomNumber;
    private String roomImageUrl;
    private LocalDate checkIn;
    private LocalDate checkOut;
    private Integer guests;
    private BigDecimal totalPrice;
    private String status;
    private String specialRequests;
    private LocalDateTime createdAt;
    private String guestName;
    private String guestEmail;

    public static BookingResponse from(Booking b) {
        BookingResponse r = new BookingResponse();
        r.setId(b.getId());
        r.setRoomId(b.getRoom().getId());
        r.setRoomName(b.getRoom().getName());
        r.setRoomNumber(b.getRoom().getRoomNumber());
        r.setRoomImageUrl(b.getRoom().getImageUrl());
        r.setCheckIn(b.getCheckIn());
        r.setCheckOut(b.getCheckOut());
        r.setGuests(b.getGuests());
        r.setTotalPrice(b.getTotalPrice());
        r.setStatus(b.getStatus().name());
        r.setSpecialRequests(b.getSpecialRequests());
        r.setCreatedAt(b.getCreatedAt());
        r.setGuestName(b.getUser().getName());
        r.setGuestEmail(b.getUser().getEmail());
        return r;
    }
}
