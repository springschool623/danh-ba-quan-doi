-- Dữ liệu mẫu bảng QuanKhu
INSERT INTO QuanKhu (btlhcm_qk_maqk, btlhcm_qk_tenqk, btlhcm_qk_mota, btlhcm_qk_ngaytao, btlhcm_qk_ngaycapnhat) VALUES
(1, 'Quân khu 1', 'Quân khu 1 - Địa bàn các tỉnh Đông Bắc Bộ', NOW(), NOW()),
(2, 'Quân khu 2', 'Quân khu 2 - Địa bàn các tỉnh Tây Bắc Bộ', NOW(), NOW()),
(3, 'Quân khu 3', 'Quân khu 3 - Địa bàn các tỉnh Đồng bằng Bắc Bộ', NOW(), NOW()),
(4, 'Quân khu 4', 'Quân khu 4 - Địa bàn các tỉnh Bắc Trung Bộ', NOW(), NOW()),
(5, 'Quân khu 5', 'Quân khu 5 - Địa bàn các tỉnh Nam Trung Bộ', NOW(), NOW()),
(6, 'Quân khu 6', 'Quân khu 6 - Địa bàn các tỉnh Tây Nam Bộ', NOW(), NOW()),
(7, 'Quân khu 7', 'Quân khu 7 - Địa bàn các tỉnh Đông Nam Bộ', NOW(), NOW()),
(8, 'Quân khu 8', 'Quân khu 8 - Địa bàn các tỉnh Tây Bắc Bộ', NOW(), NOW());

-- Dữ liệu mẫu bảng TinhThanh
INSERT INTO TinhThanh (btlhcm_tt_matt, btlhcm_tt_quankhu, btlhcm_tt_tentt, btlhcm_tt_mota, btlhcm_tt_ngaytao, btlhcm_tt_ngaycapnhat) VALUES
(1, 1, 'TP.HCM', 'Thành phố Hồ Chí Minh', NOW(), NOW());

-- Dữ liệu mẫu bảng PhuongXa
INSERT INTO PhuongXa (btlhcm_px_mapx, btlhcm_px_tinhthanh, btlhcm_px_tenpx, btlhcm_px_mota, btlhcm_px_ngaytao, btlhcm_px_ngaycapnhat) VALUES
(1, 1, 'Phường Hòa Hưng', 'Phường Hòa Hưng, TPHCM', NOW(), NOW()),
(2, 1, 'Phường Bình Châu', 'Phường Bình Châu, TPHCM', NOW(), NOW()),
(3, 1, 'Phường Bình Tây', 'Phường Bình Tây, TPHCM', NOW(), NOW()),
(4, 1, 'Phường Phước Kiển', 'Phước Kiển, TPHCM', NOW(), NOW()),
(5, 1, 'Phường Đất Đỏ', 'Phường Đất Đỏ, TPHCM', NOW(), NOW()),
(6, 1, 'Phường Tây Nam', 'Phường Tây Nam, TPHCM', NOW(), NOW());

-- Dữ liệu mẫu bảng CapBac
INSERT INTO CapBac (btlhcm_cb_macb, btlhcm_cb_tencb, btlhcm_cb_ngaytao, btlhcm_cb_ngaycapnhat) VALUES
(1, 'Đại tướng', NOW(), NOW()),
(2, 'Thượng tướng', NOW(), NOW()),
(3, 'Trung tướng', NOW(), NOW()),
(4, 'Thiếu tướng', NOW(), NOW()),
(5, 'Đại tá', NOW(), NOW()),
(6, 'Thượng tá', NOW(), NOW()),
(7, 'Trung tá', NOW(), NOW()),
(8, 'Thiếu tá', NOW(), NOW()),
(9, 'Đại úy', NOW(), NOW()),
(10, 'Thượng úy', NOW(), NOW()),
(11, 'Trung úy', NOW(), NOW()),
(12, 'Thiếu úy', NOW(), NOW());

-- Dữ liệu mẫu bảng ChucVu
INSERT INTO ChucVu (btlhcm_cv_macv, btlhcm_cv_tencv, btlhcm_cv_ngaytao, btlhcm_cv_ngaycapnhat) VALUES
(1, 'Tư lệnh', NOW(), NOW()),
(2, 'Phó Tham mưu trưởng', NOW(), NOW()),
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

