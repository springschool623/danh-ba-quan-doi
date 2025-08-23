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
(1, 1, 'Hà Nội', 'Thành phố Hà Nội', NOW(), NOW()),
(2, 1, 'TP.HCM', 'Thành phố Hồ Chí Minh', NOW(), NOW()),
(3, 1, 'Hà Tĩnh', 'Tỉnh Hà Tĩnh', NOW(), NOW()),
(4, 1, 'Hà Giang', 'Tỉnh Hà Giang', NOW(), NOW());

-- Dữ liệu mẫu bảng PhuongXa
INSERT INTO PhuongXa (btlhcm_px_mapx, btlhcm_px_tinhthanh, btlhcm_px_tenpx, btlhcm_px_mota, btlhcm_px_ngaytao, btlhcm_px_ngaycapnhat) VALUES
(1, 1, 'Ba Đình', 'Phường Ba Đình', NOW(), NOW()),
(2, 1, 'Hoàn Kiếm', 'Phường Hoàn Kiếm', NOW(), NOW()),
(3, 1, 'Tây Hồ', 'Phường Tây Hồ', NOW(), NOW()),
(4, 1, 'Hồng Bàng', 'Phường Hồng Bàng', NOW(), NOW()),
(5, 1, 'Cầu Giấy', 'Phường Cầu Giấy', NOW(), NOW()),
(6, 2, 'Bình Thạnh', 'Phường Bình Thạnh', NOW(), NOW()),
(7, 2, 'Bình Phú', 'Phường Bình Phú', NOW(), NOW()),
(8, 2, 'Thạnh Mỹ Tây', 'Phường Thạnh Mỹ Tây', NOW(), NOW()),
(9, 2, 'Hòa Hưng', 'Phường Hòa Hưng', NOW(), NOW());


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
(2, 'Phó Tư lệnh', NOW(), NOW()),
(3, 'Phó Tư lệnh - TMT', NOW(), NOW()),
(4, 'Chính ủy', NOW(), NOW()),
(5, 'Phó Chính ủy', NOW(), NOW()),
(6, 'Chỉ huy trưởng', NOW(), NOW()),
(7, 'Phó CHT', NOW(), NOW()),
(8, 'Chính trị viên', NOW(), NOW()),
(9, 'Phó Chính trị viên', NOW(), NOW()),
(10, 'Trưởng phòng', NOW(), NOW()),
(11, 'Phó Trưởng phòng', NOW(), NOW()),
(12, 'Phó CHT - TMT', NOW(), NOW()),
(13, 'Phó TMT', NOW(), NOW()),
(14, 'Trợ lý', NOW(), NOW()),
(15, 'Nhân viên', NOW(), NOW());

-- Dữ liệu mẫu bảng PhongBan
INSERT INTO PhongBan (btlhcm_pb_mapb, btlhcm_pb_tenpb, btlhcm_pb_ngaytao, btlhcm_pb_ngaycapnhat) VALUES
(1, 'Phòng Tư lệnh', NOW(), NOW()),
(2, 'Phòng Hành chính', NOW(), NOW()),
(3, 'Phòng Kỹ thuật', NOW(), NOW()),
(4, 'Phòng Tài chính', NOW(), NOW()),
(5, 'Phòng Chính trị', NOW(), NOW());

-- Dữ liệu mẫu bảng DonVi
INSERT INTO DonVi (btlhcm_dv_madv, btlhcm_dv_tendv, btlhcm_dv_diachi, btlhcm_dv_phuong, btlhcm_dv_tinhthanh, btlhcm_dv_quankhu, btlhcm_dv_ngaytao, btlhcm_dv_ngaycapnhat) VALUES
(1, 'Bộ Tư Lệnh TPHCM', '123 Đường Cách Mạng Tháng 8, Phường Hòa Hưng, TP.Hồ Chí Minh', 9, 2, 7, NOW(), NOW()),
(2, 'BCHQS Phường Bình Phú', '223 Đường Chợ Lớn, Phường Bình Phú, TP.Hồ Chí Minh', 7, 2, 7, NOW(), NOW()),
(3, 'BCHQS Phường Bình Thạnh', '323 Đường Lê Văn Việt, Phường Bình Thạnh, TP.Hồ Chí Minh', 6, 2, 7, NOW(), NOW()),
(4, 'BCHQS Phường Thạnh Mỹ Tây', '423 Đường Lê Văn Việt, Phường Thạnh Mỹ Tây, TP.Hồ Chí Minh', 8, 2, 7, NOW(), NOW()),
(5, 'BCHQS Phường Cầu Giấy', '523 Đường Lê Văn Việt, Phường Cầu Giấy, TP.Hà Nội', 5, 1, 1, NOW(), NOW());

-- Dữ liệu mẫu bảng DanhBaLienHe
INSERT INTO DanhBaLienHe (btlhcm_lh_malh, btlhcm_lh_hoten, btlhcm_lh_capbac, btlhcm_lh_chucvu, btlhcm_lh_phongban, btlhcm_lh_donvi, btlhcm_lh_sdt_ds, btlhcm_lh_sdt_qs, btlhcm_lh_sdt_dd, btlhcm_lh_ngaytao, btlhcm_lh_ngaycapnhat) VALUES
(1, 'Nguyễn Văn A', 1, 1, 1, 1, '0901000001', '0901000001', '0901000001', NOW(), NOW()),
(2, 'Trần Văn B', 2, 2, 2, 2, '0901000002', '0901000002', '0901000002', NOW(), NOW()),
(3, 'Lê Văn C', 3, 3, 3, 3, '0901000003', '0901000003', '0901000003', NOW(), NOW()),
(4, 'Phạm Văn D', 4, 4, 4, 4, '0901000004', '0901000004', '0901000004', NOW(), NOW()),
(5, 'Nguyễn Thị E', 5, 5, 5, 5, '0901000005', '0901000005', '0901000005', NOW(), NOW());

-- Dữ liệu mẫu bảng NguoiDung
INSERT INTO NguoiDung (btlhcm_nd_mand, btlhcm_nd_matkhau, btlhcm_nd_trangthai, btlhcm_nd_ngaytao, btlhcm_nd_ngaycapnhat) VALUES
('0912345678', 'admin123', TRUE, NOW(), NOW()),
('0999999999', 'user456', TRUE, NOW(), NOW());

-- Dữ liệu mẫu bảng VaiTro
INSERT INTO VaiTro (btlhcm_vt_mavt, btlhcm_vt_tenvt, btlhcm_vt_mota, btlhcm_vt_ngaytao, btlhcm_vt_ngaycapnhat) VALUES
(1, 'Quản trị hệ thống', 'Quản trị hệ thống', NOW(), NOW()),
(2, 'Quản trị viên', 'Quản trị viên', NOW(), NOW());

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
(1, '0912345678', 1, NULL, NULL, NOW(), NOW()),
(2, '0912345678', 2, NULL, NULL, NOW(), NOW()),

-- User02 có quyền theo Tỉnh thành
(3, '0999999999', NULL, 1, NULL, NOW(), NOW()),
(4, '0999999999', NULL, 2, NULL, NOW(), NOW());
