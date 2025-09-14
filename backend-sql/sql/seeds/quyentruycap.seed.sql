-- =====================================================
-- SEED DATA: QUYEN TRUY CAP THEO KHU VUC (AREA-BASED ACCESS CONTROL)
-- =====================================================

-- Dữ liệu mẫu bảng QuyenTruyCapTheoKhuVuc
INSERT INTO QuyenTruyCapTheoKhuVuc 
( btlhcm_qtckv_mand, btlhcm_qtckv_maqk, btlhcm_qtckv_matt, btlhcm_qtckv_mapx, btlhcm_qtckv_ngaytao, btlhcm_qtckv_ngaycapnhat)
VALUES
-- Super Admin có quyền truy cập danh bạ theo TPHCM
('admin_btlhcm', NULL, 1, NULL, NOW(), NOW()),
('admin2_btlhcm', NULL, 1, NULL, NOW(), NOW()),

-- Quản trị viên Cấp Phường có quyền truy cập danh bạ theo Phường/Xã
('admin_phuonghoahung', NULL, NULL, 1, NOW(), NOW()),
('admin_phuongbinhtay', NULL, NULL, 3, NOW(), NOW()),

--User tổng có quyền xem danh bạ theo TPHCM
('user1_btlhcm', NULL, 1, NULL, NOW(), NOW()),

--User đơn vị có quyền xem danh bạ theo Phường/Xã
('user2_btlhcm', NULL, NULL, 1, NOW(), NOW());

-- Thông báo hoàn thành
SELECT 'QuyenTruyCapTheoKhuVuc seed data inserted successfully!' as status;
