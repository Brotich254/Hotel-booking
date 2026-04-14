package com.hotel.repository;

import com.hotel.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {

    // Find rooms NOT booked in the given date range
    @Query("""
        SELECT r FROM Room r WHERE r.available = true
        AND r.id NOT IN (
            SELECT b.room.id FROM Booking b
            WHERE b.status = 'CONFIRMED'
            AND b.checkIn < :checkOut
            AND b.checkOut > :checkIn
        )
        AND (:type IS NULL OR CAST(r.type AS string) = :type)
        AND (:capacity IS NULL OR r.capacity >= :capacity)
    """)
    List<Room> findAvailableRooms(
        @Param("checkIn") LocalDate checkIn,
        @Param("checkOut") LocalDate checkOut,
        @Param("type") String type,
        @Param("capacity") Integer capacity
    );
}
