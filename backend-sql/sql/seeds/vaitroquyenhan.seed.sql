-- =====================================================
-- SEED DATA: VAI TRO & QUYEN HAN (ROLES & PERMISSIONS)
-- =====================================================

-- Dữ liệu mẫu bảng VaiTro
INSERT INTO VaiTro (btlhcm_vt_tenvt, btlhcm_vt_mota, btlhcm_vt_ngaytao, btlhcm_vt_ngaycapnhat) VALUES
('Quản trị hệ thống (Super Admin)', 'Quản trị hệ thống (Super Admin)', NOW(), NOW()),
('Quản trị viên Cấp Phường', 'Quản trị viên Cấp Phường', NOW(), NOW()), 
('User cấp trưởng', 'Xem được toàn bộ liên hệ', NOW(), NOW()),
('User', 'Không xem được liên hệ của Thủ trưởng BTL', NOW(), NOW());

-- Dữ liệu mẫu bảng QuyenHan
INSERT INTO QuyenHan (btlhcm_qh_tenqh, btlhcm_qh_mota, btlhcm_qh_ngaytao, btlhcm_qh_ngaycapnhat) VALUES
('VIEW_CONTACT', 'Quyền xem danh bạ liên hệ', NOW(), NOW()),
('ADD_CONTACT', 'Quyền thêm mới danh bạ liên hệ', NOW(), NOW()),
('EDIT_CONTACT', 'Quyền sửa thông tin danh bạ liên hệ', NOW(), NOW()),
('DELETE_CONTACT', 'Quyền xóa danh bạ liên hệ', NOW(), NOW()),
('EXPORT_CONTACT', 'Quyền xuất danh bạ liên hệ', NOW(), NOW()),
('IMPORT_CONTACT', 'Quyền nhập danh bạ liên hệ', NOW(), NOW()),
('MANAGE_ROLES', 'Quyền quản lý vai trò', NOW(), NOW());

-- Dữ liệu mẫu bảng VaiTroNguoiDung
INSERT INTO VaiTroNguoiDung (btlhcm_vtnd_mand, btlhcm_vtnd_mavt, btlhcm_vtnd_ngaytao, btlhcm_vtnd_ngaycapnhat) VALUES
('admin_btlhcm', 1, NOW(), NOW()),
('admin2_btlhcm', 2, NOW(), NOW()),
('admin_phuongbinhtay', 2, NOW(), NOW()),
('admin_phuonghoahung', 2, NOW(), NOW()),
('user1_btlhcm', 3, NOW(), NOW()),
('tnc_btlhcm', 4, NOW(), NOW()),
('user2_btlhcm', 4, NOW(), NOW());

-- Dữ liệu mẫu bảng QuyenHanVaiTro
INSERT INTO QuyenHanVaiTro (btlhcm_qhvt_mavt, btlhcm_qhvt_maqh, btlhcm_qhvt_ngaytao, btlhcm_qhvt_ngaycapnhat) VALUES
-- Super Admin
(1, 1, NOW(), NOW()),
(1, 2, NOW(), NOW()),
(1, 3, NOW(), NOW()),
(1, 4, NOW(), NOW()),
(1, 5, NOW(), NOW()),
(1, 6, NOW(), NOW()),
(1, 7, NOW(), NOW()),
-- Quản trị viên Cấp Phường
(2, 1, NOW(), NOW()),
(2, 2, NOW(), NOW()),
(2, 3, NOW(), NOW()),
(2, 5, NOW(), NOW()),
(2, 6, NOW(), NOW()),
-- User tổng
(3, 1, NOW(), NOW()),
-- User đơn vị
(4, 1, NOW(), NOW());

-- Thông báo hoàn thành
SELECT 'VaiTro & QuyenHan seed data inserted successfully!' as status;
