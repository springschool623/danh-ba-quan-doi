-- 1. Tạo các bảng
CREATE TABLE QuanKhu (
    btlhcm_qk_maqk SERIAL PRIMARY KEY,
    btlhcm_qk_tenqk VARCHAR(100) NOT NULL UNIQUE,
    btlhcm_qk_mota TEXT,
    btlhcm_qk_ngaytao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    btlhcm_qk_ngaycapnhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE TinhThanh (
    btlhcm_tt_matt SERIAL PRIMARY KEY,
    btlhcm_tt_quankhu INT NOT NULL REFERENCES QuanKhu(btlhcm_qk_maqk) ON DELETE RESTRICT,
    btlhcm_tt_tentt VARCHAR(100) NOT NULL,
    btlhcm_tt_mota TEXT,
    btlhcm_tt_ngaytao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    btlhcm_tt_ngaycapnhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(btlhcm_tt_quankhu, btlhcm_tt_tentt)
);

CREATE TABLE PhuongXa (
    btlhcm_px_mapx SERIAL PRIMARY KEY,
    btlhcm_px_tinhthanh INT NOT NULL REFERENCES TinhThanh(btlhcm_tt_matt) ON DELETE RESTRICT,
    btlhcm_px_tenpx VARCHAR(100) NOT NULL,
    btlhcm_px_mota TEXT,
    btlhcm_px_ngaytao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    btlhcm_px_ngaycapnhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(btlhcm_px_tinhthanh, btlhcm_px_tenpx)
);

CREATE TABLE CapBac (
    btlhcm_cb_macb SERIAL PRIMARY KEY,
    btlhcm_cb_tencb VARCHAR(100) NOT NULL UNIQUE,
    btlhcm_cb_ngaytao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    btlhcm_cb_ngaycapnhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ChucVu (
    btlhcm_cv_macv SERIAL PRIMARY KEY,
    btlhcm_cv_tencv VARCHAR(100) NOT NULL UNIQUE,
    btlhcm_cv_ngaytao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    btlhcm_cv_ngaycapnhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE PhongBan (
    btlhcm_pb_mapb SERIAL PRIMARY KEY,
    btlhcm_pb_tenpb VARCHAR(100) NOT NULL UNIQUE,
    btlhcm_pb_ngaytao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    btlhcm_pb_ngaycapnhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE DonVi (
    btlhcm_dv_madv SERIAL PRIMARY KEY,
    btlhcm_dv_tendv VARCHAR(100) NOT NULL UNIQUE,
	btlhcm_dv_diachi TEXT,
    btlhcm_dv_phuong INT NOT NULL REFERENCES PhuongXa(btlhcm_px_mapx) ON DELETE RESTRICT,
    btlhcm_dv_tinhthanh INT NOT NULL REFERENCES TinhThanh(btlhcm_tt_matt) ON DELETE RESTRICT,
    btlhcm_dv_quankhu INT NOT NULL REFERENCES QuanKhu(btlhcm_qk_maqk) ON DELETE RESTRICT,
    btlhcm_dv_ngaytao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    btlhcm_dv_ngaycapnhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE DanhBaLienHe (
    btlhcm_lh_malh SERIAL PRIMARY KEY,
    btlhcm_lh_hoten VARCHAR(150) NOT NULL,
    btlhcm_lh_capbac INT REFERENCES CapBac(btlhcm_cb_macb) ON DELETE CASCADE,
    btlhcm_lh_chucvu INT REFERENCES ChucVu(btlhcm_cv_macv) ON DELETE CASCADE,
    btlhcm_lh_phongban INT REFERENCES PhongBan(btlhcm_pb_mapb) ON DELETE CASCADE,
	btlhcm_lh_donvi INT REFERENCES DonVi(btlhcm_dv_madv) ON DELETE CASCADE,
    btlhcm_lh_sdt_ds VARCHAR(20),
	btlhcm_lh_sdt_qs VARCHAR(20),
    btlhcm_lh_sdt_dd VARCHAR(20) UNIQUE,
    btlhcm_lh_ngaytao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    btlhcm_lh_ngaycapnhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE NguoiDung (
    btlhcm_nd_mand VARCHAR(50) NOT NULL PRIMARY KEY,
    btlhcm_nd_matkhau VARCHAR(20) NOT NULL,
    btlhcm_nd_trangthai BOOLEAN DEFAULT TRUE,
    btlhcm_nd_ngaytao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    btlhcm_nd_ngaycapnhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE VaiTro (
    btlhcm_vt_mavt SERIAL PRIMARY KEY,
    btlhcm_vt_tenvt VARCHAR(100) NOT NULL UNIQUE,
    btlhcm_vt_mota TEXT,
    btlhcm_vt_ngaytao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    btlhcm_vt_ngaycapnhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE QuyenHan (
    btlhcm_qh_maqh SERIAL PRIMARY KEY,
    btlhcm_qh_tenqh VARCHAR(100) NOT NULL UNIQUE,
    btlhcm_qh_mota TEXT,
    btlhcm_qh_ngaytao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    btlhcm_qh_ngaycapnhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE VaiTroNguoiDung (
    btlhcm_vtnd_mand VARCHAR(50) NOT NULL REFERENCES NguoiDung(btlhcm_nd_mand) ON DELETE CASCADE,
    btlhcm_vtnd_mavt INT NOT NULL REFERENCES VaiTro(btlhcm_vt_mavt) ON DELETE CASCADE,
    btlhcm_vtnd_ngaytao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    btlhcm_vtnd_ngaycapnhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(btlhcm_vtnd_mand, btlhcm_vtnd_mavt)
);

CREATE TABLE QuyenHanVaiTro (
    btlhcm_qhvt_mavt INT NOT NULL REFERENCES VaiTro(btlhcm_vt_mavt) ON DELETE CASCADE,
    btlhcm_qhvt_maqh INT NOT NULL REFERENCES QuyenHan(btlhcm_qh_maqh) ON DELETE CASCADE,
    btlhcm_qhvt_ngaytao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    btlhcm_qhvt_ngaycapnhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(btlhcm_qhvt_mavt, btlhcm_qhvt_maqh)
);

CREATE TABLE QuyenTruyCapTheoKhuVuc (
    btlhcm_qtckv_id SERIAL PRIMARY KEY,
    btlhcm_qtckv_mand VARCHAR(50) NOT NULL REFERENCES NguoiDung(btlhcm_nd_mand) ON DELETE CASCADE,
    btlhcm_qtckv_maqk INT REFERENCES QuanKhu(btlhcm_qk_maqk) ON DELETE CASCADE,
    btlhcm_qtckv_matt INT REFERENCES TinhThanh(btlhcm_tt_matt) ON DELETE CASCADE,
    btlhcm_qtckv_mapx INT REFERENCES PhuongXa(btlhcm_px_mapx) ON DELETE CASCADE,
    btlhcm_qtckv_ngaytao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    btlhcm_qtckv_ngaycapnhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (
        btlhcm_qtckv_maqk IS NOT NULL 
        OR btlhcm_qtckv_matt IS NOT NULL 
        OR btlhcm_qtckv_mapx IS NOT NULL
    )
);

DROP TABLE IF EXISTS QuanKhu, TinhThanh, PhuongXa, CapBac, ChucVu, PhongBan, DonVi, DanhBaLienHe, NguoiDung, VaiTro, QuyenHan, VaiTroNguoiDung, QuyenHanVaiTro, QuyenTruyCapTheoKhuVuc;