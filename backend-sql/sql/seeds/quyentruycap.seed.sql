-- =====================================================
-- SEED DATA: QUYEN TRUY CAP THEO KHU VUC (AREA-BASED ACCESS CONTROL)
-- =====================================================

-- Dữ liệu mẫu bảng QuyenTruyCapTheoKhuVuc
INSERT INTO QuyenTruyCapTheoKhuVuc 
(btlhcm_qtckv_id, btlhcm_qtckv_mand, btlhcm_qtckv_maqk, btlhcm_qtckv_matt, btlhcm_qtckv_mapx, btlhcm_qtckv_ngaytao, btlhcm_qtckv_ngaycapnhat)
VALUES
-- User01 có quyền theo Quân khu
(1, '0912345678', 7, NULL, NULL, NOW(), NOW()),

-- User02 có quyền theo Tỉnh thành
(2, '0999999999', NULL, 1, NULL, NOW(), NOW()),

-- User02 có quyền theo Phường/Xã
(3, '0999999999', NULL, NULL, 1, NOW(), NOW());

-- Thông báo hoàn thành
SELECT 'QuyenTruyCapTheoKhuVuc seed data inserted successfully!' as status;
