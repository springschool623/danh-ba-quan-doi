import { pool } from '../db.js'
import * as XLSX from 'xlsx'
import fs from 'fs'
import { getIdByName, normalizeKey } from '../utils.js'
import { CONTACTS_COLUMN_MAP } from '../constants.js'

// Lấy tất cả danh bạ
export const getAllContacts = async (req, res) => {
  const result = await pool.query(`
    SELECT db.*, cb.btlhcm_cb_tencb, cv.btlhcm_cv_tencv, pb.btlhcm_pb_tenpb, 
           ba.btlhcm_ba_tenb, dv.btlhcm_dv_tendv, dv.btlhcm_dv_diachi
    FROM danhbalienhe db 
    LEFT JOIN capbac cb ON db.btlhcm_lh_capbac = cb.btlhcm_cb_macb
    LEFT JOIN chucvu cv ON db.btlhcm_lh_chucvu = cv.btlhcm_cv_macv
    LEFT JOIN phong pb ON db.btlhcm_lh_phong = pb.btlhcm_pb_mapb
    LEFT JOIN ban ba ON db.btlhcm_lh_ban = ba.btlhcm_ba_mab
    LEFT JOIN donvi dv ON db.btlhcm_lh_donvi = dv.btlhcm_dv_madv
    ORDER BY db.btlhcm_lh_malh ASC
  `)

  // thêm prefix URL cho ảnh
  const contacts = result.rows.map((row) => ({
    ...row,
    btlhcm_lh_hinhanh: row.btlhcm_lh_hinhanh
      ? `${req.protocol}://${req.get('host')}${row.btlhcm_lh_hinhanh}`
      : null,
  }))

  res.json(contacts)
}

// Lấy danh bạ theo Cấp Quân Khu
export const getContactsByMilitaryRegion = async (req, res) => {
  const { region } = req.query
  const result = await pool.query(
    `
    SELECT db.*, cb.btlhcm_cb_tencb, cv.btlhcm_cv_tencv, pb.btlhcm_pb_tenpb, ba.btlhcm_ba_tenb, dv.btlhcm_dv_tendv, qk.btlhcm_qk_tenqk, dv.btlhcm_dv_diachi
    FROM danhbalienhe db 
    LEFT JOIN capbac cb ON db.btlhcm_lh_capbac = cb.btlhcm_cb_macb
    LEFT JOIN chucvu cv ON db.btlhcm_lh_chucvu = cv.btlhcm_cv_macv
    LEFT JOIN phong pb ON db.btlhcm_lh_phong = pb.btlhcm_pb_mapb
    LEFT JOIN ban ba ON db.btlhcm_lh_ban = ba.btlhcm_ba_mab
    LEFT JOIN donvi dv ON db.btlhcm_lh_donvi = dv.btlhcm_dv_madv
    LEFT JOIN quankhu qk ON dv.btlhcm_dv_quankhu = qk.btlhcm_qk_maqk
    WHERE qk.btlhcm_qk_maqk = $1
    ORDER BY db.btlhcm_lh_malh ASC
  `,
    [region]
  )
  res.json(result.rows)
}

// Lấy danh bạ theo Cấp Tỉnh
export const getContactsByProvince = async (req, res) => {
  const { province } = req.query
  const result = await pool.query(
    `
    SELECT db.*, cb.btlhcm_cb_tencb, cv.btlhcm_cv_tencv, pb.btlhcm_pb_tenpb, ba.btlhcm_ba_tenb, dv.btlhcm_dv_tendv, tt.btlhcm_tt_tentt, dv.btlhcm_dv_diachi
    FROM danhbalienhe db 
    LEFT JOIN capbac cb ON db.btlhcm_lh_capbac = cb.btlhcm_cb_macb
    LEFT JOIN chucvu cv ON db.btlhcm_lh_chucvu = cv.btlhcm_cv_macv
    LEFT JOIN phong pb ON db.btlhcm_lh_phong = pb.btlhcm_pb_mapb
    LEFT JOIN ban ba ON db.btlhcm_lh_ban = ba.btlhcm_ba_mab
    LEFT JOIN donvi dv ON db.btlhcm_lh_donvi = dv.btlhcm_dv_madv
    LEFT JOIN tinhthanh tt ON dv.btlhcm_dv_tinhthanh = tt.btlhcm_tt_matt
    WHERE dv.btlhcm_dv_tinhthanh = $1
    ORDER BY db.btlhcm_lh_malh ASC
  `,
    [province]
  )
  res.json(result.rows)
}

