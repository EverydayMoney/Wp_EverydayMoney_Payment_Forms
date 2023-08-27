<?php

class EM_T_EverydayMoney_Activator
{

	public static function activate()
	{
		global $wpdb;
		$version = get_option('em_db_version', '1.0');
		$table_name = $wpdb->prefix . EM_APPLICATION_TECH_TABLE;

		$charset_collate = $wpdb->get_charset_collate();

		$sql = "CREATE TABLE IF NOT EXISTS `" . $table_name . "` (
			id int(11) NOT NULL AUTO_INCREMENT,
			post_id int(11) NOT NULL,
		  	user_id int(11) NOT NULL,
			email varchar(255) DEFAULT '' NOT NULL,
			phone varchar(255) DEFAULT '' NULL,
			referenceKey varchar(255) DEFAULT '' NULL,
			customerKey varchar(255) DEFAULT '' NULL,
			ourRef varchar(255) DEFAULT '' NOT NULL,
		  	metadata text,
			paid int(1) NOT NULL DEFAULT '0',
			settledAmount int(1) NOT NULL DEFAULT '0',
			amount varchar(255) DEFAULT '' NOT NULL,
			transactionRef varchar(255) DEFAULT '' NOT NULL,
		  	ip varchar(255) NULL, 
			deleted_at varchar(255) DEFAULT '' NULL,
			created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
			paid_at timestamp,
		  	modified timestamp DEFAULT '0000-00-00 00:00:00' NOT NULL,
		  	UNIQUE KEY id (id),PRIMARY KEY  (id)
		) $charset_collate;";

		include_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta($sql);
	}
}