-- Dữ liệu mẫu bảng Phong
INSERT INTO Phong (btlhcm_pb_mapb, btlhcm_pb_tenpb, btlhcm_pb_ngaytao, btlhcm_pb_ngaycapnhat) VALUES
(1, 'Thủ trưởng Bộ Tư lệnh', NOW(), NOW()),
(2, 'Thủ trưởng Phòng Tham mưu', NOW(), NOW()),
(3, 'Phòng Tham mưu', NOW(), NOW()),
(4, 'Phòng Hậu cần - Kỹ thuật', NOW(), NOW()),
(5, 'Phòng Chính trị', NOW(), NOW()),
(6, 'Thủ trưởng', NOW(), NOW()),
(7, 'Sở Chỉ huy', NOW(), NOW());

-- Dữ liệu mẫu bảng Ban
INSERT INTO Ban (btlhcm_ba_mab, btlhcm_ba_tenb, btlhcm_ba_maphong, btlhcm_ba_ngaytao, btlhcm_ba_ngaycapnhat) VALUES
(1, 'Ban Thông tin', 3, NOW(), NOW()),
(2, 'Ban Cơ Yếu', 3, NOW(), NOW()),
(3, 'Ban Tổ chức', 5, NOW(), NOW()),
(4, 'Ban Doanh trại', 4, NOW(), NOW()),
(5, 'Tiểu đoàn Tăng Thiết Giáp', 3, NOW(), NOW()),
(6, 'Đại đội Thông tin', 3, NOW(), NOW()),
(7, 'Đại đội Trinh sát', 3, NOW(), NOW());

-- Dữ liệu mẫu bảng DonVi
INSERT INTO DonVi (btlhcm_dv_madv, btlhcm_dv_tendv, btlhcm_dv_diachi, btlhcm_dv_phuong, btlhcm_dv_tinhthanh, btlhcm_dv_quankhu, btlhcm_dv_ngaytao, btlhcm_dv_ngaycapnhat) VALUES
(1, 'Bộ Tư Lệnh TPHCM', '291 CMT8, P.Hòa Hưng, TPHCM', 1, 1, 7, NOW(), NOW()),
(2, 'BCH PTKV 1 - Long Bình', 'Số 123 đường ĐBP, P.Bình Châu, TPHCM', 2, 1, 7, NOW(), NOW()),
(3, 'BCH PTKV 2 - Phú Lợi', 'Số 222 đường QL1A, P.Tây Nam, TPHCM', 6, 1, 7, NOW(), NOW()),
(4, 'BCH PTKV 3 - Củ Chi', 'Số 333 đường ĐBP, P.Bình Tây, TPHCM', 3, 1, 7, NOW(), NOW()),
(5, 'BCH PTKV 4 - Nhà Bè', 'Số 444 đường Lộ Tẻ, P.Phước Kiển, TPHCM', 4, 1, 7, NOW(), NOW()),
(6, 'BCH PTKV 5 - Tam Long', 'Số 555 đường số 7, P.Đất Đỏ, TPHCM', 5, 1, 7, NOW(), NOW()),
(7, 'BCH PTKV 6 - Côn Đảo', 'Số 666 đường bờ kênh, P.Phước Kiển, TPHCM', 4, 1, 7, NOW(), NOW()),
(8, 'Trung đoàn Minh Đạm', 'Số 777 đường Lê Quang Sung, P.Đất Đỏ, TPHCM', 5, 1, 1, NOW(), NOW()),
(9, 'Phường Bình Tây', 'Số 111 đường Lê Quang Sung, P.Bình Tây, TPHCM', 3, 1, 1, NOW(), NOW()),
(10, 'Phường Hòa Hưng', 'Số 222 đường Thành Thái, P.Hòa Hưng, TPHCM', 1, 1, 1, NOW(), NOW());

-- Dữ liệu mẫu bảng DanhBaLienHe
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
(17, 'Trần Văn B', 8, 10 , 7, 3, 1, '0901000017', '0901000017', '0901000017', NOW(), NOW()),
(18, 'Trực ban Tác chiến', NULL, 11, NULL, 7, 1, '0901000018', '0901000018', '0901000018', NOW(), NOW()),
(19, 'Trực ban Phòng Tham mưu', NULL, 12, NULL, 3, 1, '0901000019', '0901000019', '0901000019', NOW(), NOW()),
(20, 'Trực ban Phòng Chính trị', NULL, 13, NULL, 5, 1, '0901000020', '0901000020', '0901000020', NOW(), NOW()),
(21, 'Phường Văn A', NULL, 6, NULL, NULL, 9, '0901000021', '0901000021', '0901000021', NOW(), NOW()),
(22, 'Phường Văn B', NULL, 6, NULL, NULL, 10, '0901000022', '0901000022', '0901000022', NOW(), NOW());