// Lấy danh bạ theo Cấp Phường
export const getContactsByWard = async (req, res) => {
  const { ward } = req.query
  const result = await pool.query(
    `
    SELECT db.*, cb.btlhcm_cb_tencb, cv.btlhcm_cv_tencv, pb.btlhcm_pb_tenpb, ba.btlhcm_ba_tenb, dv.btlhcm_dv_tendv, px.btlhcm_px_tenpx, dv.btlhcm_dv_diachi
    FROM danhbalienhe db 
    LEFT JOIN capbac cb ON db.btlhcm_lh_capbac = cb.btlhcm_cb_macb
    LEFT JOIN chucvu cv ON db.btlhcm_lh_chucvu = cv.btlhcm_cv_macv
    LEFT JOIN phong pb ON db.btlhcm_lh_phong = pb.btlhcm_pb_mapb
    LEFT JOIN ban ba ON db.btlhcm_lh_ban = ba.btlhcm_ba_mab
    LEFT JOIN donvi dv ON db.btlhcm_lh_donvi = dv.btlhcm_dv_madv
    LEFT JOIN phuongxa px ON dv.btlhcm_dv_phuong = px.btlhcm_px_mapx
    WHERE px.btlhcm_px_mapx = $1
    ORDER BY db.btlhcm_lh_malh ASC
  `,
    [ward]
  )
  res.json(result.rows)
}

// Thêm danh bạ
export const addContact = async (req, res) => {
  const {
    btlhcm_lh_hoten,
    btlhcm_lh_capbac,
    btlhcm_lh_chucvu,
    btlhcm_lh_phong,
    btlhcm_lh_ban,
    btlhcm_lh_donvi,
    btlhcm_lh_sdt_ds,
    btlhcm_lh_sdt_qs,
    btlhcm_lh_sdt_fax,
    btlhcm_lh_sdt_dd,
  } = req.body

  const result = await pool.query(
    'INSERT INTO danhbalienhe (btlhcm_lh_hoten, btlhcm_lh_capbac, btlhcm_lh_chucvu, btlhcm_lh_phong, btlhcm_lh_ban, btlhcm_lh_donvi, btlhcm_lh_sdt_ds, btlhcm_lh_sdt_qs, btlhcm_lh_sdt_fax, btlhcm_lh_sdt_dd, btlhcm_lh_ngaytao, btlhcm_lh_ngaycapnhat) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',
    [
      btlhcm_lh_hoten,
      btlhcm_lh_capbac || null,
      btlhcm_lh_chucvu || null,
      btlhcm_lh_phong || null,
      btlhcm_lh_ban || null,
      btlhcm_lh_donvi || null,
      btlhcm_lh_sdt_ds || null,
      btlhcm_lh_sdt_qs || null,
      btlhcm_lh_sdt_fax || null,
      btlhcm_lh_sdt_dd || null,
      new Date(),
      new Date(),
    ]
  )
  res.json(result.rows)
}

