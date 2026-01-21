-- ------------------------------------------------------
-- Create Database
-- ------------------------------------------------------
CREATE DATABASE IF NOT EXISTS `car_marketplace` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `car_marketplace`;

-- ------------------------------------------------------
-- System Settings (MySQL Dump Style)
-- ------------------------------------------------------
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
 /*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
 /*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 /*!50503 SET NAMES utf8 */;
 /*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
 /*!40103 SET TIME_ZONE='+00:00' */;
 /*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
 /*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
 /*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
 /*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- ------------------------------------------------------
-- USERS TABLE
-- ------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
    `UserID` INT NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(100) NOT NULL,
    `Email` VARCHAR(100) NOT NULL UNIQUE,
    `Role` ENUM('buyer','dealer','admin') DEFAULT 'buyer',
    `KYCStatus` ENUM('pending','verified','rejected') DEFAULT 'pending',
    PRIMARY KEY (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ------------------------------------------------------
-- CARS TABLE
-- ------------------------------------------------------
DROP TABLE IF EXISTS `cars`;
CREATE TABLE `cars` (
    `CarID` INT NOT NULL AUTO_INCREMENT,
    `Model` VARCHAR(100) NOT NULL,
    `Brand` VARCHAR(50) NOT NULL,
    `Price` DECIMAL(10,2) NOT NULL,
    `DealerID` INT NOT NULL,
    `Availability` ENUM('available','sold','reserved') DEFAULT 'available',
    PRIMARY KEY (`CarID`),
    KEY `fk_cars_dealer` (`DealerID`),
    CONSTRAINT `fk_cars_dealer`
        FOREIGN KEY (`DealerID`)
        REFERENCES `users` (`UserID`)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ------------------------------------------------------
-- TRANSACTIONS TABLE
-- ------------------------------------------------------
DROP TABLE IF EXISTS `transactions`;
CREATE TABLE `transactions` (
    `TransID` INT NOT NULL AUTO_INCREMENT,
    `UserID` INT NOT NULL,
    `CarID` INT NOT NULL,
    `PaymentMethod` VARCHAR(50),
    `TransactionDate` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `Status` ENUM('pending','completed','failed') DEFAULT 'pending',
    PRIMARY KEY (`TransID`),
    KEY `fk_transactions_user` (`UserID`),
    KEY `fk_transactions_car` (`CarID`),
    CONSTRAINT `fk_transactions_user`
        FOREIGN KEY (`UserID`)
        REFERENCES `users` (`UserID`),
    CONSTRAINT `fk_transactions_car`
        FOREIGN KEY (`CarID`)
        REFERENCES `cars` (`CarID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ------------------------------------------------------
-- INSURANCE TABLE
-- ------------------------------------------------------
DROP TABLE IF EXISTS `insurance`;
CREATE TABLE `insurance` (
    `PolicyID` INT NOT NULL AUTO_INCREMENT,
    `UserID` INT NOT NULL,
    `CarID` INT NOT NULL,
    `Provider` VARCHAR(100),
    `Coverage` VARCHAR(200),
    PRIMARY KEY (`PolicyID`),
    KEY `fk_insurance_user` (`UserID`),
    KEY `fk_insurance_car` (`CarID`),
    CONSTRAINT `fk_insurance_user`
        FOREIGN KEY (`UserID`)
        REFERENCES `users` (`UserID`),
    CONSTRAINT `fk_insurance_car`
        FOREIGN KEY (`CarID`)
        REFERENCES `cars` (`CarID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ------------------------------------------------------
-- LOAN TABLE
-- ------------------------------------------------------
DROP TABLE IF EXISTS `loan`;
CREATE TABLE `loan` (
    `LoanID` INT NOT NULL AUTO_INCREMENT,
    `UserID` INT NOT NULL,
    `CarID` INT NOT NULL,
    `Bank` VARCHAR(100),
    `Amount` DECIMAL(10,2),
    `Status` ENUM('approved','rejected','pending') DEFAULT 'pending',
    PRIMARY KEY (`LoanID`),
    KEY `fk_loan_user` (`UserID`),
    KEY `fk_loan_car` (`CarID`),
    CONSTRAINT `fk_loan_user`
        FOREIGN KEY (`UserID`)
        REFERENCES `users` (`UserID`),
    CONSTRAINT `fk_loan_car`
        FOREIGN KEY (`CarID`)
        REFERENCES `cars` (`CarID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ------------------------------------------------------
-- DIGITAL WALLET TABLE
-- ------------------------------------------------------
DROP TABLE IF EXISTS `digitalwallet`;
CREATE TABLE `digitalwallet` (
    `WalletID` INT NOT NULL AUTO_INCREMENT,
    `UserID` INT NOT NULL UNIQUE,
    `Balance` DECIMAL(10,2) DEFAULT 0,
    PRIMARY KEY (`WalletID`),
    KEY `fk_wallet_user` (`UserID`),
    CONSTRAINT `fk_wallet_user`
        FOREIGN KEY (`UserID`)
        REFERENCES `users` (`UserID`)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ------------------------------------------------------
-- Restore MySQL Settings
-- ------------------------------------------------------
 /*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
 /*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
 /*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
 /*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
 /*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
 /*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
 /*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
 /*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump Completed Successfully
