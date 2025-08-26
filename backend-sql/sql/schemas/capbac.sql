-- =====================================================
-- SCHEMA: CAP BAC (MILITARY RANKS)
-- =====================================================

CREATE TABLE IF NOT EXISTS CapBac (
    btlhcm_cb_macb SERIAL PRIMARY KEY,
    btlhcm_cb_tencb VARCHAR(100) NOT NULL UNIQUE,
    btlhcm_cb_ngaytao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    btlhcm_cb_ngaycapnhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo index cho tên cấp bậc
CREATE INDEX idx_capbac_tencb ON CapBac(btlhcm_cb_tencb);

-- Comment cho bảng và các cột
COMMENT ON TABLE CapBac IS 'Bảng lưu trữ thông tin các cấp bậc quân đội';
COMMENT ON COLUMN CapBac.btlhcm_cb_macb IS 'Mã cấp bậc (Primary Key)';
COMMENT ON COLUMN CapBac.btlhcm_cb_tencb IS 'Tên cấp bậc';
COMMENT ON COLUMN CapBac.btlhcm_cb_ngaytao IS 'Ngày tạo bản ghi';
COMMENT ON COLUMN CapBac.btlhcm_cb_ngaycapnhat IS 'Ngày cập nhật bản ghi';
