-- =====================================================
-- SCHEMA: CHUC VU (POSITIONS)
-- =====================================================

CREATE TABLE IF NOT EXISTS ChucVu (
    btlhcm_cv_macv SERIAL PRIMARY KEY,
    btlhcm_cv_tencv VARCHAR(100) NOT NULL UNIQUE,
    btlhcm_cv_ngaytao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    btlhcm_cv_ngaycapnhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo index cho tên chức vụ
CREATE INDEX idx_chucvu_tencv ON ChucVu(btlhcm_cv_tencv);

-- Comment cho bảng và các cột
COMMENT ON TABLE ChucVu IS 'Bảng lưu trữ thông tin các chức vụ';
COMMENT ON COLUMN ChucVu.btlhcm_cv_macv IS 'Mã chức vụ (Primary Key)';
COMMENT ON COLUMN ChucVu.btlhcm_cv_tencv IS 'Tên chức vụ';
COMMENT ON COLUMN ChucVu.btlhcm_cv_ngaytao IS 'Ngày tạo bản ghi';
COMMENT ON COLUMN ChucVu.btlhcm_cv_ngaycapnhat IS 'Ngày cập nhật bản ghi';
