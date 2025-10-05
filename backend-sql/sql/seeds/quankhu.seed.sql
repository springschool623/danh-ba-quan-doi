-- =====================================================
-- SEED DATA: QUAN KHU (MILITARY REGIONS)
-- =====================================================

-- Dữ liệu mẫu bảng QuanKhu
INSERT INTO QuanKhu (btlhcm_qk_tenqk, btlhcm_qk_mota, btlhcm_qk_ngaytao, btlhcm_qk_ngaycapnhat) VALUES
('Quân khu 1', 'Quân khu 1 - Địa bàn các tỉnh Đông Bắc Bộ', NOW(), NOW()),
('Quân khu 2', 'Quân khu 2 - Địa bàn các tỉnh Tây Bắc Bộ', NOW(), NOW()),
('Quân khu 3', 'Quân khu 3 - Địa bàn các tỉnh Đồng bằng Bắc Bộ', NOW(), NOW()),
('Quân khu 4', 'Quân khu 4 - Địa bàn các tỉnh Bắc Trung Bộ', NOW(), NOW()),
('Quân khu 5', 'Quân khu 5 - Địa bàn các tỉnh Nam Trung Bộ', NOW(), NOW()),
('Quân khu 6', 'Quân khu 6 - Địa bàn các tỉnh Tây Nam Bộ', NOW(), NOW()),
('Quân khu 7', 'Quân khu 7 - Địa bàn các tỉnh Đông Nam Bộ', NOW(), NOW()),
('Quân khu 8', 'Quân khu 8 - Địa bàn các tỉnh Tây Bắc Bộ', NOW(), NOW());

-- Thông báo hoàn thành
SELECT 'QuanKhu seed data inserted successfully!' as status;
