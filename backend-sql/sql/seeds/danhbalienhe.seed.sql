-- =====================================================
-- SEED DATA: DANH BA LIEN HE (CONTACT DIRECTORY)
-- =====================================================

-- Dữ liệu mẫu bảng DanhBaLienHe
INSERT INTO DanhBaLienHe (btlhcm_lh_malh, btlhcm_lh_hoten, btlhcm_lh_capbac, btlhcm_lh_chucvu, btlhcm_lh_ban, btlhcm_lh_phong, btlhcm_lh_donvi, btlhcm_lh_sdt_ds, btlhcm_lh_sdt_qs, btlhcm_lh_sdt_dd, btlhcm_lh_ngaytao, btlhcm_lh_ngaycapnhat) VALUES
(1, 'Nguyễn Văn A', 4, 1, NULL, 1, 1, '0901000001', '0901000001', '0901000001', NOW(), NOW()),
(2, 'Nguyễn Văn B', 5, 2, NULL, 2, 1, '0901000002', '0901000002', '0901000002', NOW(), NOW()),
(3, 'Nguyễn Văn C', 6, 3, 1, 3, 1, '0901000003', '0901000003', '0901000003', NOW(), NOW()),
(4, 'Nguyễn Văn D', 7, 3, 2, 3, 1, '0901000004', '0901000004', '0901000004', NOW(), NOW()),
(5, 'Tổ Văn A', 7, 3, 3, 5, 1, '0901000005', '0901000005', '0901000005', NOW(), NOW()),
(6, 'Tổ Văn B', 7, 3, 4, 4, 1, '0901000006', '0901000006', '0901000006', NOW(), NOW()),
(7, 'Nguyễn Văn E', 6, 6, NULL, 6, 2, '0901000007', '0901000007', '0901000007', NOW(), NOW()),
(8, 'Nguyễn Văn F', 6, 6, NULL, 6, 3, '0901000008', '0901000008', '0901000008', NOW(), NOW()),
(9, 'Nguyễn Văn G', 6, 6, NULL, 6, 4, '0901000009', '0901000009', '0901000009', NOW(), NOW()),
(10, 'Nguyễn Văn H', 6, 6, NULL, 6, 5, '0901000010', '0901000010', '0901000010', NOW(), NOW()),
(11, 'Nguyễn Văn I', 6, 6, NULL, 6, 6, '0901000011', '0901000011', '0901000011', NOW(), NOW()),
(12, 'Nguyễn Văn K', 6, 6, NULL, 6, 7, '0901000012', '0901000012', '0901000012', NOW(), NOW()),
(13, 'Đạm Văn A', 7, 6, 5, NULL, 8, '0901000013', '0901000013', '0901000013', NOW(), NOW()),
(14, 'Đạm Văn B', 7, 7, 5, NULL, 8, '0901000014', '0901000014', '0901000014', NOW(), NOW()),
(15, 'Trần Văn C', 7, 6, 5, 3, 1, '0901000015', '0901000015', '0901000015', NOW(), NOW()),
(16, 'Trần Văn A', 8, 10, 6, 3, 1, '0901000016', '0901000016', '0901000016', NOW(), NOW()),
(17, 'Trần Văn B', 8, 10, 7, 3, 1, '0901000017', '0901000017', '0901000017', NOW(), NOW()),
(18, 'Trực ban Tác chiến', NULL, 11, NULL, 7, 1, '0901000018', '0901000018', '0901000018', NOW(), NOW()),
(19, 'Trực ban Phòng Tham mưu', NULL, 12, NULL, 3, 1, '0901000019', '0901000019', '0901000019', NOW(), NOW()),
(20, 'Trực ban Phòng Chính trị', NULL, 13, NULL, 5, 1, '0901000020', '0901000020', '0901000020', NOW(), NOW()),
(21, 'Phường Văn A', NULL, 6, NULL, NULL, 9, '0901000021', '0901000021', '0901000021', NOW(), NOW()),
(22, 'Phường Văn B', NULL, 6, NULL, NULL, 10, '0901000022', '0901000022', '0901000022', NOW(), NOW());

-- Thông báo hoàn thành
SELECT 'DanhBaLienHe seed data inserted successfully!' as status;
