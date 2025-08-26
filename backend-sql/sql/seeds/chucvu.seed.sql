-- =====================================================
-- SEED DATA: CHUC VU (POSITIONS)
-- =====================================================

-- Dữ liệu mẫu bảng ChucVu
INSERT INTO ChucVu (btlhcm_cv_macv, btlhcm_cv_tencv, btlhcm_cv_ngaytao, btlhcm_cv_ngaycapnhat) VALUES
(1, 'Tư lệnh', NOW(), NOW()),
(2, 'Phó Tham mưu trưởng', NOW(), NOW()),
(3, 'Trưởng ban', NOW(), NOW()),
(4, 'Chính ủy', NOW(), NOW()),
(5, 'Phó Chính ủy', NOW(), NOW()),
(6, 'Chỉ huy trưởng', NOW(), NOW()),
(7, 'Phó Chỉ huy trưởng', NOW(), NOW()),
(8, 'Chính trị viên', NOW(), NOW()),
(9, 'Phó Chính trị viên', NOW(), NOW()),
(10, 'Đại đội trưởng', NOW(), NOW()),
(11, 'Trực ban tác chiến', NOW(), NOW()),
(12, 'Trực ban Phòng Tham mưu', NOW(), NOW()),
(13, 'Trực ban Phòng Chính trị', NOW(), NOW());

-- Thông báo hoàn thành
SELECT 'ChucVu seed data inserted successfully!' as status;
