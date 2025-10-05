-- =====================================================
-- SEED DATA: TINH THANH (PROVINCES/CITIES)
-- =====================================================

-- Dữ liệu mẫu bảng TinhThanh
INSERT INTO TinhThanh (btlhcm_tt_quankhu, btlhcm_tt_tentt, btlhcm_tt_mota, btlhcm_tt_ngaytao, btlhcm_tt_ngaycapnhat) VALUES
(7, 'Thành phố Hồ Chí Minh', 'Thành phố Hồ Chí Minh', NOW(), NOW());

-- Thông báo hoàn thành
SELECT 'TinhThanh seed data inserted successfully!' as status;
