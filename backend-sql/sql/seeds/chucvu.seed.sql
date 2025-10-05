-- =====================================================
-- SEED DATA: CHUC VU (POSITIONS)
-- =====================================================

-- Dữ liệu mẫu bảng ChucVu
INSERT INTO ChucVu (btlhcm_cv_tencv, btlhcm_cv_ngaytao, btlhcm_cv_ngaycapnhat) VALUES
('Tư lệnh', NOW(), NOW()),
('Phó Tham mưu trưởng', NOW(), NOW()),
('Trưởng ban', NOW(), NOW()),
('Chính ủy', NOW(), NOW()),
('Phó Chính ủy', NOW(), NOW()),
('Chỉ huy trưởng', NOW(), NOW()),
('Phó Chỉ huy trưởng', NOW(), NOW()),
('Chính trị viên', NOW(), NOW()),
('Phó Chính trị viên', NOW(), NOW()),
('Đại đội trưởng', NOW(), NOW()),
('Trực ban tác chiến', NOW(), NOW()),
('Trực ban Phòng Tham mưu', NOW(), NOW()),
('Trực ban Phòng Chính trị', NOW(), NOW());

-- Thông báo hoàn thành
SELECT 'ChucVu seed data inserted successfully!' as status;
