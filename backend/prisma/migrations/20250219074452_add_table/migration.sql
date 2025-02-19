-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "country" TEXT NOT NULL,
    "postal_code" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address1" TEXT NOT NULL,
    "address2" TEXT NOT NULL,
    "is_ask_restrictions" BOOLEAN NOT NULL,
    "event_type" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "note_for_things_to_buy" TEXT NOT NULL,
    "note_for_things_to_bring" TEXT NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events_particpants" (
    "event_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "is_accepted" BOOLEAN NOT NULL,
    "is_attended" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "participants_restrictions" (
    "id" SERIAL NOT NULL,
    "event_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "note" TEXT NOT NULL,

    CONSTRAINT "participants_restrictions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "things_to_bring" (
    "event_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "item" TEXT NOT NULL,
    "is_added" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "things_to_buy" (
    "id" SERIAL NOT NULL,
    "event_id" INTEGER NOT NULL,
    "item" TEXT NOT NULL,
    "is_purchase" BOOLEAN NOT NULL,

    CONSTRAINT "things_to_buy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timelines" (
    "id" SERIAL NOT NULL,
    "event_id" INTEGER NOT NULL,
    "schedule_item" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "timelines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media" (
    "id" SERIAL NOT NULL,
    "event_id" INTEGER NOT NULL,
    "image_title" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "events_particpants_event_id_user_id_key" ON "events_particpants"("event_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "things_to_bring_event_id_user_id_order_key" ON "things_to_bring"("event_id", "user_id", "order");

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events_particpants" ADD CONSTRAINT "events_particpants_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events_particpants" ADD CONSTRAINT "events_particpants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participants_restrictions" ADD CONSTRAINT "participants_restrictions_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participants_restrictions" ADD CONSTRAINT "participants_restrictions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "things_to_bring" ADD CONSTRAINT "things_to_bring_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "things_to_bring" ADD CONSTRAINT "things_to_bring_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "things_to_buy" ADD CONSTRAINT "things_to_buy_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timelines" ADD CONSTRAINT "timelines_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
