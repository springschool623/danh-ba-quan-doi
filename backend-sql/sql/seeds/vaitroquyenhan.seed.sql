-- =====================================================
-- SEED DATA: VAI TRO & QUYEN HAN (ROLES & PERMISSIONS)
-- =====================================================

-- Dữ liệu mẫu bảng VaiTro
INSERT INTO VaiTro (btlhcm_vt_tenvt, btlhcm_vt_mota, btlhcm_vt_ngaytao, btlhcm_vt_ngaycapnhat) VALUES
('Quản trị hệ thống (Super Admin)', 'Quản trị hệ thống (Super Admin)', NOW(), NOW()),
('Quản trị hệ thống (Admin)', 'Quản trị hệ thống (Admin)', NOW(), NOW()),
('Quản trị viên (User)', 'Quản trị viên (User)', NOW(), NOW());

-- Dữ liệu mẫu bảng QuyenHan
INSERT INTO QuyenHan (btlhcm_qh_tenqh, btlhcm_qh_mota, btlhcm_qh_ngaytao, btlhcm_qh_ngaycapnhat) VALUES
('Xem danh bạ', 'Quyền xem danh bạ liên hệ', NOW(), NOW()),
('Thêm danh bạ', 'Quyền thêm mới danh bạ liên hệ', NOW(), NOW()),
('Sửa danh bạ', 'Quyền sửa thông tin danh bạ liên hệ', NOW(), NOW()),
('Xóa danh bạ', 'Quyền xóa danh bạ liên hệ', NOW(), NOW()),
('Quản lý vai trò', 'Quyền quản lý vai trò', NOW(), NOW());

-- Dữ liệu mẫu bảng VaiTroNguoiDung
INSERT INTO VaiTroNguoiDung (btlhcm_vtnd_mand, btlhcm_vtnd_mavt, btlhcm_vtnd_ngaytao, btlhcm_vtnd_ngaycapnhat) VALUES
('admin_btlhcm', 1, NOW(), NOW()),
('tnc_btlhcm', 2, NOW(), NOW());

-- Dữ liệu mẫu bảng QuyenHanVaiTro
INSERT INTO QuyenHanVaiTro (btlhcm_qhvt_mavt, btlhcm_qhvt_maqh, btlhcm_qhvt_ngaytao, btlhcm_qhvt_ngaycapnhat) VALUES
(1, 1, NOW(), NOW()),
(1, 2, NOW(), NOW()),
(1, 3, NOW(), NOW()),
(1, 4, NOW(), NOW()),
(1, 5, NOW(), NOW()),
(2, 1, NOW(), NOW()),
(2, 2, NOW(), NOW());

-- Thông báo hoàn thành
SELECT 'VaiTro & QuyenHan seed data inserted successfully!' as status;
