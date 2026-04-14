package com.hotel.repository;

import com.hotel.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Booking> findAllByOrderByCreatedAtDesc();

    boolean existsByRoomIdAndStatusAndCheckInLessThanAndCheckOutGreaterThan(
        Long roomId,
        Booking.BookingStatus status,
        LocalDate checkOut,
        LocalDate checkIn
    );

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.status = 'CONFIRMED'")
    long countActiveBookings();

    @Query("SELECT SUM(b.totalPrice) FROM Booking b WHERE b.status != 'CANCELLED'")
    java.math.BigDecimal totalRevenue();

    @Query("""
        SELECT b FROM Booking b
        WHERE b.room.id = :roomId
        AND b.status = 'CONFIRMED'
        AND b.checkIn < :checkOut
        AND b.checkOut > :checkIn
    """)
    List<Booking> findConflictingBookings(
        @Param("roomId") Long roomId,
        @Param("checkIn") LocalDate checkIn,
        @Param("checkOut") LocalDate checkOut
    );
}
