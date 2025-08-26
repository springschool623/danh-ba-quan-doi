-- =====================================================
-- SCHEMA: VAI TRO & QUYEN HAN (ROLES & PERMISSIONS)
-- =====================================================

-- Bảng Vai Trò
CREATE TABLE IF NOT EXISTS VaiTro (
    btlhcm_vt_mavt SERIAL PRIMARY KEY,
    btlhcm_vt_tenvt VARCHAR(100) NOT NULL UNIQUE,
    btlhcm_vt_mota TEXT,
    btlhcm_vt_ngaytao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    btlhcm_vt_ngaycapnhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Quyền Hạn
CREATE TABLE IF NOT EXISTS QuyenHan (
    btlhcm_qh_maqh SERIAL PRIMARY KEY,
    btlhcm_qh_tenqh VARCHAR(100) NOT NULL UNIQUE,
    btlhcm_qh_mota TEXT,
    btlhcm_qh_ngaytao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    btlhcm_qh_ngaycapnhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng quan hệ Vai Trò - Người Dùng
CREATE TABLE IF NOT EXISTS VaiTroNguoiDung (
    btlhcm_vtnd_mand VARCHAR(50) NOT NULL REFERENCES NguoiDung(btlhcm_nd_mand) ON DELETE CASCADE,
    btlhcm_vtnd_mavt INT NOT NULL REFERENCES VaiTro(btlhcm_vt_mavt) ON DELETE CASCADE,
    btlhcm_vtnd_ngaytao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    btlhcm_vtnd_ngaycapnhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(btlhcm_vtnd_mand, btlhcm_vtnd_mavt)
);

-- Bảng quan hệ Quyền Hạn - Vai Trò
CREATE TABLE IF NOT EXISTS QuyenHanVaiTro (
    btlhcm_qhvt_mavt INT NOT NULL REFERENCES VaiTro(btlhcm_vt_mavt) ON DELETE CASCADE,
    btlhcm_qhvt_maqh INT NOT NULL REFERENCES QuyenHan(btlhcm_qh_maqh) ON DELETE CASCADE,
    btlhcm_qhvt_ngaytao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    btlhcm_qhvt_ngaycapnhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(btlhcm_qhvt_mavt, btlhcm_qhvt_maqh)
);

-- Tạo index cho các cột thường được tìm kiếm
CREATE INDEX idx_vaitro_tenvt ON VaiTro(btlhcm_vt_tenvt);
CREATE INDEX idx_quyenhan_tenqh ON QuyenHan(btlhcm_qh_tenqh);
CREATE INDEX idx_vaitro_nguoidung_mand ON VaiTroNguoiDung(btlhcm_vtnd_mand);
CREATE INDEX idx_vaitro_nguoidung_mavt ON VaiTroNguoiDung(btlhcm_vtnd_mavt);
CREATE INDEX idx_quyenhan_vaitro_mavt ON QuyenHanVaiTro(btlhcm_qhvt_mavt);
CREATE INDEX idx_quyenhan_vaitro_maqh ON QuyenHanVaiTro(btlhcm_qhvt_maqh);

-- Comment cho bảng và các cột
COMMENT ON TABLE VaiTro IS 'Bảng lưu trữ thông tin các vai trò trong hệ thống';
COMMENT ON COLUMN VaiTro.btlhcm_vt_mavt IS 'Mã vai trò (Primary Key)';
COMMENT ON COLUMN VaiTro.btlhcm_vt_tenvt IS 'Tên vai trò';
COMMENT ON COLUMN VaiTro.btlhcm_vt_mota IS 'Mô tả vai trò';
COMMENT ON COLUMN VaiTro.btlhcm_vt_ngaytao IS 'Ngày tạo bản ghi';
COMMENT ON COLUMN VaiTro.btlhcm_vt_ngaycapnhat IS 'Ngày cập nhật bản ghi';

COMMENT ON TABLE QuyenHan IS 'Bảng lưu trữ thông tin các quyền hạn trong hệ thống';
COMMENT ON COLUMN QuyenHan.btlhcm_qh_maqh IS 'Mã quyền hạn (Primary Key)';
COMMENT ON COLUMN QuyenHan.btlhcm_qh_tenqh IS 'Tên quyền hạn';
COMMENT ON COLUMN QuyenHan.btlhcm_qh_mota IS 'Mô tả quyền hạn';
COMMENT ON COLUMN QuyenHan.btlhcm_qh_ngaytao IS 'Ngày tạo bản ghi';
COMMENT ON COLUMN QuyenHan.btlhcm_qh_ngaycapnhat IS 'Ngày cập nhật bản ghi';

COMMENT ON TABLE VaiTroNguoiDung IS 'Bảng quan hệ nhiều-nhiều giữa Vai Trò và Người Dùng';
COMMENT ON COLUMN VaiTroNguoiDung.btlhcm_vtnd_mand IS 'Mã người dùng (Foreign Key)';
COMMENT ON COLUMN VaiTroNguoiDung.btlhcm_vtnd_mavt IS 'Mã vai trò (Foreign Key)';
COMMENT ON COLUMN VaiTroNguoiDung.btlhcm_vtnd_ngaytao IS 'Ngày tạo bản ghi';
COMMENT ON COLUMN VaiTroNguoiDung.btlhcm_vtnd_ngaycapnhat IS 'Ngày cập nhật bản ghi';

COMMENT ON TABLE QuyenHanVaiTro IS 'Bảng quan hệ nhiều-nhiều giữa Quyền Hạn và Vai Trò';
COMMENT ON COLUMN QuyenHanVaiTro.btlhcm_qhvt_mavt IS 'Mã vai trò (Foreign Key)';
COMMENT ON COLUMN QuyenHanVaiTro.btlhcm_qhvt_maqh IS 'Mã quyền hạn (Foreign Key)';
COMMENT ON COLUMN QuyenHanVaiTro.btlhcm_qhvt_ngaytao IS 'Ngày tạo bản ghi';
COMMENT ON COLUMN QuyenHanVaiTro.btlhcm_qhvt_ngaycapnhat IS 'Ngày cập nhật bản ghi';
