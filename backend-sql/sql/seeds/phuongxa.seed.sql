-- =====================================================
-- SEED DATA: PHUONG XA (WARDS/COMMUNES)
-- =====================================================

-- Dữ liệu mẫu bảng PhuongXa
INSERT INTO PhuongXa (btlhcm_px_mapx, btlhcm_px_tinhthanh, btlhcm_px_tenpx, btlhcm_px_mota, btlhcm_px_ngaytao, btlhcm_px_ngaycapnhat) VALUES
(1, 1, 'Phường Hòa Hưng', 'Phường Hòa Hưng, TPHCM', NOW(), NOW()),
(2, 1, 'Phường Bình Châu', 'Phường Bình Châu, TPHCM', NOW(), NOW()),
(3, 1, 'Phường Bình Tây', 'Phường Bình Tây, TPHCM', NOW(), NOW()),
(4, 1, 'Phường Phước Kiển', 'Phước Kiển, TPHCM', NOW(), NOW()),
(5, 1, 'Phường Đất Đỏ', 'Phường Đất Đỏ, TPHCM', NOW(), NOW()),
(6, 1, 'Phường Tây Nam', 'Phường Tây Nam, TPHCM', NOW(), NOW());

-- Thông báo hoàn thành
SELECT 'PhuongXa seed data inserted successfully!' as status;
