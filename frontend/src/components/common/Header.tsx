import React from 'react'
import Image from 'next/image'

export function Header() {
  return (
    <div className="w-full h-[100px] bg-green-800 border-gray-200 py-4 px-6 flex items-center">
      <div className="max-w-7xl flex items-center gap-4 px-10">
        <Image
          src="/logo/logo_btl_tphcm.png"
          alt="logo"
          width={80}
          height={80}
          className=" object-contain"
        />
        <h2 className="text-xl font-semibold text-white">
          Phần mềm Quản lý danh bạ và địa chỉ đơn vị LLVT Thành phố Hồ Chí Minh
        </h2>
      </div>
    </div>
  )
}
