package com.hotel.controller;

import com.hotel.dto.*;
import com.hotel.model.Booking;
import com.hotel.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<?> createBooking(@Valid @RequestBody BookingRequest req, Principal principal) {
        try {
            Booking booking = bookingService.createBooking(req, principal.getName());
            return ResponseEntity.ok(BookingResponse.from(booking));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/my")
    public List<BookingResponse> myBookings(Principal principal) {
        return bookingService.getUserBookings(principal.getName())
            .stream().map(BookingResponse::from).toList();
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id, Principal principal) {
        try {
            Booking booking = bookingService.cancelBooking(id, principal.getName());
            return ResponseEntity.ok(BookingResponse.from(booking));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Admin endpoints
    @GetMapping("/admin/all")
    public ResponseEntity<List<BookingResponse>> allBookings(Principal principal) {
        return ResponseEntity.ok(
            bookingService.getAllBookings().stream().map(BookingResponse::from).toList()
        );
    }

    @GetMapping("/admin/stats")
    public Map<String, Object> stats() {
        return bookingService.getStats();
    }
}
