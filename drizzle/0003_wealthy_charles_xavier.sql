CREATE TABLE `favorite_project_metadata` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`project_id` varchar(64) NOT NULL,
	`display_name` varchar(160) NOT NULL,
	`description` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `favorite_project_metadata_id` PRIMARY KEY(`id`),
	CONSTRAINT `favorite_project_metadata_user_project_idx` UNIQUE(`user_id`,`project_id`)
);
