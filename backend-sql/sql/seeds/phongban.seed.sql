-- =====================================================
-- SEED DATA: PHONG BAN (DEPARTMENTS & DIVISIONS)
-- =====================================================

-- Dữ liệu mẫu bảng Phong
INSERT INTO Phong (btlhcm_pb_tenpb, btlhcm_pb_ngaytao, btlhcm_pb_ngaycapnhat) VALUES
('Thủ trưởng Bộ Tư lệnh', NOW(), NOW()),
('Thủ trưởng Phòng Tham mưu', NOW(), NOW()),
('Phòng Tham mưu', NOW(), NOW()),
('Phòng Hậu cần - Kỹ thuật', NOW(), NOW()),
('Phòng Chính trị', NOW(), NOW()),
('Thủ trưởng', NOW(), NOW()),
('Sở Chỉ huy', NOW(), NOW());

-- Dữ liệu mẫu bảng Ban
INSERT INTO Ban (btlhcm_ba_tenb, btlhcm_ba_maphong, btlhcm_ba_ngaytao, btlhcm_ba_ngaycapnhat) VALUES
('Ban Thông tin', 3, NOW(), NOW()),
('Ban Cơ Yếu', 3, NOW(), NOW()),
('Ban Tổ chức', 5, NOW(), NOW()),
('Ban Doanh trại', 4, NOW(), NOW()),
('Tiểu đoàn Tăng Thiết Giáp', 3, NOW(), NOW()),
('Đại đội Thông tin', 3, NOW(), NOW()),
('Đại đội Trinh sát', 3, NOW(), NOW());

-- Thông báo hoàn thành
SELECT 'Phong & Ban seed data inserted successfully!' as status;
