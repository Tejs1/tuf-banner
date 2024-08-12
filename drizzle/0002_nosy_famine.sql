ALTER TABLE `tuf-banner_ActiveBanner` MODIFY COLUMN `bannerId` char(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `tuf-banner_Banner` MODIFY COLUMN `id` char(36) NOT NULL;