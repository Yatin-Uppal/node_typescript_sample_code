CREATE TABLE `chatRooms` (
  `crId` int NOT NULL AUTO_INCREMENT,
  `chatRoomName` varchar(250) NOT NULL,
  `chatRoomDescription` text,
  `chatRoomStatus` tinyint NOT NULL,
  `chatRoomType` tinyint NOT NULL,
  `chatRoomPic` varchar(250) DEFAULT NULL,
  `latestMessage` text,
  `createdDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `createdBy` bigint NOT NULL,
  `updatedBy` bigint NOT NULL,
  `lastUsedDate` datetime DEFAULT NULL,
  PRIMARY KEY (`crId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `chatRoomUsers` (
  `cruId` int NOT NULL AUTO_INCREMENT,
  `chatRoomId` int NOT NULL,
  `userId` bigint NOT NULL,
  `chatRoomUserStatus` tinyint NOT NULL,
  `createdDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `unreadCount` int DEFAULT NULL,
  PRIMARY KEY (`cruId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;