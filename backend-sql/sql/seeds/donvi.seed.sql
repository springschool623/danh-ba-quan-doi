-- =====================================================
-- SEED DATA: DON VI (UNITS)
-- =====================================================

-- Dữ liệu mẫu bảng DonVi
INSERT INTO DonVi (btlhcm_dv_tendv, btlhcm_dv_diachi, btlhcm_dv_phuong, btlhcm_dv_tinhthanh, btlhcm_dv_quankhu, btlhcm_dv_ngaytao, btlhcm_dv_ngaycapnhat) VALUES
('Bộ Tư Lệnh TPHCM', '291 CMT8, P.Hòa Hưng, TPHCM', 1, 1, 7, NOW(), NOW()),
('BCH PTKV 1 - Long Bình', 'Số 123 đường ĐBP, P.Bình Châu, TPHCM', 2, 1, 7, NOW(), NOW()),
('BCH PTKV 2 - Phú Lợi', 'Số 222 đường QL1A, P.Tây Nam, TPHCM', 6, 1, 7, NOW(), NOW()),
('BCH PTKV 3 - Củ Chi', 'Số 333 đường ĐBP, P.Bình Tây, TPHCM', 3, 1, 7, NOW(), NOW()),
('BCH PTKV 4 - Nhà Bè', 'Số 444 đường Lộ Tẻ, P.Phước Kiển, TPHCM', 4, 1, 7, NOW(), NOW()),
('BCH PTKV 5 - Tam Long', 'Số 555 đường số 7, P.Đất Đỏ, TPHCM', 5, 1, 7, NOW(), NOW()),
('BCH PTKV 6 - Côn Đảo', 'Số 666 đường bờ kênh, P.Phước Kiển, TPHCM', 4, 1, 7, NOW(), NOW()),
('Trung đoàn Minh Đạm', 'Số 777 đường Lê Quang Sung, P.Đất Đỏ, TPHCM', 5, 1, 1, NOW(), NOW()),
('Phường Bình Tây', 'Số 111 đường Lê Quang Sung, P.Bình Tây, TPHCM', 3, 1, 1, NOW(), NOW()),
('Phường Hòa Hưng', 'Số 222 đường Thành Thái, P.Hòa Hưng, TPHCM', 1, 1, 1, NOW(), NOW());

-- Thông báo hoàn thành
SELECT 'DonVi seed data inserted successfully!' as status;
