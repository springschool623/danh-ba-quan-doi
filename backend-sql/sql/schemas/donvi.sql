-- =====================================================
-- SCHEMA: DON VI (UNITS)
-- =====================================================

CREATE TABLE IF NOT EXISTS DonVi (
    btlhcm_dv_madv SERIAL PRIMARY KEY,
    btlhcm_dv_tendv VARCHAR(100) NOT NULL UNIQUE,
    btlhcm_dv_diachi TEXT,
    btlhcm_dv_phuong INT NOT NULL REFERENCES PhuongXa(btlhcm_px_mapx) ON DELETE RESTRICT,
    btlhcm_dv_tinhthanh INT NOT NULL REFERENCES TinhThanh(btlhcm_tt_matt) ON DELETE RESTRICT,
    btlhcm_dv_quankhu INT NOT NULL REFERENCES QuanKhu(btlhcm_qk_maqk) ON DELETE RESTRICT,
    btlhcm_dv_ngaytao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    btlhcm_dv_ngaycapnhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo index cho các cột thường được tìm kiếm
CREATE INDEX idx_donvi_tendv ON DonVi(btlhcm_dv_tendv);
CREATE INDEX idx_donvi_phuong ON DonVi(btlhcm_dv_phuong);
CREATE INDEX idx_donvi_tinhthanh ON DonVi(btlhcm_dv_tinhthanh);
CREATE INDEX idx_donvi_quankhu ON DonVi(btlhcm_dv_quankhu);

-- Comment cho bảng và các cột
COMMENT ON TABLE DonVi IS 'Bảng lưu trữ thông tin các đơn vị';
COMMENT ON COLUMN DonVi.btlhcm_dv_madv IS 'Mã đơn vị (Primary Key)';
COMMENT ON COLUMN DonVi.btlhcm_dv_tendv IS 'Tên đơn vị';
COMMENT ON COLUMN DonVi.btlhcm_dv_diachi IS 'Địa chỉ đơn vị';
COMMENT ON COLUMN DonVi.btlhcm_dv_phuong IS 'Mã phường xã (Foreign Key)';
COMMENT ON COLUMN DonVi.btlhcm_dv_tinhthanh IS 'Mã tỉnh thành (Foreign Key)';
COMMENT ON COLUMN DonVi.btlhcm_dv_quankhu IS 'Mã quân khu (Foreign Key)';
COMMENT ON COLUMN DonVi.btlhcm_dv_ngaytao IS 'Ngày tạo bản ghi';
COMMENT ON COLUMN DonVi.btlhcm_dv_ngaycapnhat IS 'Ngày cập nhật bản ghi';
