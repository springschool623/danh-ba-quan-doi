-- =====================================================
-- SCHEMA: QUYEN TRUY CAP THEO KHU VUC (AREA-BASED ACCESS CONTROL)
-- =====================================================

CREATE TABLE IF NOT EXISTS QuyenTruyCapTheoKhuVuc (
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

-- Tạo index cho các cột thường được tìm kiếm
CREATE INDEX idx_quyentruycap_mand ON QuyenTruyCapTheoKhuVuc(btlhcm_qtckv_mand);
CREATE INDEX idx_quyentruycap_maqk ON QuyenTruyCapTheoKhuVuc(btlhcm_qtckv_maqk);
CREATE INDEX idx_quyentruycap_matt ON QuyenTruyCapTheoKhuVuc(btlhcm_qtckv_matt);
CREATE INDEX idx_quyentruycap_mapx ON QuyenTruyCapTheoKhuVuc(btlhcm_qtckv_mapx);

-- Comment cho bảng và các cột
COMMENT ON TABLE QuyenTruyCapTheoKhuVuc IS 'Bảng lưu trữ quyền truy cập theo khu vực địa lý';
COMMENT ON COLUMN QuyenTruyCapTheoKhuVuc.btlhcm_qtckv_id IS 'ID quyền truy cập (Primary Key)';
COMMENT ON COLUMN QuyenTruyCapTheoKhuVuc.btlhcm_qtckv_mand IS 'Mã người dùng (Foreign Key)';
COMMENT ON COLUMN QuyenTruyCapTheoKhuVuc.btlhcm_qtckv_maqk IS 'Mã quân khu (Foreign Key) - NULL nếu không giới hạn theo quân khu';
COMMENT ON COLUMN QuyenTruyCapTheoKhuVuc.btlhcm_qtckv_matt IS 'Mã tỉnh thành (Foreign Key) - NULL nếu không giới hạn theo tỉnh thành';
COMMENT ON COLUMN QuyenTruyCapTheoKhuVuc.btlhcm_qtckv_mapx IS 'Mã phường xã (Foreign Key) - NULL nếu không giới hạn theo phường xã';
COMMENT ON COLUMN QuyenTruyCapTheoKhuVuc.btlhcm_qtckv_ngaytao IS 'Ngày tạo bản ghi';
COMMENT ON COLUMN QuyenTruyCapTheoKhuVuc.btlhcm_qtckv_ngaycapnhat IS 'Ngày cập nhật bản ghi';

-- Giải thích về ràng buộc CHECK
COMMENT ON CONSTRAINT QuyenTruyCapTheoKhuVuc_check ON QuyenTruyCapTheoKhuVuc IS 
'Đảm bảo ít nhất một trong ba cột khu vực (quân khu, tỉnh thành, phường xã) phải có giá trị';
