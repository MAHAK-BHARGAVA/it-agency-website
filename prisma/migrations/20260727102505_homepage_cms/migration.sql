/*
  Warnings:

  - You are about to drop the column `aboutDescription` on the `sitesetting` table. All the data in the column will be lost.
  - You are about to drop the column `aboutExperience` on the `sitesetting` table. All the data in the column will be lost.
  - You are about to drop the column `aboutImage` on the `sitesetting` table. All the data in the column will be lost.
  - You are about to drop the column `aboutTitle` on the `sitesetting` table. All the data in the column will be lost.
  - You are about to drop the column `heroBadge` on the `sitesetting` table. All the data in the column will be lost.
  - You are about to drop the column `heroDescription` on the `sitesetting` table. All the data in the column will be lost.
  - You are about to drop the column `heroImage` on the `sitesetting` table. All the data in the column will be lost.
  - You are about to drop the column `heroPrimaryBtnLink` on the `sitesetting` table. All the data in the column will be lost.
  - You are about to drop the column `heroPrimaryBtnText` on the `sitesetting` table. All the data in the column will be lost.
  - You are about to drop the column `heroSecondaryBtnLink` on the `sitesetting` table. All the data in the column will be lost.
  - You are about to drop the column `heroSecondaryBtnText` on the `sitesetting` table. All the data in the column will be lost.
  - You are about to drop the column `heroTitle` on the `sitesetting` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `sitesetting` DROP COLUMN `aboutDescription`,
    DROP COLUMN `aboutExperience`,
    DROP COLUMN `aboutImage`,
    DROP COLUMN `aboutTitle`,
    DROP COLUMN `heroBadge`,
    DROP COLUMN `heroDescription`,
    DROP COLUMN `heroImage`,
    DROP COLUMN `heroPrimaryBtnLink`,
    DROP COLUMN `heroPrimaryBtnText`,
    DROP COLUMN `heroSecondaryBtnLink`,
    DROP COLUMN `heroSecondaryBtnText`,
    DROP COLUMN `heroTitle`;

-- CreateTable
CREATE TABLE `HomeHero` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `badge` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `primaryButtonText` VARCHAR(191) NOT NULL,
    `primaryButtonLink` VARCHAR(191) NOT NULL,
    `secondaryButtonText` VARCHAR(191) NULL,
    `secondaryButtonLink` VARCHAR(191) NULL,
    `heroImage` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HomeAbout` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `sectionTitle` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `experience` INTEGER NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `featureOne` VARCHAR(191) NOT NULL,
    `featureTwo` VARCHAR(191) NOT NULL,
    `featureThree` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
