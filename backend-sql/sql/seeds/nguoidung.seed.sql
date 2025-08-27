-- =====================================================
-- SEED DATA: NGUOI DUNG (USERS)
-- =====================================================

-- Dữ liệu mẫu bảng NguoiDung
INSERT INTO NguoiDung (btlhcm_nd_mand, btlhcm_nd_matkhau, btlhcm_nd_trangthai, btlhcm_nd_ngaytao, btlhcm_nd_ngaycapnhat) VALUES
('0912345678', 'admin123', TRUE, NOW(), NOW()),
('0999999999', 'user456', TRUE, NOW(), NOW());

-- Thông báo hoàn thành
SELECT 'NguoiDung seed data inserted successfully!' as status;
