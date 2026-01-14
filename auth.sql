-- 1. Core user identity (roll number + email se sab pehchaan)
CREATE TABLE existing_users (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    roll_no     VARCHAR(20) NOT NULL UNIQUE,
    full_name   VARCHAR(100) NOT NULL,
    email       VARCHAR(150) NOT NULL UNIQUE,
    batch_start INT DEFAULT 2023,
    batch_end   INT DEFAULT 2027,
    
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
                ON UPDATE CURRENT_TIMESTAMP
);


-- 2. Profile details (optional extra info)
CREATE TABLE user_profiles (
    existing_user_id  INT PRIMARY KEY,

    bio          TEXT,
    phone_number VARCHAR(20),
    gender       ENUM('M', 'F', 'O') DEFAULT NULL,
    department   VARCHAR(100),
    address      TEXT,
    dob          DATE,

    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
                 ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (existing_user_id) 
        REFERENCES existing_users(id)
        ON DELETE CASCADE
);


-- 3. Authentication (sirf local ya google — ek hi allowed per user)
CREATE TABLE auth (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    existing_user_id INT NOT NULL UNIQUE,   -- ek user → max ek auth record

    auth_provider    ENUM('local', 'google') NOT NULL,

    -- Local login ke liye
    password_hash    VARCHAR(255) DEFAULT NULL,

    -- Google login ke liye
    google_id        VARCHAR(255) DEFAULT NULL,

    email_verified   BOOLEAN DEFAULT FALSE,

    last_login       TIMESTAMP NULL,

    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
                     ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (existing_user_id) 
        REFERENCES existing_users(id)
        ON DELETE CASCADE,

    -- Ye ensure karta hai ki sirf ek tarika ho (ya to local ya google)
    CONSTRAINT chk_only_one_auth_method
        CHECK (
            (auth_provider = 'local' 
             AND password_hash IS NOT NULL 
             AND google_id IS NULL)
            OR
            (auth_provider = 'google' 
             AND google_id IS NOT NULL 
             AND password_hash IS NULL)
        )
);


-- 4. Sessions (devices / refresh tokens)
CREATE TABLE user_sessions (
    id              INT AUTO_INCREMENT PRIMARY KEY,

    existing_user_id INT NOT NULL,
    auth_id         INT NULL,          -- kis auth se login kiya tha

    device_id       VARCHAR(100) NOT NULL,
    refresh_token   VARCHAR(512) NOT NULL,

    device_type     ENUM('web', 'android', 'ios') DEFAULT NULL,
    device_name     VARCHAR(150) DEFAULT NULL,
    os              VARCHAR(100) DEFAULT NULL,
    browser         VARCHAR(100) DEFAULT NULL,
    ip_address      VARCHAR(45) DEFAULT NULL,

    expires_at      TIMESTAMP NOT NULL,
    is_valid        BOOLEAN DEFAULT TRUE,

    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_used       TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
                    ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (existing_user_id) 
        REFERENCES existing_users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (auth_id) 
        REFERENCES auth(id)
        ON DELETE SET NULL,

    UNIQUE KEY unique_device_per_user (existing_user_id, device_id)
);