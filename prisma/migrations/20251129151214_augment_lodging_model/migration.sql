-- AlterTable
ALTER TABLE "Lodging" ADD COLUMN     "address" TEXT DEFAULT 'Kathmandu, Nepal',
ADD COLUMN     "amenities" TEXT[] DEFAULT ARRAY['Free WiFi', 'Breakfast included']::TEXT[],
ADD COLUMN     "nearbyPlaces" JSONB DEFAULT '[{"name": "City Center", "time": "5 min walk"}]',
ADD COLUMN     "reviewCount" INTEGER NOT NULL DEFAULT 120,
ADD COLUMN     "reviewScore" DOUBLE PRECISION NOT NULL DEFAULT 9.0,
ADD COLUMN     "starRating" DOUBLE PRECISION NOT NULL DEFAULT 4.5;
