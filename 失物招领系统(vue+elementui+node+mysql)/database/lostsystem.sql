/*
 Navicat MySQL Data Transfer

 Source Server         : localhost_3306
 Source Server Type    : MySQL
 Source Server Version : 80025
 Source Host           : localhost:3306
 Source Schema         : lostsystem

 Target Server Type    : MySQL
 Target Server Version : 80025
 File Encoding         : 65001

 Date: 14/3/2023 21:20:48
*/

SET NAMES utf8mb4;
-- 设置MySQL客户端字符集为utf8mb4。
SET FOREIGN_KEY_CHECKS = 0;
-- 设置MySQL服务器在执行数据操作语句（DML语句）时是否检查外键约束。FOREIGN_KEY_CHECKS默认值是1，表示MySQL服务器在执行DML语句时会检查外键约束，
-- 如果违反了外键约束，会报错并回滚操作。将其设置为0，则表示不检查外键约束，可以在执行DML语句时忽略外键约束的限制。
--在设置为0时，需要手动保证数据的完整性，否则可能会导致数据不一致。

-- ----------------------------
-- Table structure for foundthings
-- ----------------------------
DROP TABLE IF EXISTS `foundthings`; 
-- 用于删除已存在的名为foundthings的表.IF EXISTS是可选的，表示如果表不存在也不会报错。table_name则是要删除的表名。
CREATE TABLE `foundthings`  (
  -- AUTO_INCREMENT是MySQL中的一个属性，用于指定一个整数列为自增列，每次插入一条新记录时，该列的值会自动加1。 
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `foundTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `imgUrl` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `contact` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '未归还',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `username`(`username`) USING BTREE,
  CONSTRAINT `foundthings_ibfk_1` FOREIGN KEY (`username`) REFERENCES `users` (`username`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 22 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of foundthings
-- ----------------------------
INSERT INTO `foundthings` VALUES (22, '张洋铭', '熊猫一只', '未知', '2021/02/22', 'http://lostsystem-wut.oss-cn-hangzhou.aliyuncs.com/lostThings/%E7%86%8A%E7%8C%AB.jpg', '测试内容', '微信:m888888  QQ:6666666', '未找回');
INSERT INTO `foundthings` VALUES (23, 'sunshine', '2132', '323', '12312', '23', '22333', '213', '已归还');
INSERT INTO `foundthings` VALUES (24, 'sunshine', '323', '323', '2021-10-05', 'http://lostsystem-wut.oss-cn-hangzhou.aliyuncs.com/foundThings/', '23', '23', '未归还');

-- ----------------------------
-- Table structure for livemsg
-- ----------------------------
DROP TABLE IF EXISTS `livemsg`;
CREATE TABLE `livemsg`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `msg` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `livetime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `username`(`username`) USING BTREE,
  CONSTRAINT `livemsg_ibfk_1` FOREIGN KEY (`username`) REFERENCES `users` (`username`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 18 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of livemsg
-- ----------------------------
INSERT INTO `livemsg` VALUES (17, '张洋铭', '如果提前了解你们所要面对的人生，不知你们是否还会有勇气前来。', '2023/3/15 10:38:2');

-- ----------------------------
-- Table structure for lostthings
-- ----------------------------
DROP TABLE IF EXISTS `lostthings`;
CREATE TABLE `lostthings`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `lostTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `imgUrl` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `contact` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '未找回',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `username`(`username`) USING BTREE,
  CONSTRAINT `lostthings_ibfk_1` FOREIGN KEY (`username`) REFERENCES `users` (`username`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 144 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of lostthings
-- ----------------------------
INSERT INTO `lostthings` VALUES (143, '张洋铭', '熊猫一只', '未知', '2021/02/22', 'http://lostsystem-wut.oss-cn-hangzhou.aliyuncs.com/lostThings/%E7%86%8A%E7%8C%AB.jpg', '测试内容', '微信:m888888  QQ:6666666', '已找回');
INSERT INTO `lostthings` VALUES (145, 'sunshine', '2323', '323', '233', '3232', '3232', '233', '已找回');

-- ----------------------------
-- Table structure for tips
-- ----------------------------
DROP TABLE IF EXISTS `tips`;
CREATE TABLE `tips`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `tips_msg` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 31 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of tips
-- ----------------------------
INSERT INTO `tips` VALUES (1, '志当存高远。');
INSERT INTO `tips` VALUES (2, '寒冷到了极致时，太阳就要光临。');
INSERT INTO `tips` VALUES (3, '人的一生，没有一味的苦，没有永远的痛；没有迈不过的坎，没有闯不过的关。');
INSERT INTO `tips` VALUES (4, '因为年轻我们一无所有，也正因为年轻我们将拥有一切。');
INSERT INTO `tips` VALUES (5, '别想一下造出大海，必须先由小河川开始。');
INSERT INTO `tips` VALUES (6, '有志者自有千计万计，无志者只感千难万难。');
INSERT INTO `tips` VALUES (7, '勇于开始，才能找到成功。');
INSERT INTO `tips` VALUES (8, '如果耐不住寂寞，你就看不到繁华。');
INSERT INTO `tips` VALUES (9, '盛年不重来，一日难再晨。及时宜自勉，岁月不待人。');
INSERT INTO `tips` VALUES (10, '业精于勤，荒于嬉；行成于思，毁于随。');
INSERT INTO `tips` VALUES (11, '莫等闲，白了少年头，空悲切。');
INSERT INTO `tips` VALUES (12, '人谁无过？过而能改，善莫大焉。');
INSERT INTO `tips` VALUES (13, '天行健，君子以自强不息。地势坤，君子以厚德载物。');
INSERT INTO `tips` VALUES (31, '志当存高远。');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`username`) USING BTREE,
  INDEX `username`(`username`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES ('admin', 'admin');
INSERT INTO `users` VALUES ('sunshine', 'a123456');
INSERT INTO `users` VALUES ('张洋铭', 'a123456');

SET FOREIGN_KEY_CHECKS = 1;
