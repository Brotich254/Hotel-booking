-- Seed rooms if empty
INSERT INTO rooms (room_number, name, description, type, price_per_night, capacity, image_url, amenities, available)
SELECT * FROM (VALUES
  ('101', 'Standard Single', 'Cozy room with city view', 'STANDARD', 89.00, 1, 'https://placehold.co/800x500?text=Standard+Room', 'WiFi, TV, AC', true),
  ('102', 'Standard Double', 'Comfortable double room', 'STANDARD', 119.00, 2, 'https://placehold.co/800x500?text=Double+Room', 'WiFi, TV, AC, Mini-fridge', true),
  ('201', 'Deluxe King', 'Spacious room with king bed and sea view', 'DELUXE', 179.00, 2, 'https://placehold.co/800x500?text=Deluxe+Room', 'WiFi, TV, AC, Mini-bar, Bathtub', true),
  ('202', 'Deluxe Twin', 'Elegant twin room with garden view', 'DELUXE', 159.00, 2, 'https://placehold.co/800x500?text=Deluxe+Twin', 'WiFi, TV, AC, Mini-bar', true),
  ('301', 'Junior Suite', 'Luxurious suite with separate living area', 'SUITE', 279.00, 3, 'https://placehold.co/800x500?text=Junior+Suite', 'WiFi, TV, AC, Mini-bar, Jacuzzi, Lounge', true),
  ('401', 'Presidential Suite', 'Ultimate luxury with panoramic views', 'SUITE', 499.00, 4, 'https://placehold.co/800x500?text=Presidential+Suite', 'WiFi, TV, AC, Full bar, Jacuzzi, Butler service', true)
) AS v(room_number, name, description, type, price_per_night, capacity, image_url, amenities, available)
WHERE NOT EXISTS (SELECT 1 FROM rooms LIMIT 1);