// Cập nhật danh bạ
export const updateContact = async (req, res) => {
  const { btlhcm_lh_malh } = req.params
  const {
    btlhcm_lh_hoten,
    btlhcm_lh_capbac,
    btlhcm_lh_chucvu,
    btlhcm_lh_phong,
    btlhcm_lh_ban,
    btlhcm_lh_donvi,
    btlhcm_lh_sdt_fax,
    btlhcm_lh_sdt_ds,
    btlhcm_lh_sdt_qs,
    btlhcm_lh_sdt_dd,
  } = req.body
  const result = await pool.query(
    'UPDATE danhbalienhe SET btlhcm_lh_hoten = $1, btlhcm_lh_capbac = $2, btlhcm_lh_chucvu = $3, btlhcm_lh_phong = $4, btlhcm_lh_ban = $5, btlhcm_lh_donvi = $6, btlhcm_lh_sdt_ds = $7, btlhcm_lh_sdt_qs = $8, btlhcm_lh_sdt_fax = $9, btlhcm_lh_sdt_dd = $10, btlhcm_lh_ngaycapnhat = $11 WHERE btlhcm_lh_malh = $12',
    [
      btlhcm_lh_hoten,
      btlhcm_lh_capbac,
      btlhcm_lh_chucvu,
      btlhcm_lh_phong,
      btlhcm_lh_ban,
      btlhcm_lh_donvi,
      btlhcm_lh_sdt_ds,
      btlhcm_lh_sdt_qs,
      btlhcm_lh_sdt_fax,
      btlhcm_lh_sdt_dd,
      new Date(),
      btlhcm_lh_malh,
    ]
  )
  res.json(result.rows)
}

// Xoá danh bạ
export const deleteContact = async (req, res) => {
  const { btlhcm_lh_malh } = req.params
  const result = await pool.query(
    'DELETE FROM danhbalienhe WHERE btlhcm_lh_malh = $1',
    [btlhcm_lh_malh]
  )
  res.json(result.rows)
}

//Nhập danh bạ từ file Excel
// export const importContactsFromExcel = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: 'Không có file upload' })
//     }

//     const filePath = req.file.path
//     // console.log('Uploaded file:', filePath)

//     // Đọc file Excel qua buffer
//     const fileBuffer = fs.readFileSync(filePath)
//     const workbook = XLSX.read(fileBuffer, { type: 'buffer' })
//     const worksheet = workbook.Sheets[workbook.SheetNames[0]]
//     const data = XLSX.utils.sheet_to_json(worksheet)

//     console.log('Excel data:', data)

//     // console.log('Excel data:', data)

//     for (const row of data) {
//       const hoten = row[CONTACTS_COLUMN_MAP['hoten']]
//       const capbacId = await getIdByName(
//         'btlhcm_cb_macb',
//         'capbac',
//         'btlhcm_cb_tencb',
//         row[CONTACTS_COLUMN_MAP['capbac']]
//       )
//       const chucvuId = await getIdByName(
//         'btlhcm_cv_macv',
//         'chucvu',
//         'btlhcm_cv_tencv',
//         row[CONTACTS_COLUMN_MAP['chucvu']]
//       )
//       const phongId = await getIdByName(
//         'btlhcm_pb_mapb',
//         'phong',
//         'btlhcm_pb_tenpb',
//         row[CONTACTS_COLUMN_MAP['phong']]
//       )
//       const banId = await getIdByName(
//         'btlhcm_ba_mab',
//         'ban',
//         'btlhcm_ba_tenb',
//         row['CƠ QUAN']
//       )
//       const donviId = await getIdByName(
//         'btlhcm_dv_madv',
//         'donvi',
//         'btlhcm_dv_tendv',
//         row['ĐƠN VỊ']
//       )

//       const sdtDs = row['SĐT DÂN SỰ']
//       const sdtQs = row['SĐT QUÂN SỰ']
//       const sdtDd = row['SĐT DI ĐỘNG']
//       const sdtFax = row['SỐ FAX']
//       console.log({
//         hoten,
//         capbacId,
//         chucvuId,
//         phongId,
//         banId,
//         donviId,
//         sdtDs,
//         sdtQs,
//         sdtDd,
//       })

//       await pool.query(
//         `INSERT INTO danhbalienhe (
//       btlhcm_lh_hoten, btlhcm_lh_capbac, btlhcm_lh_chucvu,
//       btlhcm_lh_phong, btlhcm_lh_ban, btlhcm_lh_donvi,
//       btlhcm_lh_sdt_ds, btlhcm_lh_sdt_qs, btlhcm_lh_sdt_dd, btlhcm_lh_sdt_fax
//     ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
//         [
//           hoten,
//           capbacId,
//           chucvuId,
//           phongId,
//           banId,
//           donviId,
//           sdtDs,
//           sdtQs,
//           sdtDd,
//           sdtFax,
//         ]
//       )
//     }

