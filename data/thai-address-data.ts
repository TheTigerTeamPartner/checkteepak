// This is a simplified implementation that matches the structure of thai-address-database
// In a real implementation, you would import from 'thai-address-database'

interface AddressEntry {
  district: string
  amphoe: string
  province: string
  zipcode: string
}

// This is a simplified version of the database
const addressDatabase: AddressEntry[] = [
  // Bangkok
  { district: 'จตุจักร', amphoe: 'จตุจักร', province: 'กรุงเทพมหานคร', zipcode: '10900' },
  { district: 'ลาดยาว', amphoe: 'จตุจักร', province: 'กรุงเทพมหานคร', zipcode: '10900' },
  { district: 'เสนานิคม', amphoe: 'จตุจักร', province: 'กรุงเทพมหานคร', zipcode: '10900' },
  { district: 'คลองเตยเหนือ', amphoe: 'วัฒนา', province: 'กรุงเทพมหานคร', zipcode: '10110' },
  { district: 'คลองตันเหนือ', amphoe: 'วัฒนา', province: 'กรุงเทพมหานคร', zipcode: '10110' },
  { district: 'พระโขนงเหนือ', amphoe: 'วัฒนา', province: 'กรุงเทพมหานคร', zipcode: '10110' },
  { district: 'สีลม', amphoe: 'บางรัก', province: 'กรุงเทพมหานคร', zipcode: '10500' },
  { district: 'สุริยวงศ์', amphoe: 'บางรัก', province: 'กรุงเทพมหานคร', zipcode: '10500' },
  { district: 'บางรัก', amphoe: 'บางรัก', province: 'กรุงเทพมหานคร', zipcode: '10500' },
  
  // Chiang Mai
  { district: 'ศรีภูมิ', amphoe: 'เมืองเชียงใหม่', province: 'เชียงใหม่', zipcode: '50200' },
  { district: 'ช้างเผือก', amphoe: 'เมืองเชียงใหม่', province: 'เชียงใหม่', zipcode: '50300' },
  { district: 'สุเทพ', amphoe: 'เมืองเชียงใหม่', province: 'เชียงใหม่', zipcode: '50200' },
  { district: 'สันกำแพง', amphoe: 'สันกำแพง', province: 'เชียงใหม่', zipcode: '50130' },
  { district: 'ทรายมูล', amphoe: 'สันกำแพง', province: 'เชียงใหม่', zipcode: '50130' },
  
  // Phuket
  { district: 'ตลาดใหญ่', amphoe: 'เมืองภูเก็ต', province: 'ภูเก็ต', zipcode: '83000' },
  { district: 'ตลาดเหนือ', amphoe: 'เมืองภูเก็ต', province: 'ภูเก็ต', zipcode: '83000' },
  { district: 'กะทู้', amphoe: 'กะทู้', province: 'ภูเก็ต', zipcode: '83120' },
  { district: 'ป่าตอง', amphoe: 'กะทู้', province: 'ภูเก็ต', zipcode: '83150' },
  
  // Chonburi
  { district: 'บางปลาสร้อย', amphoe: 'เมืองชลบุรี', province: 'ชลบุรี', zipcode: '20000' },
  { district: 'มะขามหย่ง', amphoe: 'เมืองชลบุรี', province: 'ชลบุรี', zipcode: '20000' },
  { district: 'ศรีราชา', amphoe: 'ศรีราชา', province: 'ชลบุรี', zipcode: '20110' },
  { district: 'สุรศักดิ์', amphoe: 'ศรีราชา', province: 'ชลบุรี', zipcode: '20110' },
  
  // Songkhla
  { district: 'บ่อยาง', amphoe: 'เมืองสงขลา', province: 'สงขลา', zipcode: '90000' },
  { district: 'เขารูปช้าง', amphoe: 'เมืองสงขลา', province: 'สงขลา', zipcode: '90000' },
  { district: 'หาดใหญ่', amphoe: 'หาดใหญ่', province: 'สงขลา', zipcode: '90110' },
  { district: 'คอหงส์', amphoe: 'หาดใหญ่', province: 'สงขลา', zipcode: '90110' },
  
  // Surat Thani
  { district: 'ตลาด', amphoe: 'เมืองสุราษฎร์ธานี', province: 'สุราษฎร์ธานี', zipcode: '84000' },
  
  // Khon Kaen
  { district: 'ในเมือง', amphoe: 'เมืองขอนแก่น', province: 'ขอนแก่น', zipcode: '40000' },
  { district: 'ศิลา', amphoe: 'เมืองขอนแก่น', province: 'ขอนแก่น', zipcode: '40000' },
  
  // Nakhon Ratchasima
  { district: 'ในเมือง', amphoe: 'เมืองนครราชสีมา', province: 'นครราชสีมา', zipcode: '30000' },
  { district: 'หนองไผ่', amphoe: 'เมืองนครราชสีมา', province: 'นครราชสีมา', zipcode: '30000' }
]

// Helper functions to work with the address database
export const searchAddressByDistrict = (query: string): AddressEntry[] => {
  if (!query) return []
  const lowerQuery = query.toLowerCase()
  return addressDatabase.filter(entry => 
    entry.district.toLowerCase().includes(lowerQuery) ||
    entry.amphoe.toLowerCase().includes(lowerQuery) ||
    entry.province.toLowerCase().includes(lowerQuery) ||
    entry.zipcode.includes(query)
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

export const getZipcode = (province: string, amphoe: string, district: string): string | undefined => {
  const entry = addressDatabase.find(entry => 
    entry.province === province && 
    entry.amphoe === amphoe && 
    entry.district === district
  )
  return entry?.zipcode
}

// For backward compatibility with the old structure
export const thaiAddressData = (() => {
  const provinces = getProvinces()
  
  return provinces.map(province => {
    const amphoes = getAmphoes(province)
    
    const districts = amphoes.flatMap(amphoe => {
      const districtNames = getDistricts(province, amphoe)
      
      return districtNames.map(district => {
        const zipcode = getZipcode(province, amphoe, district) || ''
        return {
          district: amphoe, // Using amphoe as district for backward compatibility
          value: amphoe.toLowerCase().replace(/\s+/g, '_'),
          subDistricts: [
            {
              subDistrict: district,
              value: district.toLowerCase().replace(/\s+/g, '_') + '_sub',
              postalCode: zipcode
            }
          ]
        }
      })
    })
    
    return {
      province,
      value: province.toLowerCase().replace(/\s+/g, ''),
      districts: districts
    }
  })
})()