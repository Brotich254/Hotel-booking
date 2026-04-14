package com.hotel.controller;

import com.hotel.model.Room;
import com.hotel.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomRepository roomRepository;

    @GetMapping
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    @GetMapping("/available")
    public List<Room> getAvailableRooms(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut,
        @RequestParam(required = false) String type,
        @RequestParam(required = false) Integer capacity
    ) {
        return roomRepository.findAvailableRooms(checkIn, checkOut, type, capacity);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Room> getRoom(@PathVariable Long id) {
        return roomRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Room createRoom(@RequestBody Room room) {
        return roomRepository.save(room);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Room> updateRoom(@PathVariable Long id, @RequestBody Room updated) {
        return roomRepository.findById(id).map(room -> {
            room.setName(updated.getName());
            room.setDescription(updated.getDescription());
            room.setPricePerNight(updated.getPricePerNight());
            room.setCapacity(updated.getCapacity());
            room.setImageUrl(updated.getImageUrl());
            room.setAmenities(updated.getAmenities());
            room.setAvailable(updated.getAvailable());
            return ResponseEntity.ok(roomRepository.save(room));
        }).orElse(ResponseEntity.notFound().build());
    }
}
