-- =====================================================
-- SCHEMA: NGUOI DUNG (USERS)
-- =====================================================

CREATE TABLE IF NOT EXISTS NguoiDung (
    btlhcm_nd_mand VARCHAR(50) NOT NULL PRIMARY KEY,
    btlhcm_nd_matkhau VARCHAR(20) NOT NULL,
    btlhcm_nd_trangthai BOOLEAN DEFAULT TRUE,
    btlhcm_nd_ngaytao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    btlhcm_nd_ngaycapnhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo index cho các cột thường được tìm kiếm
CREATE INDEX idx_nguoidung_mand ON NguoiDung(btlhcm_nd_mand);
CREATE INDEX idx_nguoidung_trangthai ON NguoiDung(btlhcm_nd_trangthai);

-- Comment cho bảng và các cột
COMMENT ON TABLE NguoiDung IS 'Bảng lưu trữ thông tin người dùng hệ thống';
COMMENT ON COLUMN NguoiDung.btlhcm_nd_mand IS 'Mã người dùng (Primary Key)';
COMMENT ON COLUMN NguoiDung.btlhcm_nd_matkhau IS 'Mật khẩu đăng nhập';
COMMENT ON COLUMN NguoiDung.btlhcm_nd_trangthai IS 'Trạng thái hoạt động (TRUE: hoạt động, FALSE: không hoạt động)';
COMMENT ON COLUMN NguoiDung.btlhcm_nd_ngaytao IS 'Ngày tạo bản ghi';
COMMENT ON COLUMN NguoiDung.btlhcm_nd_ngaycapnhat IS 'Ngày cập nhật bản ghi';
