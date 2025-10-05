import { pool } from '../db.js'

export const getAllRoles = async (req, res) => {
  const result = await pool.query(`
    SELECT * FROM vaitro
  `)
  res.json(result.rows)
}

export const getUserPermissionByRole = async (req, res) => {
  const { btlhcm_vtnd_mand } = req.params
  const result = await pool.query(
    `
    SELECT DISTINCT qh.btlhcm_qh_tenqh
    FROM vaitronguoidung vtnd
    JOIN quyenhanvaitro qhvt 
        ON qhvt.btlhcm_qhvt_mavt = vtnd.btlhcm_vtnd_mavt
    JOIN quyenhan qh 
        ON qh.btlhcm_qh_maqh = qhvt.btlhcm_qhvt_maqh
    WHERE vtnd.btlhcm_vtnd_mand = $1;
  `,
    [btlhcm_vtnd_mand]
  )
  res.json(result.rows)
}
