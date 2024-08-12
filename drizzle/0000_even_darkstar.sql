CREATE TABLE `tuf-banner_ActiveBanner` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bannerId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tuf-banner_ActiveBanner_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tuf-banner_Banner` (
	`id` int AUTO_INCREMENT NOT NULL,
	`description` text NOT NULL,
	`link` varchar(2048) NOT NULL,
	`timer` tinyint unsigned NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tuf-banner_Banner_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tuf-banner_Users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` text NOT NULL,
	`name` varchar(255) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tuf-banner_Users_id` PRIMARY KEY(`id`),
	CONSTRAINT `tuf-banner_Users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `tuf-banner_ActiveBanner` ADD CONSTRAINT `tuf-banner_ActiveBanner_bannerId_tuf-banner_Banner_id_fk` FOREIGN KEY (`bannerId`) REFERENCES `tuf-banner_Banner`(`id`) ON DELETE cascade ON UPDATE no action;