-- =====================================================
-- SCHEMA: TINH THANH (PROVINCES/CITIES)
-- =====================================================

CREATE TABLE IF NOT EXISTS TinhThanh (
    btlhcm_tt_matt SERIAL PRIMARY KEY,
    btlhcm_tt_quankhu INT NOT NULL REFERENCES QuanKhu(btlhcm_qk_maqk) ON DELETE RESTRICT,
    btlhcm_tt_tentt VARCHAR(100) NOT NULL,
    btlhcm_tt_mota TEXT,
    btlhcm_tt_ngaytao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    btlhcm_tt_ngaycapnhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(btlhcm_tt_quankhu, btlhcm_tt_tentt)
);

-- Tạo index cho các cột thường được tìm kiếm
CREATE INDEX idx_tinhthanh_quankhu ON TinhThanh(btlhcm_tt_quankhu);
CREATE INDEX idx_tinhthanh_tentt ON TinhThanh(btlhcm_tt_tentt);

-- Comment cho bảng và các cột
COMMENT ON TABLE TinhThanh IS 'Bảng lưu trữ thông tin các tỉnh thành';
COMMENT ON COLUMN TinhThanh.btlhcm_tt_matt IS 'Mã tỉnh thành (Primary Key)';
COMMENT ON COLUMN TinhThanh.btlhcm_tt_quankhu IS 'Mã quân khu (Foreign Key)';
COMMENT ON COLUMN TinhThanh.btlhcm_tt_tentt IS 'Tên tỉnh thành';
COMMENT ON COLUMN TinhThanh.btlhcm_tt_mota IS 'Mô tả tỉnh thành';
COMMENT ON COLUMN TinhThanh.btlhcm_tt_ngaytao IS 'Ngày tạo bản ghi';
COMMENT ON COLUMN TinhThanh.btlhcm_tt_ngaycapnhat IS 'Ngày cập nhật bản ghi';
