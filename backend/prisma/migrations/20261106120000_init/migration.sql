CREATE TABLE "Genre" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "Genre_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Book" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "pages" INTEGER,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "genreId" INTEGER,
    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Book" ADD CONSTRAINT "Book_genreId_fkey"
    FOREIGN KEY ("genreId") REFERENCES "Genre"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
