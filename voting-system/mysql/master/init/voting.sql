-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 19, 2026 at 11:44 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
USE voting;

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `voting`
--

-- --------------------------------------------------------

--
-- Table structure for table `candidates`
--

CREATE TABLE `candidates` (
  `candidate_id` int(10) NOT NULL,
  `election_id` int(10) NOT NULL,
  `firstname` varchar(45) NOT NULL,
  `lastname` varchar(45) NOT NULL,
  `alias` varchar(45) NOT NULL,
  `position_id` int(10) NOT NULL,
  `photo` varchar(45) NOT NULL,
  `bio` varchar(255) NOT NULL,
  `ballot_number` int(10) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `candidates`
--

INSERT INTO `candidates` (`candidate_id`, `election_id`, `firstname`, `lastname`, `alias`, `position_id`, `photo`, `bio`, `ballot_number`) VALUES
(9, 1, 'Juan', 'Dela Cruz', 'JDC', 1, 'assets/juandelacruz.jpg', 'Senior student, 4th year BSCS', 1),
(10, 1, 'Maria', 'Santos', 'Mars', 1, 'assets/mariasantos.jpg', 'Student council member, 3rd year', 2),
(11, 1, 'Pedro', 'Reyes', 'Pete', 2, 'assets/pedroreyes.jpg', 'Active in community service', 1),
(12, 1, 'Ana', 'Lopez', 'Annie', 2, 'assets/analopez.jpg', 'Excellent in academics', 2),
(13, 1, 'Carlo', 'Mendoza', 'Carl', 3, 'assets/carlomendoza.jpg', 'Organized and detail-oriented', 1),
(14, 1, 'Lisa', 'Garcia', 'Lis', 3, 'assets/lisagarcia.jpg', 'Former class secretary', 2),
(15, 1, 'Mark', 'Villanueva', 'MV', 4, 'assets/markvillanueva.jpg', 'Finance committee member', 1),
(16, 1, 'Sofia', 'Reyes', 'Sof', 4, 'assets/sofiareyes.jpg', 'Math wizard, 3rd year', 2);

-- --------------------------------------------------------

--
-- Table structure for table `elections`
--

CREATE TABLE `elections` (
  `election_id` int(10) NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `election_status` enum('pending','active','closed','') NOT NULL DEFAULT 'pending',
  `election_title` varchar(45) NOT NULL,
  `election_description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `elections`
--

INSERT INTO `elections` (`election_id`, `start_time`, `end_time`, `election_status`, `election_title`, `election_description`) VALUES
(1, '2026-03-09 08:00:00', '2026-03-31 23:59:00', 'active', 'SSC Election 2026', 'Supreme Student Council Election 2026');

-- --------------------------------------------------------

--
-- Table structure for table `position`
--

CREATE TABLE `position` (
  `position_id` int(10) NOT NULL,
  `position_name` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `position`
--

INSERT INTO `position` (`position_id`, `position_name`) VALUES
(1, 'President'),
(2, 'Vice President'),
(3, 'Secretary'),
(4, 'Treasurer');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(10) NOT NULL,
  `firstname` varchar(45) NOT NULL,
  `lastname` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('voter','admin') NOT NULL DEFAULT 'voter',
  `id_number` varchar(50) NOT NULL,
  `age` int(11) DEFAULT NULL,
  `address` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `firstname`, `lastname`, `email`, `password`, `role`, `id_number`, `age`, `address`) VALUES
(1, 'Test', 'User', 'test@email.com', '$2b$10$Chqijg0KVS4JeNZFPpL42eVSoyCOR1jKNgPaStMC1PWE7d4ZUYQrK', 'admin', '', NULL, NULL),
(2, 'mariz', 'macasa', 'marizmacasa@gmail.com', '$2b$10$EiK.G90R.5juCmzP46H6QuidhmFbCqvjFNoKPXrnF3QPxVCDJqkmi', '', '', NULL, NULL),
(3, 'noya', 'nish', 'noya@gmail.com', '$2b$10$lp7EyFWvCoVHnvbK0NtPQOIz4rpPK.j83Z0v4Gglk5vNyLn0UAOgW', 'voter', '12222', 56, 'Bunsuran 1st Pandi Bulacan'),
(4, 'cooper', 'macasa', 'cooper@gmail.com', '$2b$10$W7OaR0RhCWYzbSpRsgl8yOrRv8u/.Q9SjtqH1vwdhIcPNsvk2xDna', 'voter', '01234', 5, 'kalawakan'),
(5, 'ke', 'mee', 'keme@gmail.com', '$2b$10$1CUlF6jHt874iWUh93BWtOLMYPE0aKsHQSaMX.ct3E/25iFN0mVrG', 'voter', '34533', 34, 'kalawakan'),
(6, 'kae', 'dy', 'kd@gmail.com', '$2b$10$8P/erH5S8coUFGDAiMbAP.vnAK.7X2aUd2yjQd7mTwJd9wHxhOnsG', 'voter', '77777', 21, 'kalawakan'),
(7, 'flo', 'bu', 'florenstine@gmail.com', '$2b$10$w.qx2vAaFP9waxUn86StIusuKWjjKkv0ybCmutmTp0sGhs3g7firm', 'voter', '5738', 21, 'angat');

-- --------------------------------------------------------

--
-- Table structure for table `votes`
--

CREATE TABLE `votes` (
  `vote_id` int(10) NOT NULL,
  `user_id` int(10) NOT NULL,
  `position_id` int(10) NOT NULL,
  `candidate_id` int(10) NOT NULL,
  `election_id` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `votes`
--

INSERT INTO `votes` (`vote_id`, `user_id`, `position_id`, `candidate_id`, `election_id`) VALUES
(1, 2, 1, 9, 1),
(2, 2, 4, 16, 1),
(3, 2, 2, 11, 1),
(4, 2, 3, 13, 1),
(5, 3, 1, 9, 1),
(6, 3, 2, 11, 1),
(7, 3, 3, 14, 1),
(8, 3, 4, 15, 1),
(9, 4, 1, 9, 1),
(10, 4, 4, 16, 1),
(11, 4, 3, 13, 1),
(12, 5, 1, 9, 1),
(13, 5, 2, 11, 1),
(14, 5, 3, 13, 1),
(15, 5, 4, 15, 1),
(16, 6, 1, 9, 1),
(17, 6, 2, 12, 1),
(18, 6, 4, 16, 1),
(19, 6, 3, 13, 1),
(20, 7, 1, 10, 1),
(21, 7, 2, 12, 1),
(22, 7, 3, 14, 1),
(23, 7, 4, 15, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `candidates`
--
ALTER TABLE `candidates`
  ADD PRIMARY KEY (`candidate_id`),
  ADD KEY `POSITION_PK` (`position_id`),
  ADD KEY `ELECTION_PK` (`election_id`);

--
-- Indexes for table `elections`
--
ALTER TABLE `elections`
  ADD PRIMARY KEY (`election_id`);

--
-- Indexes for table `position`
--
ALTER TABLE `position`
  ADD PRIMARY KEY (`position_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`);

--
-- Indexes for table `votes`
--
ALTER TABLE `votes`
  ADD PRIMARY KEY (`vote_id`),
  ADD UNIQUE KEY `user_id_2` (`user_id`,`position_id`,`election_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `position_id` (`position_id`),
  ADD KEY `candidate_id` (`candidate_id`),
  ADD KEY `election_id` (`election_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `candidates`
--
ALTER TABLE `candidates`
  MODIFY `candidate_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `elections`
--
ALTER TABLE `elections`
  MODIFY `election_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `position`
--
ALTER TABLE `position`
  MODIFY `position_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `votes`
--
ALTER TABLE `votes`
  MODIFY `vote_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `candidates`
--
ALTER TABLE `candidates`
  ADD CONSTRAINT `ELECTION_PK` FOREIGN KEY (`election_id`) REFERENCES `elections` (`election_id`),
  ADD CONSTRAINT `POSITION_PK` FOREIGN KEY (`position_id`) REFERENCES `position` (`position_id`);

--
-- Constraints for table `votes`
--
ALTER TABLE `votes`
  ADD CONSTRAINT `candidate_id` FOREIGN KEY (`candidate_id`) REFERENCES `candidates` (`candidate_id`),
  ADD CONSTRAINT `election_id` FOREIGN KEY (`election_id`) REFERENCES `elections` (`election_id`),
  ADD CONSTRAINT `position_id` FOREIGN KEY (`position_id`) REFERENCES `position` (`position_id`),
  ADD CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
