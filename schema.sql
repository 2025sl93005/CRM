-- MySQL Schema for ResolveAI CRM System
-- Create database and tables

CREATE DATABASE IF NOT EXISTS resolveai_crm;
USE resolveai_crm;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role ENUM('CUSTOMER', 'CSR', 'MANAGER') NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Issues Table
CREATE TABLE IF NOT EXISTS issues (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    issue_title VARCHAR(255) NOT NULL,
    issue_description LONGTEXT NOT NULL,
    issue_type ENUM('COMPLAINT', 'SUGGESTION', 'GOODWILL_SHARING') NOT NULL,
    status ENUM('OPEN', 'IN_PROGRESS', 'ACCEPTED', 'RESOLVED', 'REJECTED', 'CLOSED', 'ESCALATED') DEFAULT 'OPEN',
    priority ENUM('LOW', 'MEDIUM', 'HIGH') DEFAULT 'MEDIUM',
    customer_id BIGINT NOT NULL,
    assigned_csr_id BIGINT,
    escalation_reason LONGTEXT,
    in_queue BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_csr_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_customer_id (customer_id),
    INDEX idx_assigned_csr_id (assigned_csr_id),
    INDEX idx_status (status),
    INDEX idx_in_queue (in_queue),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Feedbacks Table
CREATE TABLE IF NOT EXISTS feedbacks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    issue_id BIGINT UNIQUE NOT NULL,
    customer_id BIGINT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment LONGTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (issue_id) REFERENCES issues(id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_issue_id (issue_id),
    INDEX idx_customer_id (customer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Escalations Table
CREATE TABLE IF NOT EXISTS escalations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    issue_id BIGINT NOT NULL,
    escalated_by_id BIGINT NOT NULL,
    escalation_reason LONGTEXT NOT NULL,
    escalated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (issue_id) REFERENCES issues(id) ON DELETE CASCADE,
    FOREIGN KEY (escalated_by_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_issue_id (issue_id),
    INDEX idx_escalated_by_id (escalated_by_id),
    INDEX idx_escalated_at (escalated_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Email Logs Table
CREATE TABLE IF NOT EXISTS email_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    recipient VARCHAR(100) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body LONGTEXT,
    event_type VARCHAR(50) NOT NULL,
    issue_id BIGINT,
    success BOOLEAN DEFAULT TRUE,
    error_message LONGTEXT,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (issue_id) REFERENCES issues(id) ON DELETE SET NULL,
    INDEX idx_recipient (recipient),
    INDEX idx_event_type (event_type),
    INDEX idx_sent_at (sent_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create sample data (optional)
INSERT INTO users (email, password, first_name, last_name, role) VALUES
('customer@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoHyeiCLMi2pCVfVFdIIRWN0MRfEu6rW8WgO', 'John', 'Customer', 'CUSTOMER'),
('csr@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoHyeiCLMi2pCVfVFdIIRWN0MRfEu6rW8WgO', 'Jane', 'CSR', 'CSR'),
('manager@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoHyeiCLMi2pCVfVFdIIRWN0MRfEu6rW8WgO', 'Bob', 'Manager', 'MANAGER');
