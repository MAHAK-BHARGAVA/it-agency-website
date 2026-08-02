-- DropForeignKey
ALTER TABLE `ServiceCity` DROP FOREIGN KEY `ServiceCity_serviceId_fkey`;

-- DropForeignKey
ALTER TABLE `ServiceIndustry` DROP FOREIGN KEY `ServiceIndustry_serviceId_fkey`;

-- DropForeignKey
ALTER TABLE `ServiceState` DROP FOREIGN KEY `ServiceState_serviceId_fkey`;

-- AddForeignKey
ALTER TABLE `ServiceCity` ADD CONSTRAINT `ServiceCity_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceState` ADD CONSTRAINT `ServiceState_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceIndustry` ADD CONSTRAINT `ServiceIndustry_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
