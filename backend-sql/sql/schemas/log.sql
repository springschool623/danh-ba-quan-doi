-- =====================================================
-- SCHEMA: LOG (AUDIT LOG)
-- =====================================================

CREATE TABLE IF NOT EXISTS log (
    btlhcm_log_id SERIAL PRIMARY KEY,
    btlhcm_log_mand VARCHAR(50) REFERENCES nguoidung(btlhcm_nd_mand) ON DELETE SET NULL,
    btlhcm_log_vaitro VARCHAR(100),
    btlhcm_log_hanhdong VARCHAR(50) NOT NULL, -- CREATE, READ, UPDATE, DELETE, IMPORT, EXPORT
    btlhcm_log_bang VARCHAR(50) NOT NULL, -- danhbalienhe, donvi, phuongxa, etc.
    btlhcm_log_maid INT, -- ID của bản ghi bị thay đổi
    btlhcm_log_tenbang VARCHAR(100), -- Tên hiển thị của bản ghi (ví dụ: "Nguyễn Văn A")
    btlhcm_log_chitiet TEXT, -- Chi tiết thay đổi (JSON hoặc text mô tả)
    btlhcm_log_soluong INT, -- Số lượng bản ghi (dùng cho bulk operations)
    btlhcm_log_ngaytao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo index cho các cột thường được tìm kiếm
CREATE INDEX IF NOT EXISTS idx_log_mand ON log(btlhcm_log_mand);
CREATE INDEX IF NOT EXISTS idx_log_hanhdong ON log(btlhcm_log_hanhdong);
CREATE INDEX IF NOT EXISTS idx_log_bang ON log(btlhcm_log_bang);
CREATE INDEX IF NOT EXISTS idx_log_ngaytao ON log(btlhcm_log_ngaytao);
CREATE INDEX IF NOT EXISTS idx_log_vaitro ON log(btlhcm_log_vaitro);

-- Comment cho bảng và các cột
COMMENT ON TABLE log IS 'Bảng lưu trữ nhật ký hoạt động của hệ thống';
COMMENT ON COLUMN log.btlhcm_log_id IS 'ID log (Primary Key)';
COMMENT ON COLUMN log.btlhcm_log_mand IS 'Mã người dùng thực hiện thao tác (Foreign Key)';
COMMENT ON COLUMN log.btlhcm_log_vaitro IS 'Vai trò của người dùng khi thực hiện thao tác';
COMMENT ON COLUMN log.btlhcm_log_hanhdong IS 'Hành động được thực hiện (CREATE, READ, UPDATE, DELETE, IMPORT, EXPORT)';
COMMENT ON COLUMN log.btlhcm_log_bang IS 'Bảng dữ liệu bị thay đổi';
COMMENT ON COLUMN log.btlhcm_log_maid IS 'ID của bản ghi bị thay đổi';
COMMENT ON COLUMN log.btlhcm_log_tenbang IS 'Tên hiển thị của bản ghi';
COMMENT ON COLUMN log.btlhcm_log_chitiet IS 'Chi tiết thay đổi (JSON hoặc text mô tả)';
COMMENT ON COLUMN log.btlhcm_log_soluong IS 'Số lượng bản ghi (dùng cho bulk operations)';
COMMENT ON COLUMN log.btlhcm_log_ngaytao IS 'Thời gian thực hiện thao tác';

