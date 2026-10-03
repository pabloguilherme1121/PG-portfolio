CREATE TABLE `favorite_project_orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`project_id` varchar(64) NOT NULL,
	`position` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `favorite_project_orders_id` PRIMARY KEY(`id`),
	CONSTRAINT `favorite_project_orders_user_project_idx` UNIQUE(`user_id`,`project_id`),
	CONSTRAINT `favorite_project_orders_user_position_idx` UNIQUE(`user_id`,`position`)
);
