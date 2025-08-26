-- =====================================================
-- SCHEMA: DANH BA LIEN HE (CONTACT DIRECTORY)
-- =====================================================

CREATE TABLE IF NOT EXISTS DanhBaLienHe (
    btlhcm_lh_malh SERIAL PRIMARY KEY,
    btlhcm_lh_hoten VARCHAR(150) NOT NULL,
    btlhcm_lh_capbac INT NULL REFERENCES CapBac(btlhcm_cb_macb) ON DELETE RESTRICT,
    btlhcm_lh_chucvu INT NULL REFERENCES ChucVu(btlhcm_cv_macv) ON DELETE RESTRICT,
    btlhcm_lh_phong INT NULL REFERENCES Phong(btlhcm_pb_mapb) ON DELETE RESTRICT,
    btlhcm_lh_ban INT NULL REFERENCES Ban(btlhcm_ba_mab) ON DELETE RESTRICT,
    btlhcm_lh_donvi INT NULL REFERENCES DonVi(btlhcm_dv_madv) ON DELETE RESTRICT,
    btlhcm_lh_sdt_ds VARCHAR(20) NULL,
    btlhcm_lh_sdt_qs VARCHAR(20) NULL,
    btlhcm_lh_sdt_dd VARCHAR(20) NULL UNIQUE,
    btlhcm_lh_ngaytao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    btlhcm_lh_ngaycapnhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo index cho các cột thường được tìm kiếm
CREATE INDEX idx_danhba_hoten ON DanhBaLienHe(btlhcm_lh_hoten);
CREATE INDEX idx_danhba_capbac ON DanhBaLienHe(btlhcm_lh_capbac);
CREATE INDEX idx_danhba_chucvu ON DanhBaLienHe(btlhcm_lh_chucvu);
CREATE INDEX idx_danhba_phong ON DanhBaLienHe(btlhcm_lh_phong);
CREATE INDEX idx_danhba_ban ON DanhBaLienHe(btlhcm_lh_ban);
CREATE INDEX idx_danhba_donvi ON DanhBaLienHe(btlhcm_lh_donvi);
CREATE INDEX idx_danhba_sdt_dd ON DanhBaLienHe(btlhcm_lh_sdt_dd);

-- Comment cho bảng và các cột
COMMENT ON TABLE DanhBaLienHe IS 'Bảng lưu trữ thông tin danh bạ liên hệ';
COMMENT ON COLUMN DanhBaLienHe.btlhcm_lh_malh IS 'Mã liên hệ (Primary Key)';
COMMENT ON COLUMN DanhBaLienHe.btlhcm_lh_hoten IS 'Họ tên liên hệ';
COMMENT ON COLUMN DanhBaLienHe.btlhcm_lh_capbac IS 'Mã cấp bậc (Foreign Key)';
COMMENT ON COLUMN DanhBaLienHe.btlhcm_lh_chucvu IS 'Mã chức vụ (Foreign Key)';
COMMENT ON COLUMN DanhBaLienHe.btlhcm_lh_phong IS 'Mã phòng (Foreign Key)';
COMMENT ON COLUMN DanhBaLienHe.btlhcm_lh_ban IS 'Mã ban (Foreign Key)';
COMMENT ON COLUMN DanhBaLienHe.btlhcm_lh_donvi IS 'Mã đơn vị (Foreign Key)';
COMMENT ON COLUMN DanhBaLienHe.btlhcm_lh_sdt_ds IS 'Số điện thoại diện sự';
COMMENT ON COLUMN DanhBaLienHe.btlhcm_lh_sdt_qs IS 'Số điện thoại quân sự';
COMMENT ON COLUMN DanhBaLienHe.btlhcm_lh_sdt_dd IS 'Số điện thoại di động';
COMMENT ON COLUMN DanhBaLienHe.btlhcm_lh_ngaytao IS 'Ngày tạo bản ghi';
COMMENT ON COLUMN DanhBaLienHe.btlhcm_lh_ngaycapnhat IS 'Ngày cập nhật bản ghi';
