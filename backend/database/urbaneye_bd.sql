-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 172.22.0.201    Database: Grupo32
-- ------------------------------------------------------
-- Server version	5.5.5-10.5.26-MariaDB-0+deb11u2

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

--
-- Table structure for table `categoria`
--

DROP TABLE IF EXISTS `categoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categoria` (
  `id_categoria` int(11) NOT NULL AUTO_INCREMENT,
  `nome_categoria` varchar(100) NOT NULL,
  `descricao_categoria` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_categoria`),
  UNIQUE KEY `nome_categoria` (`nome_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoria`
--

LOCK TABLES `categoria` WRITE;
/*!40000 ALTER TABLE `categoria` DISABLE KEYS */;
INSERT INTO `categoria` VALUES (6,'Infraestruturas','Problemas relacionados com vias públicas, passeios, buracos na estrada, sinalização danificada, mobiliário urbano ou estruturas degradadas.'),(7,'Trânsito','Ocorrências relacionadas com circulação rodoviária, semáforos avariados, acidentes, congestionamentos, estacionamento indevido ou sinalização rodoviária.'),(8,'Ambiente','Problemas ambientais, poluição, árvores caídas, zonas verdes degradadas, ruído excessivo ou resíduos em espaços naturais.'),(9,'Segurança','Situações relacionadas com insegurança urbana, vandalismo, zonas mal iluminadas, comportamentos de risco ou danos em espaços públicos.'),(10,'Saúde Pública','Ocorrências que possam afetar a saúde pública, como pragas, água contaminada, resíduos perigosos, más condições de higiene ou situações de emergência ligeira.'),(11,'Gestão de Resíduos','Problemas relacionados com lixo, contentores cheios, recolha em atraso, resíduos abandonados ou reciclagem.');
/*!40000 ALTER TABLE `categoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categoriaequipa`
--

DROP TABLE IF EXISTS `categoriaequipa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categoriaequipa` (
  `id_categoria` int(11) NOT NULL,
  `id_equipa` int(11) NOT NULL,
  PRIMARY KEY (`id_categoria`,`id_equipa`),
  UNIQUE KEY `categoriaequipa_id_equipa_id_categoria_unique` (`id_categoria`,`id_equipa`),
  KEY `id_equipa` (`id_equipa`),
  CONSTRAINT `categoriaequipa_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `categoria` (`id_categoria`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `categoriaequipa_ibfk_2` FOREIGN KEY (`id_equipa`) REFERENCES `equipa` (`id_equipa`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoriaequipa`
--

LOCK TABLES `categoriaequipa` WRITE;
/*!40000 ALTER TABLE `categoriaequipa` DISABLE KEYS */;
/*!40000 ALTER TABLE `categoriaequipa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `confirmacao`
--

DROP TABLE IF EXISTS `confirmacao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `confirmacao` (
  `id_confirmacao` int(11) NOT NULL AUTO_INCREMENT,
  `tipo_confirmacao` enum('confirmacao','rejeicao') NOT NULL,
  `data_confirmacao` datetime NOT NULL,
  `id_evento` int(11) NOT NULL,
  `id_utilizador` int(11) NOT NULL,
  PRIMARY KEY (`id_confirmacao`),
  UNIQUE KEY `confirmacao_id_evento_id_utilizador` (`id_evento`,`id_utilizador`),
  KEY `id_utilizador` (`id_utilizador`),
  CONSTRAINT `confirmacao_ibfk_1` FOREIGN KEY (`id_evento`) REFERENCES `evento` (`id_evento`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `confirmacao_ibfk_2` FOREIGN KEY (`id_utilizador`) REFERENCES `utilizador` (`id_utilizador`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `confirmacao`
--

LOCK TABLES `confirmacao` WRITE;
/*!40000 ALTER TABLE `confirmacao` DISABLE KEYS */;
INSERT INTO `confirmacao` VALUES (8,'confirmacao','2026-06-08 15:23:09',8,1),(10,'confirmacao','2026-06-08 15:31:00',12,1),(11,'confirmacao','2026-06-08 15:31:23',11,1),(12,'confirmacao','2026-06-08 15:31:35',9,1),(13,'confirmacao','2026-06-08 15:55:33',13,83),(14,'confirmacao','2026-06-08 15:55:50',13,85),(15,'rejeicao','2026-06-08 15:56:12',13,91),(16,'confirmacao','2026-06-08 15:57:17',13,92),(17,'confirmacao','2026-06-09 13:42:31',13,118),(18,'confirmacao','2026-06-12 18:54:22',14,118),(19,'confirmacao','2026-06-14 06:29:34',15,118),(20,'confirmacao','2026-06-14 21:42:04',16,1);
/*!40000 ALTER TABLE `confirmacao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `encaminhamento`
--

DROP TABLE IF EXISTS `encaminhamento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `encaminhamento` (
  `id_encaminhamento` int(11) NOT NULL AUTO_INCREMENT,
  `data_encaminhamento` datetime NOT NULL,
  `estado_encaminhamento` enum('pendente','em_analise','resolvido') NOT NULL DEFAULT 'pendente',
  `id_evento` int(11) NOT NULL,
  `id_equipa` int(11) NOT NULL,
  PRIMARY KEY (`id_encaminhamento`),
  KEY `id_evento` (`id_evento`),
  KEY `id_equipa` (`id_equipa`),
  CONSTRAINT `encaminhamento_ibfk_1` FOREIGN KEY (`id_evento`) REFERENCES `evento` (`id_evento`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `encaminhamento_ibfk_2` FOREIGN KEY (`id_equipa`) REFERENCES `equipa` (`id_equipa`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `encaminhamento`
--

LOCK TABLES `encaminhamento` WRITE;
/*!40000 ALTER TABLE `encaminhamento` DISABLE KEYS */;
INSERT INTO `encaminhamento` VALUES (4,'2026-06-08 15:23:17','resolvido',8,11),(6,'2026-06-08 15:31:17','em_analise',12,17),(7,'2026-06-08 15:31:29','pendente',11,13),(8,'2026-06-08 15:31:49','em_analise',9,5),(9,'2026-06-14 21:42:44','em_analise',16,11);
/*!40000 ALTER TABLE `encaminhamento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `entidaderesponsavel`
--

DROP TABLE IF EXISTS `entidaderesponsavel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `entidaderesponsavel` (
  `id_entidade` int(11) NOT NULL AUTO_INCREMENT,
  `nome_entidade` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id_entidade`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entidaderesponsavel`
--

LOCK TABLES `entidaderesponsavel` WRITE;
/*!40000 ALTER TABLE `entidaderesponsavel` DISABLE KEYS */;
INSERT INTO `entidaderesponsavel` VALUES (1,'Câmara Municipal','geral@cm.pt','220000000'),(2,'Polícia Municipal','policia.municipal@cm.pt','220000001'),(3,'Empresa Municipal de Ambiente','ambiente@cm.pt','220000002'),(4,'Serviços Municipalizados de Água e Saneamento','aguasaneamento@cm.pt','220000003'),(5,'Autoridade de Saúde Pública','saude.publica@ars.pt','220000004');
/*!40000 ALTER TABLE `entidaderesponsavel` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equipa`
--

DROP TABLE IF EXISTS `equipa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `equipa` (
  `id_equipa` int(11) NOT NULL AUTO_INCREMENT,
  `nome_equipa` varchar(100) NOT NULL,
  `id_entidade` int(11) NOT NULL,
  PRIMARY KEY (`id_equipa`),
  KEY `id_entidade` (`id_entidade`),
  CONSTRAINT `equipa_ibfk_1` FOREIGN KEY (`id_entidade`) REFERENCES `entidaderesponsavel` (`id_entidade`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipa`
--

LOCK TABLES `equipa` WRITE;
/*!40000 ALTER TABLE `equipa` DISABLE KEYS */;
INSERT INTO `equipa` VALUES (5,'Equipa de Infraestruturas',1),(11,'Equipa de Trânsito e Mobilidade',1),(12,'Equipa de Ambiente',3),(13,'Equipa de Gestão de Resíduos',3),(14,'Equipa de Saúde Pública',5),(15,'Equipa de Iluminação Pública',1),(16,'Equipa de Água e Saneamento',4),(17,'Equipa de Segurança Urbana',2),(18,'Equipa de Trânsito e Mobilidade',2);
/*!40000 ALTER TABLE `equipa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `evento`
--

DROP TABLE IF EXISTS `evento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `evento` (
  `id_evento` int(11) NOT NULL AUTO_INCREMENT,
  `data_registo` datetime NOT NULL,
  `descricao` text NOT NULL,
  `estado` enum('ativo','resolvido','falso','pendente','encaminhado') NOT NULL DEFAULT 'pendente',
  `latitude` decimal(10,8) NOT NULL,
  `longitude` decimal(11,8) NOT NULL,
  `descricao_local` varchar(255) DEFAULT NULL,
  `id_utilizador` int(11) NOT NULL,
  `id_categoria` int(11) NOT NULL,
  PRIMARY KEY (`id_evento`),
  KEY `id_utilizador` (`id_utilizador`),
  KEY `id_categoria` (`id_categoria`),
  CONSTRAINT `evento_ibfk_1` FOREIGN KEY (`id_utilizador`) REFERENCES `utilizador` (`id_utilizador`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `evento_ibfk_2` FOREIGN KEY (`id_categoria`) REFERENCES `categoria` (`id_categoria`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evento`
--

LOCK TABLES `evento` WRITE;
/*!40000 ALTER TABLE `evento` DISABLE KEYS */;
INSERT INTO `evento` VALUES (8,'2026-06-08 15:23:01','Sinal de passadeira caído — O sinal de passadeira caiu com o vento.','resolvido',41.36623181,-8.73970324,'Junto à passadeira, no sentido de quem vai para os bombeiros',1,7),(9,'2026-06-08 15:24:34','Buraco no Passeio — Buraco enorme no Passeio, cria uma poça de agua que impede o uso do passeio','encaminhado',41.36451204,-8.74098538,'no passeio',1,6),(11,'2026-06-08 15:28:22','Lixo na praia — a praia esta cheia de lixo','encaminhado',41.35282555,-8.75444876,'na areia ',1,11),(12,'2026-06-08 15:30:55','Os patos atacam os visitantes do parque — Os patos atacam sem pena e piedade aqueles que passam pelo parque! Quack-tatrófico!','encaminhado',41.36227398,-8.75081830,'POR TODO O PARQUE',1,9),(13,'2026-06-08 15:54:49','Poste de iluminação avariado — Um poste de iluminação nao funciona','pendente',41.35928644,-8.74726177,'junto à bomba',78,6),(14,'2026-06-12 18:14:19','Evento de Teste Selenium — Descrição automática gerada pelo teste Selenium.','pendente',41.35334141,-8.74518317,'Vila do Conde',118,6),(15,'2026-06-12 22:08:08','Lixo nas ruas — Ruas cheias de sacos do lixo no chão','pendente',41.35561417,-8.74260806,'chão da rua',118,11),(16,'2026-06-14 21:41:43','Sinal de Stop caido — O Sinal de Stop caiu há 2 semanas e ainda não arranjaram!','encaminhado',41.36027709,-8.74364778,'No entroncamento',1,7);
/*!40000 ALTER TABLE `evento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `utilizador`
--

DROP TABLE IF EXISTS `utilizador`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `utilizador` (
  `id_utilizador` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(30) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `tipo_utilizador` enum('cidadao','moderador','gestor_municipal','tecnico') NOT NULL,
  `fotografia` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_utilizador`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=122 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `utilizador`
--

LOCK TABLES `utilizador` WRITE;
/*!40000 ALTER TABLE `utilizador` DISABLE KEYS */;
INSERT INTO `utilizador` VALUES (1,'Vitor Costa','vitor.costa@cmvdc.com','$2b$10$3syVFPPpKgKdgiEc/jsMSeEBvWMwLcgpFh2RIrwWIaLSXp1gVsjgy','gestor_municipal',NULL),(2,'Gonçalo Chaves','goncalo@gmail.com','$2b$10$HMgD/xORzFYBRM6NuYvGpeMXIWQbPi7NA1l/Qijm/hKBP6Kep/Dw6','cidadao',NULL),(3,'Beatriz Silveira','beatriz@gmail.com','$2b$10$HMgD/xORzFYBRM6NuYvGpeMXIWQbPi7NA1l/Qijm/hKBP6Kep/Dw6','cidadao',NULL),(78,'João Silva','joao.silva@urbaneye.pt','$2b$10$HMgD/xORzFYBRM6NuYvGpeMXIWQbPi7NA1l/Qijm/hKBP6Kep/Dw6','tecnico',NULL),(79,'Maria Costa','maria.costa@urbaneye.pt','$2b$10$HMgD/xORzFYBRM6NuYvGpeMXIWQbPi7NA1l/Qijm/hKBP6Kep/Dw6','cidadao',NULL),(80,'Pedro Almeida','pedro.almeida@urbaneye.pt','$2b$10$HMgD/xORzFYBRM6NuYvGpeMXIWQbPi7NA1l/Qijm/hKBP6Kep/Dw6','cidadao',NULL),(81,'Inês Ferreira','ines.ferreira@urbaneye.pt','$2b$10$HMgD/xORzFYBRM6NuYvGpeMXIWQbPi7NA1l/Qijm/hKBP6Kep/Dw6','cidadao',NULL),(82,'Tiago Martins','tiago.martins@urbaneye.pt','$2b$10$HMgD/xORzFYBRM6NuYvGpeMXIWQbPi7NA1l/Qijm/hKBP6Kep/Dw6','cidadao',NULL),(83,'Leonor Santos','leonor.santos@urbaneye.pt','$2b$10$HMgD/xORzFYBRM6NuYvGpeMXIWQbPi7NA1l/Qijm/hKBP6Kep/Dw6','cidadao',NULL),(84,'Bruno Pereira','bruno.pereira@urbaneye.pt','$2b$10$HMgD/xORzFYBRM6NuYvGpeMXIWQbPi7NA1l/Qijm/hKBP6Kep/Dw6','cidadao',NULL),(85,'Matilde Ribeiro','matilde.ribeiro@urbaneye.pt','$2b$10$HMgD/xORzFYBRM6NuYvGpeMXIWQbPi7NA1l/Qijm/hKBP6Kep/Dw6','cidadao',NULL),(86,'Guilherme Carvalho','guilherme.carvalho@urbaneye.pt','$2b$10$HMgD/xORzFYBRM6NuYvGpeMXIWQbPi7NA1l/Qijm/hKBP6Kep/Dw6','cidadao',NULL),(87,'Catarina Gomes','catarina.gomes@urbaneye.pt','$2b$10$HMgD/xORzFYBRM6NuYvGpeMXIWQbPi7NA1l/Qijm/hKBP6Kep/Dw6','cidadao',NULL),(88,'Ana Rodrigues','ana.rodrigues@urbaneye.pt','$2b$10$HMgD/xORzFYBRM6NuYvGpeMXIWQbPi7NA1l/Qijm/hKBP6Kep/Dw6','cidadao',NULL),(89,'Rui Moreira','rui.moreira@urbaneye.pt','$2b$10$HMgD/xORzFYBRM6NuYvGpeMXIWQbPi7NA1l/Qijm/hKBP6Kep/Dw6','cidadao',NULL),(90,'Marta Teixeira','marta.teixeira@urbaneye.pt','$2b$10$HMgD/xORzFYBRM6NuYvGpeMXIWQbPi7NA1l/Qijm/hKBP6Kep/Dw6','cidadao',NULL),(91,'Carla Mendes','carla.mendes@urbaneye.pt','$2b$10$HMgD/xORzFYBRM6NuYvGpeMXIWQbPi7NA1l/Qijm/hKBP6Kep/Dw6','cidadao',NULL),(92,'Miguel Rocha','miguel.rocha@urbaneye.pt','$2b$10$HMgD/xORzFYBRM6NuYvGpeMXIWQbPi7NA1l/Qijm/hKBP6Kep/Dw6','cidadao',NULL),(93,'Sofia Pinto','sofia.pinto@urbaneye.pt','$2b$10$HMgD/xORzFYBRM6NuYvGpeMXIWQbPi7NA1l/Qijm/hKBP6Kep/Dw6','cidadao',NULL),(94,'André Sousa','andre.sousa@urbaneye.pt','$2b$10$HMgD/xORzFYBRM6NuYvGpeMXIWQbPi7NA1l/Qijm/hKBP6Kep/Dw6','cidadao',NULL),(95,'Beatriz Lopes','beatriz.lopes@urbaneye.pt','$2b$10$HMgD/xORzFYBRM6NuYvGpeMXIWQbPi7NA1l/Qijm/hKBP6Kep/Dw6','cidadao',NULL),(96,'Diogo Fernandes','diogo.fernandes@urbaneye.pt','$2b$10$HMgD/xORzFYBRM6NuYvGpeMXIWQbPi7NA1l/Qijm/hKBP6Kep/Dw6','cidadao',NULL),(97,'Ricardo Neves','ricardo.neves@urbaneye.pt','$2b$10$HMgD/xORzFYBRM6NuYvGpeMXIWQbPi7NA1l/Qijm/hKBP6Kep/Dw6','cidadao',NULL),(118,'Samuel Fernandes','samuel.pinho.fernandes@gmail.com','$2b$10$B/J7ETZqyuhrqUCbp03jF.ow9Xd4hmeJUW0R1Wg0dVGI4zRfHXbfK','cidadao',NULL),(119,'Henrique Soares','henriquesoares.moderator@urbaneye.com','$2b$10$7QnX0qz0xQp8n7u1ZrQ8E.8YH7Q0kF6uJ7Q0nQ0xQp8n7u1ZrQ8E.','moderador',NULL),(121,'Gonçalo','goncalo663@gmail.com','$2b$10$fDPLXiyChirz7tR9T/VQ1ukJUdRZbHFC46QBpgX9nVTAIq4Dj.Ike','cidadao',NULL);
/*!40000 ALTER TABLE `utilizador` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'Grupo32'
--

--
-- Dumping routines for database 'Grupo32'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-14 23:31:09
