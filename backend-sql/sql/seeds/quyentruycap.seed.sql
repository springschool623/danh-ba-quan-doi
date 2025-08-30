-- =====================================================
-- SEED DATA: QUYEN TRUY CAP THEO KHU VUC (AREA-BASED ACCESS CONTROL)
-- =====================================================

-- Dữ liệu mẫu bảng QuyenTruyCapTheoKhuVuc
INSERT INTO QuyenTruyCapTheoKhuVuc 
( btlhcm_qtckv_mand, btlhcm_qtckv_maqk, btlhcm_qtckv_matt, btlhcm_qtckv_mapx, btlhcm_qtckv_ngaytao, btlhcm_qtckv_ngaycapnhat)
VALUES
-- User01 có quyền theo Quân khu
('admin_btlhcm', 7, NULL, NULL, NOW(), NOW()),

-- User02 có quyền theo Tỉnh thành
('tnc_btlhcm', NULL, 1, NULL, NOW(), NOW()),

-- User02 có quyền theo Phường/Xã
('tnc_btlhcm', NULL, NULL, 1, NOW(), NOW());

-- Thông báo hoàn thành
SELECT 'QuyenTruyCapTheoKhuVuc seed data inserted successfully!' as status;
