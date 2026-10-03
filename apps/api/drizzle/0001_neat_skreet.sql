CREATE TABLE `availability_blocked_dates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date_key` varchar(10) NOT NULL,
	`note` varchar(180),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `availability_blocked_dates_id` PRIMARY KEY(`id`),
	CONSTRAINT `availability_blocked_dates_date_key_unique` UNIQUE(`date_key`)
);