-- Dữ liệu mẫu bảng NguoiDung
INSERT INTO NguoiDung (btlhcm_nd_mand, btlhcm_nd_matkhau, btlhcm_nd_trangthai, btlhcm_nd_ngaytao, btlhcm_nd_ngaycapnhat) VALUES
('0912345678', 'admin123', TRUE, NOW(), NOW()),
('0999999999', 'user456', TRUE, NOW(), NOW());

-- Dữ liệu mẫu bảng VaiTro
INSERT INTO VaiTro (btlhcm_vt_mavt, btlhcm_vt_tenvt, btlhcm_vt_mota, btlhcm_vt_ngaytao, btlhcm_vt_ngaycapnhat) VALUES
(1, 'Quản trị hệ thống (Super Admin)', 'Quản trị hệ thống (Super Admin)', NOW(), NOW()),
(2, 'Quản trị hệ thống (Admin)', 'Quản trị hệ thống (Admin)', NOW(), NOW()),
(3, 'Quản trị viên (User)', 'Quản trị viên (User)', NOW(), NOW());

-- Dữ liệu mẫu bảng QuyenHan
INSERT INTO QuyenHan (btlhcm_qh_maqh, btlhcm_qh_tenqh, btlhcm_qh_mota, btlhcm_qh_ngaytao, btlhcm_qh_ngaycapnhat) VALUES
(1, 'Xem danh bạ', 'Quyền xem danh bạ liên hệ', NOW(), NOW()),
(2, 'Thêm danh bạ', 'Quyền thêm mới danh bạ liên hệ', NOW(), NOW()),
(3, 'Sửa danh bạ', 'Quyền sửa thông tin danh bạ liên hệ', NOW(), NOW()),
(4, 'Xóa danh bạ', 'Quyền xóa danh bạ liên hệ', NOW(), NOW()),
(5, 'Quản lý vai trò', 'Quyền quản lý vai trò', NOW(), NOW());

-- Dữ liệu mẫu bảng VaiTroNguoiDung
INSERT INTO VaiTroNguoiDung (btlhcm_vtnd_mand, btlhcm_vtnd_mavt, btlhcm_vtnd_ngaytao, btlhcm_vtnd_ngaycapnhat) VALUES
('0912345678', 1, NOW(), NOW()),
('0999999999', 2, NOW(), NOW());

-- Dữ liệu mẫu bảng QuyenHanVaiTro
INSERT INTO QuyenHanVaiTro (btlhcm_qhvt_mavt, btlhcm_qhvt_maqh, btlhcm_qhvt_ngaytao, btlhcm_qhvt_ngaycapnhat) VALUES
(1, 1, NOW(), NOW()),
(1, 2, NOW(), NOW()),
(1, 3, NOW(), NOW()),
(1, 4, NOW(), NOW()),
(1, 5, NOW(), NOW()),
(2, 1, NOW(), NOW()),
(2, 2, NOW(), NOW());

-- Dữ liệu mẫu bảng QuyenTruyCapTheoKhuVuc
INSERT INTO QuyenTruyCapTheoKhuVuc 
(btlhcm_qtckv_id, btlhcm_qtckv_mand, btlhcm_qtckv_maqk, btlhcm_qtckv_matt, btlhcm_qtckv_mapx, btlhcm_qtckv_ngaytao, btlhcm_qtckv_ngaycapnhat)
VALUES
-- User01 có quyền theo Quân khu
(1, '0912345678', 7, NULL, NULL, NOW(), NOW()),
(2, '0912345678', 7, NULL, NULL, NOW(), NOW()),

-- User02 có quyền theo Tỉnh thành
(3, '0999999999', NULL, 1, NULL, NOW(), NOW()),
(4, '0999999999', NULL, 1, NULL, NOW(), NOW());

-- User03 có quyền theo Phường/Xã
(5, '0999999999', NULL, NULL, 1, NOW(), NOW()),
(6, '0999999999', NULL, NULL, 1, NOW(), NOW());
