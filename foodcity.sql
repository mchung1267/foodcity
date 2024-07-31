-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Dec 18, 2020 at 08:04 AM
-- Server version: 5.7.31
-- PHP Version: 7.3.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `foodcity`
--
CREATE DATABASE IF NOT EXISTS `foodcity` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `foodcity`;

-- --------------------------------------------------------

--
-- Table structure for table `restaurant`
--

DROP TABLE IF EXISTS `restaurant`;
CREATE TABLE IF NOT EXISTS `restaurant` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `restaurant_name` varchar(40) NOT NULL,
  `restaurant_type` int(11) NOT NULL,
  `open_time` varchar(40) NOT NULL,
  `close_time` varchar(40) NOT NULL,
  `latitude` double NOT NULL,
  `longitude` double NOT NULL,
  `deleted` int(11) NOT NULL,
  `address` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `restaurant`
--

INSERT INTO `restaurant` (`id`, `restaurant_name`, `restaurant_type`, `open_time`, `close_time`, `latitude`, `longitude`, `deleted`, `address`) VALUES
(1, 'Fresh Kravings', 1, '10:00AM', '3:00PM', 43.2596103, -79.8679293, 0, '109 James St N, Hamilton, ON L8R 2K6'),
(2, 'Sagarmatha Curry Palace', 2, '12:00PM', '9:30PM', 43.257262, -79.867132, 0, '43 King William St, Hamilton, ON L8R 1A2'),
(3, 'Royal Spice Indian & hakka', 2, '11:30AM', '9:30PM', 43.240328, -79.808584, 0, '1443 Main St E, Hamilton, ON L8K 1C4'),
(4, 'South Sea Restaurant', 6, '3:00PM', '8:00PM', 43.2500254, -79.8165409, 0, '282 Ottawa St N, Hamilton, ON L8H 3Z9'),
(5, 'Great Wall Restaurant\r\n', 6, '3:00PM', '10:00PM', 43.246674, -79.806932, 0, '190 Kenilworth Ave N, Hamilton, ON L8H 4S2'),
(6, 'Rico\'s Restaurant', 3, '9:00AM', '7:00PM', 43.216659, -79.834744, 0, '866 Mohawk Rd E, Hamilton, ON L8T 2R5'),
(7, 'Adobo Queen', 3, '8:30AM', '7:00PM', 43.2620721, -79.8774, 0, '82 Queen St N, Hamilton, ON L8R 3P6'),
(8, 'Aijo Sushi', 4, '11:30AM', '11:00PM', 43.2550806, -79.864215, 0, '161 King St E, Hamilton, ON L8N 1B1'),
(9, 'Spring Sushi', 4, '11:30AM', '10:00PM', 43.207536, -79.891501, 0, '1508 Upper James St, Hamilton, ON L9B 1K3'),
(10, 'Paramount Middle Eastern Kitchen', 5, '11:00AM', '9:00PM', 43.207813, -79.889825, 0, '1441 Upper James St, Hamilton, ON L9B 1K2');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
CREATE TABLE IF NOT EXISTS `reviews` (
  `review_id` int(11) NOT NULL AUTO_INCREMENT,
  `restaurant` int(11) NOT NULL,
  `score` int(11) NOT NULL,
  PRIMARY KEY (`review_id`)
) ENGINE=MyISAM AUTO_INCREMENT=30 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`review_id`, `restaurant`, `score`) VALUES
(1, 1, 9),
(2, 1, 6),
(3, 2, 8),
(4, 4, 7),
(10, 7, 9),
(9, 8, 9),
(8, 7, 8),
(11, 7, 7),
(12, 6, 7),
(13, 1, 9),
(14, 8, 8),
(15, 10, 9),
(16, 7, 6),
(17, 7, 10),
(18, 5, 9),
(19, 4, 8),
(20, 3, 8),
(21, 8, 10),
(22, 1, 9),
(23, 2, 9),
(24, 4, 8),
(25, 4, 9),
(26, 4, 5),
(27, 4, 6),
(28, 4, 7),
(29, 1, 7);

-- --------------------------------------------------------

--
-- Table structure for table `types`
--

DROP TABLE IF EXISTS `types`;
CREATE TABLE IF NOT EXISTS `types` (
  `type_id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(50) NOT NULL,
  PRIMARY KEY (`type_id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `types`
--

INSERT INTO `types` (`type_id`, `type`) VALUES
(1, 'Turkish'),
(2, 'Indian'),
(3, 'Filipino'),
(4, 'Japanese'),
(5, 'Middle Eastern'),
(6, 'Chinese');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
