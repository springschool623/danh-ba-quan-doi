-- =====================================================
-- SCHEMA: QUAN KHU (MILITARY REGIONS)
-- =====================================================

CREATE TABLE IF NOT EXISTS QuanKhu (
    btlhcm_qk_maqk SERIAL PRIMARY KEY,
    btlhcm_qk_tenqk VARCHAR(100) NOT NULL UNIQUE,
    btlhcm_qk_mota TEXT,
    btlhcm_qk_ngaytao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    btlhcm_qk_ngaycapnhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo index cho tên quân khu
CREATE INDEX idx_quankhu_tenqk ON QuanKhu(btlhcm_qk_tenqk);

-- Comment cho bảng và các cột
COMMENT ON TABLE QuanKhu IS 'Bảng lưu trữ thông tin các quân khu';
COMMENT ON COLUMN QuanKhu.btlhcm_qk_maqk IS 'Mã quân khu (Primary Key)';
COMMENT ON COLUMN QuanKhu.btlhcm_qk_tenqk IS 'Tên quân khu';
COMMENT ON COLUMN QuanKhu.btlhcm_qk_mota IS 'Mô tả quân khu';
COMMENT ON COLUMN QuanKhu.btlhcm_qk_ngaytao IS 'Ngày tạo bản ghi';
COMMENT ON COLUMN QuanKhu.btlhcm_qk_ngaycapnhat IS 'Ngày cập nhật bản ghi';
