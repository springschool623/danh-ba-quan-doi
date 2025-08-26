-- =====================================================
-- SCHEMA: PHONG BAN (DEPARTMENTS & DIVISIONS)
-- =====================================================

-- Bảng Phòng
CREATE TABLE IF NOT EXISTS Phong (
    btlhcm_pb_mapb SERIAL PRIMARY KEY,
    btlhcm_pb_tenpb VARCHAR(100) NOT NULL UNIQUE,
    btlhcm_pb_ngaytao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    btlhcm_pb_ngaycapnhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Ban
CREATE TABLE IF NOT EXISTS Ban (
    btlhcm_ba_mab SERIAL PRIMARY KEY,
    btlhcm_ba_tenb VARCHAR(100) NOT NULL UNIQUE,
    btlhcm_ba_maphong INT NOT NULL REFERENCES Phong(btlhcm_pb_mapb) ON DELETE RESTRICT,
    btlhcm_ba_ngaytao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    btlhcm_ba_ngaycapnhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo index cho các cột thường được tìm kiếm
CREATE INDEX idx_phong_tenpb ON Phong(btlhcm_pb_tenpb);
CREATE INDEX idx_ban_tenb ON Ban(btlhcm_ba_tenb);
CREATE INDEX idx_ban_maphong ON Ban(btlhcm_ba_maphong);

-- Comment cho bảng và các cột
COMMENT ON TABLE Phong IS 'Bảng lưu trữ thông tin các phòng';
COMMENT ON COLUMN Phong.btlhcm_pb_mapb IS 'Mã phòng (Primary Key)';
COMMENT ON COLUMN Phong.btlhcm_pb_tenpb IS 'Tên phòng';
COMMENT ON COLUMN Phong.btlhcm_pb_ngaytao IS 'Ngày tạo bản ghi';
COMMENT ON COLUMN Phong.btlhcm_pb_ngaycapnhat IS 'Ngày cập nhật bản ghi';

COMMENT ON TABLE Ban IS 'Bảng lưu trữ thông tin các ban';
COMMENT ON COLUMN Ban.btlhcm_ba_mab IS 'Mã ban (Primary Key)';
COMMENT ON COLUMN Ban.btlhcm_ba_tenb IS 'Tên ban';
COMMENT ON COLUMN Ban.btlhcm_ba_maphong IS 'Mã phòng (Foreign Key)';
COMMENT ON COLUMN Ban.btlhcm_ba_ngaytao IS 'Ngày tạo bản ghi';
COMMENT ON COLUMN Ban.btlhcm_ba_ngaycapnhat IS 'Ngày cập nhật bản ghi';
