-- =====================================================
-- SEED DATA: CAP BAC (MILITARY RANKS)
-- =====================================================

-- Dữ liệu mẫu bảng CapBac
INSERT INTO CapBac (btlhcm_cb_macb, btlhcm_cb_tencb, btlhcm_cb_ngaytao, btlhcm_cb_ngaycapnhat) VALUES
(1, 'Đại tướng', NOW(), NOW()),
(2, 'Thượng tướng', NOW(), NOW()),
(3, 'Trung tướng', NOW(), NOW()),
(4, 'Thiếu tướng', NOW(), NOW()),
(5, 'Đại tá', NOW(), NOW()),
(6, 'Thượng tá', NOW(), NOW()),
(7, 'Trung tá', NOW(), NOW()),
(8, 'Thiếu tá', NOW(), NOW()),
(9, 'Đại úy', NOW(), NOW()),
(10, 'Thượng úy', NOW(), NOW()),
(11, 'Trung úy', NOW(), NOW()),
(12, 'Thiếu úy', NOW(), NOW());

-- Thông báo hoàn thành
SELECT 'CapBac seed data inserted successfully!' as status;
