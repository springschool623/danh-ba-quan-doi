-- =====================================================
-- SCHEMA: PHUONG XA (WARDS/COMMUNES)
-- =====================================================

CREATE TABLE IF NOT EXISTS PhuongXa (
    btlhcm_px_mapx SERIAL PRIMARY KEY,
    btlhcm_px_tinhthanh INT NOT NULL REFERENCES TinhThanh(btlhcm_tt_matt) ON DELETE RESTRICT,
    btlhcm_px_tenpx VARCHAR(100) NOT NULL,
    btlhcm_px_mota TEXT,
    btlhcm_px_ngaytao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    btlhcm_px_ngaycapnhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(btlhcm_px_tinhthanh, btlhcm_px_tenpx)
);

-- Tạo index cho các cột thường được tìm kiếm
CREATE INDEX idx_phuongxa_tinhthanh ON PhuongXa(btlhcm_px_tinhthanh);
CREATE INDEX idx_phuongxa_tenpx ON PhuongXa(btlhcm_px_tenpx);

-- Comment cho bảng và các cột
COMMENT ON TABLE PhuongXa IS 'Bảng lưu trữ thông tin các phường xã';
COMMENT ON COLUMN PhuongXa.btlhcm_px_mapx IS 'Mã phường xã (Primary Key)';
COMMENT ON COLUMN PhuongXa.btlhcm_px_tinhthanh IS 'Mã tỉnh thành (Foreign Key)';
COMMENT ON COLUMN PhuongXa.btlhcm_px_tenpx IS 'Tên phường xã';
COMMENT ON COLUMN PhuongXa.btlhcm_px_mota IS 'Mô tả phường xã';
COMMENT ON COLUMN PhuongXa.btlhcm_px_ngaytao IS 'Ngày tạo bản ghi';
COMMENT ON COLUMN PhuongXa.btlhcm_px_ngaycapnhat IS 'Ngày cập nhật bản ghi';
