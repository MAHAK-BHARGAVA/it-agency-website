-- AlterTable
ALTER TABLE `leads` ADD COLUMN `assignedToId` INTEGER NULL,
    ADD COLUMN `estimatedValue` DECIMAL(12, 2) NULL,
    ADD COLUMN `lostReason` VARCHAR(191) NULL,
    ADD COLUMN `nextFollowUpAt` DATETIME(3) NULL,
    ADD COLUMN `priority` ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT') NOT NULL DEFAULT 'MEDIUM',
    MODIFY `status` ENUM('NEW', 'CONTACTED', 'QUALIFIED', 'MEETING_SCHEDULED', 'PROPOSAL_SENT', 'NEGOTIATION', 'WON', 'LOST', 'SPAM') NOT NULL DEFAULT 'NEW';

-- CreateTable
CREATE TABLE `LeadActivity` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `leadId` INTEGER NOT NULL,
    `type` ENUM('LEAD_CREATED', 'STATUS_CHANGED', 'NOTE_ADDED', 'NOTE_UPDATED', 'CALL', 'EMAIL', 'WHATSAPP', 'MEETING', 'FOLLOW_UP', 'PROPOSAL_SENT') NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `oldStatus` ENUM('NEW', 'CONTACTED', 'QUALIFIED', 'MEETING_SCHEDULED', 'PROPOSAL_SENT', 'NEGOTIATION', 'WON', 'LOST', 'SPAM') NULL,
    `newStatus` ENUM('NEW', 'CONTACTED', 'QUALIFIED', 'MEETING_SCHEDULED', 'PROPOSAL_SENT', 'NEGOTIATION', 'WON', 'LOST', 'SPAM') NULL,
    `createdById` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `LeadActivity_leadId_idx`(`leadId`),
    INDEX `LeadActivity_createdById_idx`(`createdById`),
    INDEX `LeadActivity_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `leads_status_idx` ON `leads`(`status`);

-- CreateIndex
CREATE INDEX `leads_assignedToId_idx` ON `leads`(`assignedToId`);

-- CreateIndex
CREATE INDEX `leads_nextFollowUpAt_idx` ON `leads`(`nextFollowUpAt`);

-- CreateIndex
CREATE INDEX `leads_createdAt_idx` ON `leads`(`createdAt`);

-- AddForeignKey
ALTER TABLE `leads` ADD CONSTRAINT `leads_assignedToId_fkey` FOREIGN KEY (`assignedToId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LeadActivity` ADD CONSTRAINT `LeadActivity_leadId_fkey` FOREIGN KEY (`leadId`) REFERENCES `leads`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LeadActivity` ADD CONSTRAINT `LeadActivity_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `leads` RENAME INDEX `leads_serviceId_fkey` TO `leads_serviceId_idx`;
