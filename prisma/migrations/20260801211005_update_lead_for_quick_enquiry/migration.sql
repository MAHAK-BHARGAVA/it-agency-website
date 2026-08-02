-- AlterTable
ALTER TABLE `Lead` ADD COLUMN `preferredStartTime` VARCHAR(191) NULL,
    ADD COLUMN `source` VARCHAR(191) NULL DEFAULT 'website',
    MODIFY `email` VARCHAR(191) NULL,
    MODIFY `message` TEXT NULL;
