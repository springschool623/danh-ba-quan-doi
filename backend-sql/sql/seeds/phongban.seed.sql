-- =====================================================
-- SEED DATA: PHONG BAN (DEPARTMENTS & DIVISIONS)
-- =====================================================

-- Dữ liệu mẫu bảng Phong
INSERT INTO Phong (btlhcm_pb_mapb, btlhcm_pb_tenpb, btlhcm_pb_ngaytao, btlhcm_pb_ngaycapnhat) VALUES
(1, 'Thủ trưởng Bộ Tư lệnh', NOW(), NOW()),
(2, 'Thủ trưởng Phòng Tham mưu', NOW(), NOW()),
(3, 'Phòng Tham mưu', NOW(), NOW()),
(4, 'Phòng Hậu cần - Kỹ thuật', NOW(), NOW()),
(5, 'Phòng Chính trị', NOW(), NOW()),
(6, 'Thủ trưởng', NOW(), NOW()),
(7, 'Sở Chỉ huy', NOW(), NOW());

-- Dữ liệu mẫu bảng Ban
INSERT INTO Ban (btlhcm_ba_mab, btlhcm_ba_tenb, btlhcm_ba_maphong, btlhcm_ba_ngaytao, btlhcm_ba_ngaycapnhat) VALUES
(1, 'Ban Thông tin', 3, NOW(), NOW()),
(2, 'Ban Cơ Yếu', 3, NOW(), NOW()),
(3, 'Ban Tổ chức', 5, NOW(), NOW()),
(4, 'Ban Doanh trại', 4, NOW(), NOW()),
(5, 'Tiểu đoàn Tăng Thiết Giáp', 3, NOW(), NOW()),
(6, 'Đại đội Thông tin', 3, NOW(), NOW()),
(7, 'Đại đội Trinh sát', 3, NOW(), NOW());

-- Thông báo hoàn thành
SELECT 'Phong & Ban seed data inserted successfully!' as status;
