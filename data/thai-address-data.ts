interface AddressEntry {
  district: string
  amphoe: string
  province: string
}

const addressDatabase: AddressEntry[] = [
  { district: 'จตุจักร', amphoe: 'จตุจักร', province: 'กรุงเทพมหานคร' },
  { district: 'ลาดยาว', amphoe: 'จตุจักร', province: 'กรุงเทพมหานคร' },
  { district: 'เสนานิคม', amphoe: 'จตุจักร', province: 'กรุงเทพมหานคร' },
  { district: 'คลองเตยเหนือ', amphoe: 'วัฒนา', province: 'กรุงเทพมหานคร' },
  { district: 'คลองตันเหนือ', amphoe: 'วัฒนา', province: 'กรุงเทพมหานคร' },
  { district: 'พระโขนงเหนือ', amphoe: 'วัฒนา', province: 'กรุงเทพมหานคร' },
  { district: 'สีลม', amphoe: 'บางรัก', province: 'กรุงเทพมหานคร' },
  { district: 'สุริยวงศ์', amphoe: 'บางรัก', province: 'กรุงเทพมหานคร' },
  { district: 'บางรัก', amphoe: 'บางรัก', province: 'กรุงเทพมหานคร' },

  { district: 'ศรีภูมิ', amphoe: 'เมืองเชียงใหม่', province: 'เชียงใหม่' },
  { district: 'ช้างเผือก', amphoe: 'เมืองเชียงใหม่', province: 'เชียงใหม่' },
  { district: 'สุเทพ', amphoe: 'เมืองเชียงใหม่', province: 'เชียงใหม่' },
  { district: 'สันกำแพง', amphoe: 'สันกำแพง', province: 'เชียงใหม่' },
  { district: 'ทรายมูล', amphoe: 'สันกำแพง', province: 'เชียงใหม่' },

  { district: 'ตลาดใหญ่', amphoe: 'เมืองภูเก็ต', province: 'ภูเก็ต' },
  { district: 'ตลาดเหนือ', amphoe: 'เมืองภูเก็ต', province: 'ภูเก็ต' },
  { district: 'กะทู้', amphoe: 'กะทู้', province: 'ภูเก็ต' },
  { district: 'ป่าตอง', amphoe: 'กะทู้', province: 'ภูเก็ต' },

  { district: 'บางปลาสร้อย', amphoe: 'เมืองชลบุรี', province: 'ชลบุรี' },
  { district: 'มะขามหย่ง', amphoe: 'เมืองชลบุรี', province: 'ชลบุรี' },
  { district: 'ศรีราชา', amphoe: 'ศรีราชา', province: 'ชลบุรี' },
  { district: 'สุรศักดิ์', amphoe: 'ศรีราชา', province: 'ชลบุรี' },

  { district: 'บ่อยาง', amphoe: 'เมืองสงขลา', province: 'สงขลา' },
  { district: 'เขารูปช้าง', amphoe: 'เมืองสงขลา', province: 'สงขลา' },
  { district: 'หาดใหญ่', amphoe: 'หาดใหญ่', province: 'สงขลา' },
  { district: 'คอหงส์', amphoe: 'หาดใหญ่', province: 'สงขลา' },

  { district: 'ตลาด', amphoe: 'เมืองสุราษฎร์ธานี', province: 'สุราษฎร์ธานี' },

  { district: 'ในเมือง', amphoe: 'เมืองขอนแก่น', province: 'ขอนแก่น' },
  { district: 'ศิลา', amphoe: 'เมืองขอนแก่น', province: 'ขอนแก่น' },

  { district: 'ในเมือง', amphoe: 'เมืองนครราชสีมา', province: 'นครราชสีมา' },
  { district: 'หนองไผ่', amphoe: 'เมืองนครราชสีมา', province: 'นครราชสีมา' }
]

export const searchAddressByDistrict = (query: string): AddressEntry[] => {
  if (!query) return []
  const lowerQuery = query.toLowerCase()
  return addressDatabase.filter(entry =>
    entry.district.toLowerCase().includes(lowerQuery) ||
    entry.amphoe.toLowerCase().includes(lowerQuery) ||
    entry.province.toLowerCase().includes(lowerQuery)
  )
}

export const getProvinces = (): string[] => {
  const provinces = new Set<string>()
  addressDatabase.forEach(entry => provinces.add(entry.province))
  return Array.from(provinces).sort()
}

export const getAmphoes = (province: string): string[] => {
  const amphoes = new Set<string>()
  addressDatabase
    .filter(entry => entry.province === province)
    .forEach(entry => amphoes.add(entry.amphoe))
  return Array.from(amphoes).sort()
}

export const getDistricts = (province: string, amphoe: string): string[] => {
  const districts = new Set<string>()
  addressDatabase
    .filter(entry => entry.province === province && entry.amphoe === amphoe)
    .forEach(entry => districts.add(entry.district))
  return Array.from(districts).sort()
}

// getZipcode ไม่จำเป็นแล้ว เพราะไม่มี field zipcode แล้ว (ลบทิ้งได้)

export const thaiAddressData = (() => {
  const provinces = getProvinces()

  return provinces.map(province => {
    const amphoes = getAmphoes(province)

    const districts = amphoes.flatMap(amphoe => {
      const districtNames = getDistricts(province, amphoe)

      return districtNames.map(district => ({
        district: district,                     // แก้จาก amphoe เป็น district จริง ๆ
        value: district.toLowerCase().replace(/\s+/g, '_'),  // เปลี่ยนตามชื่อตำบล
        subDistricts: [
          {
            subDistrict: district,
            value: district.toLowerCase().replace(/\s+/g, '_') + '_sub',
            postalCode: '' // ปล่อยให้กรอกเอง ไม่มีการเติมรหัสไปรษณีย์อัตโนมัติ
          }
        ]
      }))
    })

    return {
      province,
      value: province.toLowerCase().replace(/\s+/g, ''),
      districts
    }
  })
})()