//     // Xoá file tạm
//     fs.unlinkSync(filePath)

//     res.json({ success: true, imported: data.length })
//   } catch (error) {
//     console.error(error)
//     res.status(500).json({ error: 'Lỗi khi import Excel' })
//   }
// }

// Xuất Excel
export const exportExcel = async (req, res) => {
  try {
    const result = await pool.query(`
    SELECT db.*, cb.btlhcm_cb_tencb, cv.btlhcm_cv_tencv, pb.btlhcm_pb_tenpb, ba.btlhcm_ba_tenb, dv.btlhcm_dv_tendv, dv.btlhcm_dv_diachi
    FROM danhbalienhe db 
    LEFT JOIN capbac cb ON db.btlhcm_lh_capbac = cb.btlhcm_cb_macb
    LEFT JOIN chucvu cv ON db.btlhcm_lh_chucvu = cv.btlhcm_cv_macv
    LEFT JOIN phong pb ON db.btlhcm_lh_phong = pb.btlhcm_pb_mapb
    LEFT JOIN ban ba ON db.btlhcm_lh_ban = ba.btlhcm_ba_mab
    LEFT JOIN donvi dv ON db.btlhcm_lh_donvi = dv.btlhcm_dv_madv
    ORDER BY db.btlhcm_lh_malh ASC
  `)
    // Chuyển dữ liệu query thành mảng object
    const data = result.rows.map((row) => ({
      STT: row.btlhcm_lh_malh,
      'HỌ TÊN': row.btlhcm_lh_hoten,
      'CẤP BẬC': row.btlhcm_cb_tencb,
      'CHỨC VỤ': row.btlhcm_cv_tencv,
      'CƠ QUAN': row.btlhcm_ba_tenb,
      PHÒNG: row.btlhcm_pb_tenpb,
      'ĐƠN VỊ': row.btlhcm_dv_tendv,
      'ĐỊA CHỈ': row.btlhcm_dv_diachi,
      'SĐT DÂN SỰ': row.btlhcm_lh_sdt_ds,
      'SĐT QUÂN SỰ': row.btlhcm_lh_sdt_qs,
      'SĐT DI ĐỘNG': row.btlhcm_lh_sdt_dd,
      'SỐ FAX': row.btlhcm_lh_sdt_fax,
    }))

    // Tạo worksheet từ json
    const worksheet = XLSX.utils.json_to_sheet(data)

    // Tạo workbook
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh bạ liên hệ')

    // Ghi ra buffer (dạng Excel)
    const buffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'buffer',
    })

    // Gửi file về client
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="danhba_btlhcm.xlsx"'
    )
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    res.send(buffer)
  } catch (err) {
    console.error('❌ Lỗi xuất Excel:', err)
    res.status(500).json({ message: 'Lỗi xuất Excel' })
  }
}

