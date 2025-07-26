"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { getProvinces, getAmphoes, getDistricts, getZipcode } from "@/data/provinces"
import { Trash2, Check, Edit, Plus, X } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

function YourDialogComponent() {
  return (
    <Dialog>
      <DialogContent>
        <DialogTitle>หัวข้อของ Dialog</DialogTitle>
        {/* เนื้อหาอื่นๆ ของคุณ */}
      </DialogContent>
    </Dialog>
  )
}

interface AddressState {
  id: string
  fullAddress: string
  province: string
  district: string
  subDistrict: string
  postalCode: string
  isDefault?: boolean
  status?: 'pending' | 'verified' | 'rejected'
}

export default function AddressConfirmationTabs() {
  const [activeTab, setActiveTab] = useState("agent")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = createClientComponentClient()
  const router = useRouter()

  const [agentAddresses, setAgentAddresses] = useState<AddressState[]>([])
  const [propertyAddresses, setPropertyAddresses] = useState<AddressState[]>([])

  // Load user and addresses from Supabase
  useEffect(() => {
    const loadUserAndAddresses = async () => {
      setLoading(true)
      try {
        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
          toast.error("กรุณาล็อกอินเพื่อดูที่อยู่ของคุณ")
          router.push("/login")
          return
        }
        setUserId(user.id)

        // Load agent addresses (type_id = 1) for current user
        const { data: agentData, error: agentError } = await supabase
          .from('addresses')
          .select('*')
          .eq('type_id', 1)
          .eq('user_id', user.id)
          .order('is_default', { ascending: false })
          .order('created_at', { ascending: true })

        if (agentError) throw agentError

        // Load property addresses (type_id = 2) for current user
        const { data: propertyData, error: propertyError } = await supabase
          .from('addresses')
          .select('*')
          .eq('type_id', 2)
          .eq('user_id', user.id)
          .order('is_default', { ascending: false })
          .order('created_at', { ascending: true })

        if (propertyError) throw propertyError

        // Transform data to match our AddressState interface
        const transformAddress = (addr: any): AddressState => ({
          id: addr.id,
          fullAddress: addr.full_address,
          province: addr.province,
          district: addr.district,
          subDistrict: addr.sub_district,
          postalCode: addr.postal_code,
          isDefault: addr.is_default,
          status: addr.status
        })

        setAgentAddresses(agentData?.map(transformAddress) || [])
        setPropertyAddresses(propertyData?.map(transformAddress) || [])

      } catch (error) {
        console.error("Error loading addresses:", error)
        toast.error("ไม่สามารถโหลดที่อยู่ได้")
      } finally {
        setLoading(false)
      }
    }

    loadUserAndAddresses()
  }, [supabase, router])

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
        postalCode: getZipcode(address.province, address.district, district) || ''
      })) : []

    return {
      availableDistricts,
      availableSubDistricts,
      provinces
    }
  }

  const handleAddressChange = (
    type: "agent" | "property",
    id: string,
    field: keyof AddressState,
    value: string
  ) => {
    const setter = type === "agent" ? setAgentAddresses : setPropertyAddresses
  
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
      id: `temp-${Date.now()}`,
      fullAddress: "",
      province: "",
      district: "",
      subDistrict: "",
      postalCode: ""
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

  const handleSaveAddress = async (type: "agent" | "property", id: string) => {
    setLoading(true)
    try {
      if (!userId) {
        throw new Error('กรุณาล็อกอินก่อนบันทึกที่อยู่')
      }
  
      const addresses = type === "agent" ? agentAddresses : propertyAddresses
      const addressToSave = addresses.find(addr => addr.id === id)
      
      if (!addressToSave) {
        throw new Error('ไม่พบที่อยู่ที่จะบันทึก')
      }
  
      const typeId = type === "agent" ? 1 : 2
      const addressData = {
        type_id: typeId,
        full_address: addressToSave.fullAddress,
        province: addressToSave.province,
        district: addressToSave.district,
        sub_district: addressToSave.subDistrict,
        postal_code: addressToSave.postalCode,
        is_default: addressToSave.isDefault || false,
        user_id: userId,
        status: id.startsWith('temp-') ? 'pending' : addressToSave.status
      }
  
      let result
      if (id.startsWith('temp-')) {
        // Add new address
        const { data, error } = await supabase
          .from('addresses')
          .insert(addressData)
          .select()
          .single()
        
        if (error) throw error
        result = data
      } else {
        // Update existing address
        const { data, error } = await supabase
          .from('addresses')
          .update(addressData)
          .eq('id', id)
          .select()
          .single()
        
        if (error) throw error
        result = data
      }
  
      // Update local state
      const updatedAddress: AddressState = {
        id: result.id,
        fullAddress: result.full_address,
        province: result.province,
        district: result.district,
        subDistrict: result.sub_district,
        postalCode: result.postal_code,
        isDefault: result.is_default,
        status: result.status
      }
  
      // Update the appropriate state array
      const setter = type === "agent" ? setAgentAddresses : setPropertyAddresses
      setter(prev => prev.map(addr => addr.id === id ? updatedAddress : addr))
      
      setEditingId(null)
      toast.success("บันทึกที่อยู่สำเร็จ รอการอนุมัติ")
      router.refresh()
    } catch (error) {
      console.error("Error saving address:", error)
      toast.error(error.message || 'เกิดข้อผิดพลาดในการบันทึกที่อยู่')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    
    // Remove temporary addresses if canceling creation
    setAgentAddresses(prev => prev.filter(addr => !addr.id.startsWith('temp-')))
    setPropertyAddresses(prev => prev.filter(addr => !addr.id.startsWith('temp-')))
  }

  const handleDeleteAddress = async (type: "agent" | "property", id: string) => {
    if (!window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบที่อยู่นี้?")) return
    
    setLoading(true)
    try {
      if (!id.startsWith('temp-')) {
        // Only delete from Supabase if it's not a temporary address
        const { error } = await supabase
          .from('addresses')
          .delete()
          .eq('id', id)
          .eq('user_id', userId)
        
        if (error) throw error
      }

      // Update local state
      if (type === "agent") {
        setAgentAddresses(prev => prev.filter(addr => addr.id !== id))
      } else {
        setPropertyAddresses(prev => prev.filter(addr => addr.id !== id))
      }

      toast.success("ลบที่อยู่สำเร็จ")
      router.refresh()
    } catch (error) {
      console.error("Error deleting address:", error)
      toast.error("ไม่สามารถลบที่อยู่ได้")
    } finally {
      setLoading(false)
    }
  }

  const handleSetDefault = async (type: "agent" | "property", id: string) => {
    setLoading(true)
    try {
      const typeId = type === "agent" ? 1 : 2
      
      // First, set all addresses of this type to not default for current user
      const { error: resetError } = await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('type_id', typeId)
        .eq('user_id', userId)
      
      if (resetError) throw resetError

      // Then set the selected address to default
      const { error: setError } = await supabase
        .from('addresses')
        .update({ is_default: true })
        .eq('id', id)
        .eq('user_id', userId)
      
      if (setError) throw setError

      // Update local state
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

      toast.success("ตั้งเป็นที่อยู่หลักสำเร็จ")
      router.refresh()
    } catch (error) {
      console.error("Error setting default address:", error)
      toast.error("ไม่สามารถตั้งเป็นที่อยู่หลักได้")
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: AddressState['status']) => {
    switch (status) {
      case 'verified':
        return (
          <div className="bg-green-50 text-green-600 px-3 py-1 rounded-md text-sm inline-flex items-center">
            <Check className="w-4 h-4 mr-1" /> อนุมัติแล้ว
          </div>
        )
      case 'rejected':
        return (
          <div className="bg-red-50 text-red-600 px-3 py-1 rounded-md text-sm inline-flex items-center">
            <X className="w-4 h-4 mr-1" /> ไม่อนุมัติ
          </div>
        )
      case 'pending':
      default:
        return (
          <div className="bg-yellow-50 text-yellow-600 px-3 py-1 rounded-md text-sm inline-flex items-center">
            รอการอนุมัติ
          </div>
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
            <div className="flex gap-2">
              {address.isDefault && (
                <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-md text-sm inline-flex items-center">
                  <Check className="w-4 h-4 mr-1" /> ที่อยู่หลัก
                </div>
              )}
              {!address.id.startsWith('temp-') && address.status && getStatusBadge(address.status)}
            </div>

            <div className="grid gap-2">
              <Label htmlFor={`${type}-${address.id}-full-address`}>ที่อยู่ทั่วไป</Label>
              <Textarea
                id={`${type}-${address.id}-full-address`}
                placeholder="บ้านเลขที่, หมู่, ซอย, ถนน"
                value={address.fullAddress}
                onChange={(e) => handleAddressChange(type, address.id, "fullAddress", e.target.value)}
                className="min-h-[100px]"
                disabled={!isEditing || loading}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="grid gap-2">
                <Label htmlFor={`${type}-${address.id}-province`}>จังหวัด</Label>
                <Select
                  value={address.province}
                  onValueChange={(value) => handleAddressChange(type, address.id, "province", value)}
                  disabled={!isEditing || loading}
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
                  disabled={!isEditing || !address.province || loading}
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
                  disabled={!isEditing || !address.district || loading}
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
                disabled={!isEditing || loading}
              />
            </div>

            <div className="flex justify-between items-center">
              {!address.isDefault && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSetDefault(type, address.id)}
                  disabled={isEditing || loading || address.status !== 'verified'}
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
                      disabled={loading}
                    >
                      <X className="w-4 h-4 mr-1" /> ยกเลิก
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleSaveAddress(type, address.id)}
                      disabled={loading}
                    >
                      {loading ? (
                        "กำลังบันทึก..."
                      ) : (
                        <>
                          <Check className="w-4 h-4 mr-1" /> บันทึก
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditAddress(address.id)}
                      disabled={loading}
                    >
                      <Edit className="w-4 h-4 mr-1" /> แก้ไข
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteAddress(type, address.id)}
                      disabled={loading}
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

  if (loading && !editingId) {
    return (
      <div className="w-full flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
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

        <TabsContent value="agent" className="mt-4">
          <div className="space-y-4">
            {agentAddresses.length > 0 ? (
              agentAddresses.map(address => renderAddressForm(address, "agent"))
            ) : (
              <Card>
                <CardContent className="pt-6 text-center text-gray-500">
                  ไม่พบที่อยู่ของผู้ยืนยันตัวตน
                </CardContent>
              </Card>
            )}

            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleAddAddress("agent")}
              disabled={loading}
            >
              <Plus className="w-4 h-4 mr-2" /> เพิ่มที่อยู่ใหม่
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="property" className="mt-4">
          <div className="space-y-4">
            {propertyAddresses.length > 0 ? (
              propertyAddresses.map(address => renderAddressForm(address, "property"))
            ) : (
              <Card>
                <CardContent className="pt-6 text-center text-gray-500">
                  ไม่พบที่อยู่ของอสังหาริมทรัพย์
                </CardContent>
              </Card>
            )}

            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleAddAddress("property")}
              disabled={loading}
            >
              <Plus className="w-4 h-4 mr-2" /> เพิ่มที่อยู่ใหม่
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}