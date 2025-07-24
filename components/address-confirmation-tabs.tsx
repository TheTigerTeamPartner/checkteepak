"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { getProvinces, getAmphoes, getDistricts, getZipcode } from "@/data/provinces"
import { Trash2 } from "lucide-react"
import { Check } from "lucide-react"
import { Edit } from "lucide-react"
import { Plus } from "lucide-react"
import { X } from "lucide-react"

interface AddressState {
  id: string
  fullAddress: string
  province: string
  district: string
  subDistrict: string
  postalCode: string
  isDefault?: boolean
}

export default function AddressConfirmationTabs() {
  const [activeTab, setActiveTab] = useState("agent")
  const [editingId, setEditingId] = useState<string | null>(null)

  // Sample initial addresses
  const [agentAddresses, setAgentAddresses] = useState<AddressState[]>([
    {
      id: '',
      fullAddress: "",
      province: "",
      district: "",
      subDistrict: "",
      postalCode: "",
      isDefault: true
    }
  ])

  const [propertyAddresses, setPropertyAddresses] = useState<AddressState[]>([
    {
      id: '',
      fullAddress: "",
      province: "",
      district: "",
      subDistrict: "",
      postalCode: "",
      isDefault: true
    }
  ])

  const getAvailableOptions = (address: Partial<AddressState>) => {
    const provinces = getProvinces()
    const availableAmphoes = address.province ? getAmphoes(address.province) : []

    const availableDistricts = availableAmphoes.map((amphoe: string) => ({
      district: amphoe,
      value: amphoe.toLowerCase().replace(/\s+/g, '_')
    }))

    const availableSubDistricts = address.district && address.province ?
      getDistricts(address.province, address.district).map((district: string) => ({
        subDistrict: district,
        value: district.toLowerCase().replace(/\s+/g, '_') + '_sub',
        postalCode: '' // You might want to populate this with actual postal codes
      })) : []

    return {
      availableDistricts,
      availableSubDistricts,
      provinces
    }
  }

  const {
    availableDistricts: agentDistricts,
    availableSubDistricts: agentSubDistricts,
    provinces: agentProvinces
  } = useMemo(
    () => getAvailableOptions(agentAddresses[0]),
    [agentAddresses],
  )

  const {
    availableDistricts: propertyDistricts,
    availableSubDistricts: propertySubDistricts,
    provinces: propertyProvinces
  } = useMemo(
    () => getAvailableOptions(propertyAddresses[0]),
    [propertyAddresses],
  )

  const handleAddressChange = (
    type: "agent" | "property",
    id: string,
    field: keyof AddressState,
    value: string
  ) => {
    const setter = type === "agent" ? setAgentAddresses : setPropertyAddresses
    const currentList = type === "agent" ? agentAddresses : propertyAddresses
  
    setter(prev =>
      prev.map(addr => {
        if (addr.id !== id) return addr
  
        const updated = { ...addr, [field]: value }
  
        if (field === "province") {
          updated.district = ""
          updated.subDistrict = ""
          updated.postalCode = ""
        } else if (field === "district") {
          updated.subDistrict = ""
          updated.postalCode = ""
        } else if (field === "subDistrict") {
          const subDistrictData = getAvailableOptions(updated).availableSubDistricts.find(
            (s) => s.subDistrict === value
          )
          updated.postalCode = subDistrictData ? subDistrictData.postalCode : ""
        }
  
        return updated
      })
    )
  }
  
  const handleAddAddress = (type: "agent" | "property") => {
    const newAddress: AddressState = {
      id: Date.now().toString(),
      fullAddress: "",
      province: "",
      district: "",
      subDistrict: "",
      postalCode: "",
    }

    if (type === "agent") {
      setAgentAddresses(prev => [...prev, newAddress])
    } else {
      setPropertyAddresses(prev => [...prev, newAddress])
    }

    setEditingId(newAddress.id)
  }

  const handleEditAddress = (id: string) => {
    setEditingId(id)
  }

  const handleSaveAddress = (type: "agent" | "property", id: string) => {
    setEditingId(null)
    // Here you would typically save to your backend
    window.alert(`บันทึกที่อยู่${type === "agent" ? "ของผู้ยืนยันตัวตน" : "ของอสังหาริมทรัพย์"}สำเร็จ!`)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
  }

  const handleDeleteAddress = (type: "agent" | "property", id: string) => {
    if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบที่อยู่นี้?")) {
      if (type === "agent") {
        setAgentAddresses(prev => prev.filter(addr => addr.id !== id))
      } else {
        setPropertyAddresses(prev => prev.filter(addr => addr.id !== id))
      }
    }
  }

  const handleSetDefault = (type: "agent" | "property", id: string) => {
    if (type === "agent") {
      setAgentAddresses(prev =>
        prev.map(addr => ({
          ...addr,
          isDefault: addr.id === id
        }))
      )
    } else {
      setPropertyAddresses(prev =>
        prev.map(addr => ({
          ...addr,
          isDefault: addr.id === id
        }))
      )
    }
  }

  const renderAddressForm = (address: AddressState, type: "agent" | "property") => {
    const isEditing = editingId === address.id
    const {
      availableDistricts,
      availableSubDistricts,
      provinces
    } = getAvailableOptions(address)

    return (
      <Card key={address.id} className="mb-4">
        <CardContent className="pt-6">
          <div className="grid gap-4">
            {address.isDefault && (
              <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-md text-sm inline-flex items-center">
                <Check className="w-4 h-4 mr-1" /> ที่อยู่หลัก
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor={`${type}-${address.id}-full-address`}>ที่อยู่ทั่วไป</Label>
              <Textarea
                id={`${type}-${address.id}-full-address`}
                placeholder="บ้านเลขที่, หมู่, ซอย, ถนน"
                value={address.fullAddress}
                onChange={(e) => handleAddressChange(type, address.id, "fullAddress", e.target.value)}
                className="min-h-[100px]"
                disabled={!isEditing}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="grid gap-2">
                <Label htmlFor={`${type}-${address.id}-province`}>จังหวัด</Label>
                <Select
                  value={address.province}
                  onValueChange={(value) => handleAddressChange(type, address.id, "province", value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger id={`${type}-${address.id}-province`}>
                    <SelectValue placeholder="เลือกจังหวัด" />
                  </SelectTrigger>
                  <SelectContent>
                    {provinces.map((province) => (
                      <SelectItem key={province} value={province}>
                        {province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor={`${type}-${address.id}-district`}>อำเภอ/เขต</Label>
                <Select
                  value={address.district}
                  onValueChange={(value) => handleAddressChange(type, address.id, "district", value)}
                  disabled={!isEditing || !address.province}
                >
                  <SelectTrigger id={`${type}-${address.id}-district`}>
                    <SelectValue placeholder="เลือกอำเภอ/เขต" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDistricts.map((district) => (
                      <SelectItem key={district.value} value={district.district}>
                        {district.district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor={`${type}-${address.id}-sub-district`}>ตำบล/แขวง</Label>
                <Input
  value={address.subDistrict}
  onChange={(e) => handleAddressChange(type, address.id, "subDistrict", e.target.value)}
  disabled={!isEditing || !address.district}
  placeholder="เลือกตำบล/แขวง"
  id={`${type}-${address.id}-sub-district`}
/>

              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor={`${type}-${address.id}-postal-code`}>เลขไปรษณีย์</Label>
              <Input
                id={`${type}-${address.id}-postal-code`}
                placeholder="เลขไปรษณีย์"
                value={address.postalCode}
                onChange={(e) => handleAddressChange(type, address.id, "postalCode", e.target.value)}
                disabled={!isEditing}
              />
            </div>

            <div className="flex justify-between items-center">
              {!address.isDefault && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSetDefault(type, address.id)}
                  disabled={isEditing}
                >
                  ตั้งเป็นที่อยู่หลัก
                </Button>
              )}

              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEdit}
                    >
                      <X className="w-4 h-4 mr-1" /> ยกเลิก
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleSaveAddress(type, address.id)}
                    >
                      <Check className="w-4 h-4 mr-1" /> บันทึก
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditAddress(address.id)}
                    >
                      <Edit className="w-4 h-4 mr-1" /> แก้ไข
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteAddress(type, address.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl md:text-2xl font-bold text-gray-900">ยืนยันที่อยู่</h1>
        <p className="text-gray-600">กรุณากรอกข้อมูลที่อยู่ปัจจุบันของคุณให้ครบถ้วน เพื่อใช้ในการยืนยันตัวตน</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="agent">ที่อยู่ของผู้ยืนยันตัวตน</TabsTrigger>
          <TabsTrigger value="property">ที่อยู่ของอสังหาริมทรัพย์</TabsTrigger>
        </TabsList>

        {/* AGENT */}
        <TabsContent value="agent" className="mt-4">
          <div className="space-y-4">
            {agentAddresses.map(address => renderAddressForm(address, "agent"))}

            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleAddAddress("agent")}
            >
              <Plus className="w-4 h-4 mr-2" /> เพิ่มที่อยู่ใหม่
            </Button>
          </div>
        </TabsContent>

        {/* PROPERTY */}
        <TabsContent value="property" className="mt-4">
          <div className="space-y-4">
            {propertyAddresses.map(address => renderAddressForm(address, "property"))}

            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleAddAddress("property")}
            >
              <Plus className="w-4 h-4 mr-2" /> เพิ่มที่อยู่ใหม่
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