// Xuất VCard
export const exportVcard = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT db.*, cb.btlhcm_cb_tencb, cv.btlhcm_cv_tencv, pb.btlhcm_pb_tenpb, 
             ba.btlhcm_ba_tenb, dv.btlhcm_dv_tendv, dv.btlhcm_dv_diachi
      FROM danhbalienhe db 
      LEFT JOIN capbac cb ON db.btlhcm_lh_capbac = cb.btlhcm_cb_macb
      LEFT JOIN chucvu cv ON db.btlhcm_lh_chucvu = cv.btlhcm_cv_macv
      LEFT JOIN phong pb ON db.btlhcm_lh_phong = pb.btlhcm_pb_mapb
      LEFT JOIN ban ba ON db.btlhcm_lh_ban = ba.btlhcm_ba_mab
      LEFT JOIN donvi dv ON db.btlhcm_lh_donvi = dv.btlhcm_dv_madv
      ORDER BY db.btlhcm_lh_malh ASC
    `)

    // Tạo nội dung VCF
    let vcfContent = result.rows
      .map((row) => {
        return [
          'BEGIN:VCARD',
          'VERSION:3.0',
          `FN:${row.btlhcm_lh_hoten}`,
          `ORG:${row.btlhcm_dv_tendv || ''}`,
          `TITLE:${row.btlhcm_cv_tencv || ''}`,
          `TEL;TYPE=work,voice:${row.btlhcm_lh_sdt_ds || ''}`,
          `TEL;TYPE=other,voice:${row.btlhcm_lh_sdt_qs || ''}`,
          `TEL;TYPE=cell,voice:${row.btlhcm_lh_sdt_dd || ''}`,
          `TEL;TYPE=fax,voice:${row.btlhcm_lh_sdt_fax || ''}`,
          `PHOTO;TYPE=jpeg:${row.btlhcm_lh_hinhanh || ''}`,
          `ADR;TYPE=work:;;${row.btlhcm_dv_diachi || ''}`,
          'END:VCARD',
        ]
          .filter(Boolean)
          .join('\n')
      })
      .join('\n\n')

    res.setHeader('Content-Type', 'text/vcard; charset=utf-8')
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="danhba_btlhcm.vcf"'
    )
    res.status(200).send(vcfContent)
  } catch (err) {
    console.error('❌ Lỗi export VCard:', err)
    res.status(500).json({ message: 'Lỗi export VCard' })
  }
}

export const importContactsFromExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Không có file upload' })
    }

    const filePath = req.file.path

    // Đọc file Excel
    const fileBuffer = fs.readFileSync(filePath)
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' })
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]

    // Lấy raw data: mảng 2D
    const rawData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: '',
    })

    if (rawData.length < 2) {
      return res.status(400).json({ error: 'File Excel không có dữ liệu' })
    }

    // Hàng đầu tiên là header
    const headers = rawData[0].map((h) => normalizeKey(h))
    console.log('headers', headers)

    // Convert thành mảng object với key chuẩn
    const rows = rawData.slice(1).map((row) => {
      const obj = {}
      headers.forEach((h, i) => {
        if (CONTACTS_COLUMN_MAP[h]) {
          obj[CONTACTS_COLUMN_MAP[h]] = row[i]
        }
      })
      return obj
    })

    console.log('Excel rows:', rows)

    let importedCount = 0

    for (const row of rows) {
      if (!row.hoten) continue

      const hoten = row.hoten

      const capbacId = await getIdByName(
        'btlhcm_cb_macb',
        'capbac',
        'btlhcm_cb_tencb',
        row.capbac
      )

      const chucvuId = await getIdByName(
        'btlhcm_cv_macv',
        'chucvu',
        'btlhcm_cv_tencv',
        row.chucvu
      )

      const phongId = await getIdByName(
        'btlhcm_pb_mapb',
        'phong',
        'btlhcm_pb_tenpb',
        row.phong
      )

      const banId = await getIdByName(
        'btlhcm_ba_mab',
        'ban',
        'btlhcm_ba_tenb',
        row.ban
      )

      const donviId = await getIdByName(
        'btlhcm_dv_madv',
        'donvi',
        'btlhcm_dv_tendv',
        row.donvi
      )

      const sdtDs = row.sdtDs
      const sdtQs = row.sdtQs
      const sdtDd = row.sdtDd
      const sdtFax = row.sdtFax

      console.log({
        hoten,
        capbacId,
        chucvuId,
        phongId,
        banId,
        donviId,
        sdtDs,
        sdtQs,
        sdtDd,
        sdtFax,
      })

      await pool.query(
        `INSERT INTO danhbalienhe (
          btlhcm_lh_hoten, btlhcm_lh_capbac, btlhcm_lh_chucvu,
          btlhcm_lh_phong, btlhcm_lh_ban, btlhcm_lh_donvi,
          btlhcm_lh_sdt_ds, btlhcm_lh_sdt_qs, btlhcm_lh_sdt_dd, btlhcm_lh_sdt_fax
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        [
          hoten,
          capbacId,
          chucvuId,
          phongId,
          banId,
          donviId,
          sdtDs,
          sdtQs,
          sdtDd,
          sdtFax,
        ]
      )

      importedCount++
    }

    // Xoá file tạm
    fs.unlinkSync(filePath)

    res.json({ success: true, imported: importedCount })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Lỗi khi import Excel' })
  }
}
