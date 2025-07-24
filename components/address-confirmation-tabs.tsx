"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { getProvinces, getAmphoes, getDistricts,  } from "@/data/thai-address-data"
import { Trash2 } from "lucide-react"

interface AddressState {
  fullAddress: string
  province: string
  district: string
  subDistrict: string
  postalCode: string
}

export default function AddressConfirmationTabs() {
  const [activeTab, setActiveTab] = useState("agent")

  const [agentAddress, setAgentAddress] = useState<AddressState>({
    fullAddress: "",
    province: "",
    district: "",
    subDistrict: "",
    postalCode: "",
  })

  const [propertyAddress, setPropertyAddress] = useState<AddressState>({
    fullAddress: "",
    province: "",
    district: "",
    subDistrict: "",
    postalCode: "",
  })

  const getAvailableOptions = (address: AddressState) => {
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
        postalCode: ''
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
    () => getAvailableOptions(agentAddress),
    [agentAddress],
  )

  const { 
    availableDistricts: propertyDistricts, 
    availableSubDistricts: propertySubDistricts,
    provinces: propertyProvinces 
  } = useMemo(
    () => getAvailableOptions(propertyAddress),
    [propertyAddress],
  )

  const handleAddressChange = (type: "agent" | "property", field: keyof AddressState, value: string) => {
    const setter = type === "agent" ? setAgentAddress : setPropertyAddress
    const currentAddress = type === "agent" ? agentAddress : propertyAddress

    setter((prev) => {
      const newState = { ...prev, [field]: value }

      if (field === "province") {
        newState.district = ""
        newState.subDistrict = ""
        newState.postalCode = ""
      } else if (field === "district") {
        newState.subDistrict = ""
        newState.postalCode = ""
      } else if (field === "subDistrict") {
        const selectedSubDistrict = getAvailableOptions(newState).availableSubDistricts.find((s) => s.value === value)
        newState.postalCode = selectedSubDistrict ? selectedSubDistrict.postalCode : ""
      }
      return newState
    })
  }

  const handleDeleteAddress = () => {
    if (activeTab === "agent") {
      setAgentAddress({
        fullAddress: "",
        province: "",
        district: "",
        subDistrict: "",
        postalCode: "",
      })
    } else {
      setPropertyAddress({
        fullAddress: "",
        province: "",
        district: "",
        subDistrict: "",
        postalCode: "",
      })
    }
  }

  const handleSaveAddress = (type: "agent" | "property") => {
    // ตัวอย่างการแสดง alert
    window.alert(`บันทึกที่อยู่${type === "agent" ? "ของผู้ยืนยันตัวตน" : "ของอสังหาริมทรัพย์"}สำเร็จ!`);
    // ต่อไปสามารถเพิ่ม logic การบันทึกข้อมูล (เช่น เรียก API) ได้ที่นี่
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

        <TabsContent value="agent" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="agent-full-address">ที่อยู่ทั่วไป</Label>
                  <Textarea
                    id="agent-full-address"
                    placeholder="บ้านเลขที่, หมู่, ซอย, ถนน"
                    value={agentAddress.fullAddress}
                    onChange={(e) => handleAddressChange("agent", "fullAddress", e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="grid gap-2">
                    <Label htmlFor="agent-province">จังหวัด</Label>
                    <Select
                      value={agentAddress.province}
                      onValueChange={(value) => handleAddressChange("agent", "province", value)}
                    >
                      <SelectTrigger id="agent-province">
                        <SelectValue placeholder="เลือกจังหวัด" />
                      </SelectTrigger>
                      <SelectContent>
                        {agentProvinces.map((province) => (
                          <SelectItem key={province} value={province}>
                            {province}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="agent-district">อำเภอ/เขต</Label>
                    <Select
                      value={agentAddress.district}
                      onValueChange={(value) => handleAddressChange("agent", "district", value)}
                      disabled={!agentAddress.province}
                    >
                      <SelectTrigger id="agent-district">
                        <SelectValue placeholder="เลือกอำเภอ/เขต" />
                      </SelectTrigger>
                      <SelectContent>
                        {agentDistricts.map((district) => (
                          <SelectItem key={district.value} value={district.value}>
                            {district.district}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="agent-sub-district">ตำบล/แขวง</Label>
                    <Select
                      value={agentAddress.subDistrict}
                      onValueChange={(value) => handleAddressChange("agent", "subDistrict", value)}
                      disabled={!agentAddress.district}
                    >
                      <SelectTrigger id="agent-sub-district">
                        <SelectValue placeholder="เลือกตำบล/แขวง" />
                      </SelectTrigger>
                      <SelectContent>
                        {agentSubDistricts.map((subDistrict) => (
                          <SelectItem key={subDistrict.value} value={subDistrict.value}>
                            {subDistrict.subDistrict}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="agent-postal-code">เลขไปรษณีย์</Label>
                  <Input
  id="agent-postal-code"
  placeholder="เลขไปรษณีย์"
  value={agentAddress.postalCode}
  onChange={(e) => handleAddressChange("agent", "postalCode", e.target.value)}
/>

                </div>
                <div className="flex justify-end gap-2">
                  <Button className="bg-yellow-500 text-white">แก้ไขข้อมูล</Button>
                  <Button className="bg-blue-500 text-white">เพิ่มที่อยู่</Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 px-2"
                    onClick={handleDeleteAddress}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
                <Button className="w-full mt-1" onClick={() => handleSaveAddress("agent")}>
                  บันทึกที่อยู่ของผู้ยืนยันตัวตน
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="property" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="property-full-address">ที่อยู่ทั่วไป</Label>
                  <Textarea
                    id="property-full-address"
                    placeholder="บ้านเลขที่, หมู่, ซอย, ถนน"
                    value={propertyAddress.fullAddress}
                    onChange={(e) => handleAddressChange("property", "fullAddress", e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="grid gap-2">
                    <Label htmlFor="property-province">จังหวัด</Label>
                    <Select
                      value={propertyAddress.province}
                      onValueChange={(value) => handleAddressChange("property", "province", value)}
                    >
                      <SelectTrigger id="property-province">
                        <SelectValue placeholder="เลือกจังหวัด" />
                      </SelectTrigger>
                      <SelectContent>
                        {propertyProvinces.map((province) => (
                          <SelectItem key={province} value={province}>
                            {province}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="property-district">อำเภอ/เขต</Label>
                    <Select
                      value={propertyAddress.district}
                      onValueChange={(value) => handleAddressChange("property", "district", value)}
                      disabled={!propertyAddress.province}
                    >
                      <SelectTrigger id="property-district">
                        <SelectValue placeholder="เลือกอำเภอ/เขต" />
                      </SelectTrigger>
                      <SelectContent>
                        {propertyDistricts.map((district) => (
                          <SelectItem key={district.value} value={district.value}>
                            {district.district}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="property-sub-district">ตำบล/แขวง</Label>
                    <Select
                      value={propertyAddress.subDistrict}
                      onValueChange={(value) => handleAddressChange("property", "subDistrict", value)}
                      disabled={!propertyAddress.district}
                    >
                      <SelectTrigger id="property-sub-district">
                        <SelectValue placeholder="เลือกตำบล/แขวง" />
                      </SelectTrigger>
                      <SelectContent>
                        {propertySubDistricts.map((subDistrict) => (
                          <SelectItem key={subDistrict.value} value={subDistrict.value}>
                            {subDistrict.subDistrict}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="property-postal-code">เลขไปรษณีย์</Label>
                  <Input
                    id="property-postal-code"
                    placeholder="เลขไปรษณีย์"
                    value={propertyAddress.postalCode}
                    readOnly
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button className="bg-yellow-500 text-white">แก้ไขข้อมูล</Button>
                  <Button className="bg-blue-500 text-white">เพิ่มที่อยู่</Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 px-2"
                    onClick={handleDeleteAddress}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
                <Button className="w-full mt-1" onClick={() => handleSaveAddress("property")}>
                  บันทึกที่อยู่ของอสังหาริมทรัพย์
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}