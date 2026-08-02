/*
  Warnings:

  - A unique constraint covering the columns `[testimonialId]` on the table `Portfolio` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Portfolio` ADD COLUMN `challenge` TEXT NULL,
    ADD COLUMN `process` TEXT NULL,
    ADD COLUMN `solution` TEXT NULL,
    ADD COLUMN `testimonialId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Portfolio_testimonialId_key` ON `Portfolio`(`testimonialId`);

-- AddForeignKey
ALTER TABLE `Portfolio` ADD CONSTRAINT `Portfolio_testimonialId_fkey` FOREIGN KEY (`testimonialId`) REFERENCES `Testimonial`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
