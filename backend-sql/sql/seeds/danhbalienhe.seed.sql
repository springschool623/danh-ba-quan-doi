-- =====================================================
-- SEED DATA: DANH BA LIEN HE (CONTACT DIRECTORY)
-- =====================================================

-- Dữ liệu mẫu bảng DanhBaLienHe
INSERT INTO DanhBaLienHe (btlhcm_lh_hoten, btlhcm_lh_capbac, btlhcm_lh_chucvu, btlhcm_lh_ban, btlhcm_lh_phong, btlhcm_lh_donvi, btlhcm_lh_sdt_ds, btlhcm_lh_sdt_qs, btlhcm_lh_sdt_dd, btlhcm_lh_hinhanh, btlhcm_lh_ngaytao, btlhcm_lh_ngaycapnhat) VALUES
('Nguyễn Văn A', 4, 1, NULL, 1, 1, '0901000001', '0901000001', '0901000001', NULL, NOW(), NOW()),
('Nguyễn Văn B', 5, 2, NULL, 2, 1, '0901000002', '0901000002', '0901000002', NULL, NOW(), NOW()),
('Nguyễn Văn C', 6, 3, 1, 3, 1, '0901000003', '0901000003', '0901000003', NULL, NOW(), NOW()),
('Nguyễn Văn D', 7, 3, 2, 3, 1, '0901000004', '0901000004', '0901000004', NULL, NOW(), NOW()),
('Tổ Văn A', 7, 3, 3, 5, 1, '0901000005', '0901000005', '0901000005', NULL, NOW(), NOW()),
('Tổ Văn B', 7, 3, 4, 4, 1, '0901000006', '0901000006', '0901000006', NULL, NOW(), NOW()),
('Nguyễn Văn E', 6, 6, NULL, 6, 2, '0901000007', '0901000007', '0901000007', NULL, NOW(), NOW()),
('Nguyễn Văn F', 6, 6, NULL, 6, 3, '0901000008', '0901000008', '0901000008', NULL, NOW(), NOW()),
('Nguyễn Văn G', 6, 6, NULL, 6, 4, '0901000009', '0901000009', '0901000009', NULL, NOW(), NOW()),
('Nguyễn Văn H', 6, 6, NULL, 6, 5, '0901000010', '0901000010', '0901000010', NULL, NOW(), NOW()),
('Nguyễn Văn I', 6, 6, NULL, 6, 6, '0901000011', '0901000011', '0901000011', NULL, NOW(), NOW()),
('Nguyễn Văn K', 6, 6, NULL, 6, 7, '0901000012', '0901000012', '0901000012', NULL, NOW(), NOW()),
('Đạm Văn A', 7, 6, 5, NULL, 8, '0901000013', '0901000013', '0901000013', NULL, NOW(), NOW()),
('Đạm Văn B', 7, 7, 5, NULL, 8, '0901000014', '0901000014', '0901000014', NULL, NOW(), NOW()),
('Trần Văn C', 7, 6, 5, 3, 1, '0901000015', '0901000015', '0901000015', NULL, NOW(), NOW()),
('Trần Văn A', 8, 10, 6, 3, 1, '0901000016', '0901000016', '0901000016', NULL, NOW(), NOW()),
('Trần Văn B', 8, 10, 7, 3, 1, '0901000017', '0901000017', '0901000017', NULL, NOW(), NOW()),
('Trực ban Tác chiến', NULL, 11, NULL, 7, 1, '0901000018', '0901000018', '0901000018', NULL, NOW(), NOW()),
('Trực ban Phòng Tham mưu', NULL, 12, NULL, 3, 1, '0901000019', '0901000019', '0901000019', NULL, NOW(), NOW()),
('Trực ban Phòng Chính trị', NULL, 13, NULL, 5, 1, '0901000020', '0901000020', '0901000020', NULL, NOW(), NOW()),
('Phường Văn A', NULL, 6, NULL, NULL, 9, '0901000021', '0901000021', '0901000021', NULL, NOW(), NOW()),
('Phường Văn B', NULL, 6, NULL, NULL, 10, '0901000022', '0901000022', '0901000022', NULL, NOW(), NOW());

-- Thông báo hoàn thành
SELECT 'DanhBaLienHe seed data inserted successfully!' as status;
