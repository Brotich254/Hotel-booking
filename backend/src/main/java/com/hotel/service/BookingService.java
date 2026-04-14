package com.hotel.service;

import com.hotel.dto.BookingRequest;
import com.hotel.model.*;
import com.hotel.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    @Transactional
    public Booking createBooking(BookingRequest req, String userEmail) {
        if (!req.getCheckOut().isAfter(req.getCheckIn())) {
            throw new RuntimeException("Check-out must be after check-in");
        }

        Room room = roomRepository.findById(req.getRoomId())
            .orElseThrow(() -> new RuntimeException("Room not found"));

        // Check availability
        List<Booking> conflicts = bookingRepository.findConflictingBookings(
            room.getId(), req.getCheckIn(), req.getCheckOut());
        if (!conflicts.isEmpty()) {
            throw new RuntimeException("Room is not available for selected dates");
        }

        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));

        long nights = ChronoUnit.DAYS.between(req.getCheckIn(), req.getCheckOut());
        BigDecimal total = room.getPricePerNight().multiply(BigDecimal.valueOf(nights));

        return bookingRepository.save(Booking.builder()
            .user(user)
            .room(room)
            .checkIn(req.getCheckIn())
            .checkOut(req.getCheckOut())
            .guests(req.getGuests())
            .totalPrice(total)
            .specialRequests(req.getSpecialRequests())
            .build());
    }

    public List<Booking> getUserBookings(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    @Transactional
    public Booking cancelBooking(Long bookingId, String userEmail) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized");
        }

        booking.setStatus(Booking.BookingStatus.CANCELLED);
        return bookingRepository.save(booking);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAllByOrderByCreatedAtDesc();
    }

    public java.util.Map<String, Object> getStats() {
        long total = bookingRepository.count();
        long active = bookingRepository.countActiveBookings();
        BigDecimal revenue = bookingRepository.totalRevenue();
        return java.util.Map.of(
            "totalBookings", total,
            "activeBookings", active,
            "totalRevenue", revenue != null ? revenue : BigDecimal.ZERO
        );
    }
}
