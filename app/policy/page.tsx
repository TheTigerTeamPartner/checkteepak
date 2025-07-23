'use client'

import React, { useState, useEffect } from 'react';
import { Shield, User, FileText, Mail, Phone, MapPin, Clock, ChevronUp, Eye, Edit, Trash2, UserCheck, Download, X } from 'lucide-react';

function App() {
    const [activeSection, setActiveSection] = useState('');
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);

            // Update active section based on scroll position
            const sections = ['data-collection', 'data-usage', 'data-disclosure', 'data-security', 'user-rights', 'cookies', 'policy-changes', 'contact'];
            const currentSection = sections.find(section => {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    return rect.top <= 100 && rect.bottom >= 100;
                }
                return false;
            });

            if (currentSection) {
                setActiveSection(currentSection);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const navigationItems = [
        { id: 'data-collection', label: 'ข้อมูลที่เราจัดเก็บ', icon: FileText },
        { id: 'data-usage', label: 'วัตถุประสงค์ในการใช้ข้อมูล', icon: User },
        { id: 'data-disclosure', label: 'การเปิดเผยข้อมูล', icon: Eye },
        { id: 'data-security', label: 'ความปลอดภัยของข้อมูล', icon: Shield },
        { id: 'user-rights', label: 'สิทธิของคุณ', icon: UserCheck },
        { id: 'cookies', label: 'การใช้คุกกี้', icon: Edit },
        { id: 'policy-changes', label: 'การเปลี่ยนแปลงนโยบาย', icon: Download },
        { id: 'contact', label: 'ช่องทางการติดต่อ', icon: Mail },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br ">
 

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Navigation */}
                    <div className="lg:w-80 lg:flex-shrink-0">
                        <div className="sticky top-6">
                            <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">เนื้อหา</h2>
                                <nav className="space-y-2">
                                    {navigationItems.map((item) => {
                                        const Icon = item.icon;
                                        return (
                                            <button
                                                key={item.id}
                                                onClick={() => scrollToSection(item.id)}
                                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${activeSection === item.id
                                                        ? 'bg-green-100 text-green-700 border-l-4 border-green-500'
                                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                <Icon className="w-5 h-5 flex-shrink-0" />
                                                <span className="text-sm font-medium">{item.label}</span>
                                            </button>
                                        );
                                    })}
                                </nav>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:flex-1">
                        <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-8 lg:p-12">
                            {/* Title Section */}
                            <div className="text-center mb-12">
                                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                    นโยบายความเป็นส่วนตัว
                                </h1>
                                <div className="flex items-center justify-center space-x-2 text-green-600 mb-6">
                                    <Shield className="w-5 h-5" />
                                    <span className="text-lg font-medium">เช็คที่พัก</span>
                                </div>
                                <div className="inline-flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-full border border-green-200">
                                    <Clock className="w-4 h-4 text-green-600" />
                                    <span className="text-sm font-medium text-green-700">วันที่บังคับใช้: 16 กรกฎาคม 2568</span>
                                </div>
                            </div>

                            {/* Introduction */}
                            <div className="mb-12 prose prose-lg max-w-none">
                                <p className="text-gray-700 leading-relaxed">
                                    เช็คที่พัก ตระหนักถึงความสำคัญของการคุ้มครองข้อมูลส่วนบุคคลของท่าน เรามุ่งมั่นที่จะสร้างประสบการณ์การเดินทางที่ปลอดภัยและน่าเชื่อถือ โดยเป็นแพลตฟอร์มสำหรับค้นหาและเปรียบเทียบที่พัก และเชื่อมั่นว่าข้อมูลส่วนบุคคลของท่านจะได้รับการจัดการอย่างโปร่งใสและด้วยความรับผิดชอบ นโยบายความเป็นส่วนตัวฉบับนี้อธิบายถึงวิธีการที่เราเก็บรวบรวม ใช้ เปิดเผย และปกป้องข้อมูลของท่านเมื่อท่านเข้าถึงและใช้งานแพลตฟอร์มและบริการของเรา
                                </p>
                            </div>

                            {/* Section 1: Data Collection */}
                            <section id="data-collection" className="mb-12">
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-green-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">1. ข้อมูลที่เราจัดเก็บ</h2>
                                </div>
                                <div className="prose prose-lg max-w-none">
                                    <p className="text-gray-700 leading-relaxed mb-6">
                                        เราอาจจัดเก็บข้อมูลส่วนบุคคลของท่านเมื่อท่านใช้งานแพลตฟอร์มเช็คที่พัก โดยข้อมูลเหล่านี้อาจรวมถึง:
                                    </p>
                                    <ul className="space-y-4">
                                        <li className="flex items-start space-x-3">
                                            <div className="w-2 h-2 bg-green-500 rounded-full mt-3 flex-shrink-0"></div>
                                            <div>
                                                <strong className="text-gray-900">ข้อมูลระบุตัวตนและข้อมูลติดต่อ (หากมีการลงทะเบียน):</strong>
                                                <span className="text-gray-700"> เช่น ชื่อ-นามสกุล, ที่อยู่อีเมล, หมายเลขโทรศัพท์ (ในกรณีที่ท่านเลือกสร้างบัญชีผู้ใช้งาน หรือสมัครรับข่าวสาร)</span>
                                            </div>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <div className="w-2 h-2 bg-green-500 rounded-full mt-3 flex-shrink-0"></div>
                                            <div>
                                                <strong className="text-gray-900">ข้อมูลบัญชี (หากมีการลงทะเบียน):</strong>
                                                <span className="text-gray-700"> เช่น ชื่อผู้ใช้งาน, รหัสผ่านที่เข้ารหัส, การตั้งค่าและการตั้งค่าการแจ้งเตือน</span>
                                            </div>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <div className="w-2 h-2 bg-green-500 rounded-full mt-3 flex-shrink-0"></div>
                                            <div>
                                                <strong className="text-gray-900">ข้อมูลการค้นหาและการตั้งค่า:</strong>
                                                <span className="text-gray-700"> เช่น สถานที่ที่สนใจ, ประเภทที่พักที่ค้นหา, ช่วงเวลาที่ค้นหา, ตัวกรองที่ใช้, ที่พักที่บันทึกเป็นรายการโปรด</span>
                                            </div>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <div className="w-2 h-2 bg-green-500 rounded-full mt-3 flex-shrink-0"></div>
                                            <div>
                                                <strong className="text-gray-900">ข้อมูลอุปกรณ์และข้อมูลการใช้งาน:</strong>
                                                <span className="text-gray-700"> เช่น ที่อยู่ IP, ประเภทของอุปกรณ์ที่ใช้เข้าถึงแพลตฟอร์ม, ระบบปฏิบัติการ, ประเภทของเบราว์เซอร์, เวลาที่เข้าถึง, หน้าที่เยี่ยมชม, ลำดับการคลิก, และข้อมูลการโต้ตอบกับบริการของเรา</span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            {/* Section 2: Data Usage */}
                            <section id="data-usage" className="mb-12">
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                        <User className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">2. วัตถุประสงค์ในการใช้ข้อมูล</h2>
                                </div>
                                <div className="prose prose-lg max-w-none">
                                    <p className="text-gray-700 leading-relaxed mb-6">
                                        เราใช้ข้อมูลส่วนบุคคลของท่านเพื่อวัตถุประสงค์หลักดังต่อไปนี้:
                                    </p>
                                    <ul className="space-y-4">
                                        <li className="flex items-start space-x-3">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
                                            <div>
                                                <strong className="text-gray-900">เพื่อให้บริการและอำนวยความสะดวกในการค้นหา:</strong>
                                                <span className="text-gray-700"> รวมถึงการแสดงผลข้อมูลที่พัก, การเปรียบเทียบข้อมูล, และการช่วยนำทางท่านไปยังเว็บไซต์ของผู้ให้บริการที่พักเพื่อทำการจอง</span>
                                            </div>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
                                            <div>
                                                <strong className="text-gray-900">เพื่อปรับปรุงและพัฒนาบริการของเรา:</strong>
                                                <span className="text-gray-700"> รวมถึงการวิเคราะห์แนวโน้มการใช้งาน, การทำวิจัยตลาด, การแก้ไขข้อผิดพลาด, และการพัฒนาคุณสมบัติใหม่ๆ</span>
                                            </div>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
                                            <div>
                                                <strong className="text-gray-900">เพื่อป้องกันการฉ้อโกงและเพิ่มความปลอดภัย:</strong>
                                                <span className="text-gray-700"> รวมถึงการตรวจสอบกิจกรรมที่น่าสงสัย, การปกป้องบัญชีของผู้ใช้งาน, และการบังคับใช้ข้อกำหนดและเงื่อนไขของเรา</span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            {/* Section 3: Data Disclosure */}
                            <section id="data-disclosure" className="mb-12">
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                                        <Eye className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">3. การเปิดเผยข้อมูล</h2>
                                </div>
                                <div className="prose prose-lg max-w-none">
                                    <p className="text-gray-700 leading-relaxed mb-6">
                                        เราอาจเปิดเผยข้อมูลส่วนบุคคลของท่านให้กับบุคคลที่สามหรือหน่วยงานดังต่อไปนี้ เฉพาะเมื่อมีความจำเป็นและเป็นไปตามวัตถุประสงค์ที่ระบุไว้:
                                    </p>
                                    <ul className="space-y-4">
                                        <li className="flex items-start space-x-3">
                                            <div className="w-2 h-2 bg-purple-500 rounded-full mt-3 flex-shrink-0"></div>
                                            <div>
                                                <strong className="text-gray-900">ผู้ให้บริการภายนอก:</strong>
                                                <span className="text-gray-700"> เช่น ผู้ให้บริการด้าน IT, ผู้ให้บริการวิเคราะห์ข้อมูล, หรือผู้ให้บริการด้านการตลาด ที่ทำหน้าที่ในนามของเราและภายใต้ข้อตกลงการรักษาความลับ</span>
                                            </div>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <div className="w-2 h-2 bg-purple-500 rounded-full mt-3 flex-shrink-0"></div>
                                            <div>
                                                <strong className="text-gray-900">หน่วยงานภาครัฐและหน่วยงานบังคับใช้กฎหมาย:</strong>
                                                <span className="text-gray-700"> หากกฎหมายกำหนดให้เราต้องเปิดเผย หรือเมื่อมีความจำเป็นอย่างสมเหตุสมผลเพื่อป้องกันอาชญากรรม</span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            {/* Section 4: Data Security */}
                            <section id="data-security" className="mb-12">
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                                        <Shield className="w-5 h-5 text-red-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">4. ความปลอดภัยของข้อมูล</h2>
                                </div>
                                <div className="prose prose-lg max-w-none">
                                    <p className="text-gray-700 leading-relaxed mb-6">
                                        เช็คที่พักให้ความสำคัญกับการปกป้องข้อมูลส่วนบุคคลของท่าน เราได้ใช้มาตรการรักษาความปลอดภัยทั้งทางเทคนิค การบริหารจัดการ และทางกายภาพที่เหมาะสม เพื่อป้องกันการเข้าถึง การใช้ การเปิดเผย การเปลี่ยนแปลง หรือการทำลายข้อมูลโดยไม่ได้รับอนุญาต
                                    </p>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                                            <h3 className="font-semibold text-gray-900 mb-3">การเข้ารหัสข้อมูล</h3>
                                            <p className="text-gray-700 text-sm">การเข้ารหัสข้อมูลที่ละเอียดอ่อนทั้งในระหว่างการส่งและจัดเก็บ</p>
                                        </div>
                                        <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                                            <h3 className="font-semibold text-gray-900 mb-3">การควบคุมการเข้าถึง</h3>
                                            <p className="text-gray-700 text-sm">การจำกัดการเข้าถึงข้อมูลส่วนบุคคลเฉพาะบุคลากรที่จำเป็น</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Section 5: User Rights */}
                            <section id="user-rights" className="mb-12">
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                                        <UserCheck className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">5. สิทธิของคุณในฐานะเจ้าของข้อมูล</h2>
                                </div>
                                <div className="prose prose-lg max-w-none">
                                    <p className="text-gray-700 leading-relaxed mb-6">
                                        ท่านมีสิทธิในการจัดการข้อมูลส่วนบุคคลของท่านตามที่กฎหมายคุ้มครองข้อมูลส่วนบุคคลกำหนด ซึ่งรวมถึง:
                                    </p>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="flex items-start space-x-3 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                                            <Eye className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <strong className="text-gray-900">สิทธิในการเข้าถึง</strong>
                                                <p className="text-gray-700 text-sm mt-1">ขอเข้าถึงและขอรับสำเนาข้อมูลส่วนบุคคลของท่าน</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                                            <Edit className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <strong className="text-gray-900">สิทธิในการแก้ไข</strong>
                                                <p className="text-gray-700 text-sm mt-1">ขอแก้ไขข้อมูลส่วนบุคคลให้ถูกต้องและเป็นปัจจุบัน</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                                            <Trash2 className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <strong className="text-gray-900">สิทธิในการลบ</strong>
                                                <p className="text-gray-700 text-sm mt-1">ขอให้เราลบหรือทำลายข้อมูลส่วนบุคคลของท่าน</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                                            <X className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <strong className="text-gray-900">สิทธิในการถอนความยินยอม</strong>
                                                <p className="text-gray-700 text-sm mt-1">ถอนความยินยอมการประมวลผลข้อมูลเมื่อใดก็ได้</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Section 6: Cookies */}
                            <section id="cookies" className="mb-12">
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                                        <Edit className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">6. การใช้คุกกี้และเทคโนโลยีที่คล้ายกัน</h2>
                                </div>
                                <div className="prose prose-lg max-w-none">
                                    <p className="text-gray-700 leading-relaxed mb-6">
                                        เช็คที่พักใช้คุกกี้ (Cookies) และเทคโนโลยีที่คล้ายกัน เช่น Web Beacons หรือ Pixel Tags เพื่อปรับปรุงประสบการณ์การใช้งานของท่าน
                                    </p>
                                    <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
                                        <h3 className="font-semibold text-gray-900 mb-3">เราใช้คุกกี้เพื่อ:</h3>
                                        <ul className="space-y-2 text-gray-700">
                                            <li>• จดจำการตั้งค่า (หากมีการตั้งค่า) และการเข้าสู่ระบบของท่าน</li>
                                            <li>• วิเคราะห์พฤติกรรมการใช้งานเพื่อปรับปรุงประสิทธิภาพ</li>
                                            <li>• นำเสนอเนื้อหาและโฆษณาที่เกี่ยวข้องกับความสนใจ</li>
                                            <li>• วัดผลและติดตามประสิทธิภาพของแคมเปญการตลาด</li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            {/* Section 7: Policy Changes */}
                            <section id="policy-changes" className="mb-12">
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                                        <Download className="w-5 h-5 text-teal-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">7. การเปลี่ยนแปลงนโยบายความเป็นส่วนตัว</h2>
                                </div>
                                <div className="prose prose-lg max-w-none">
                                    <p className="text-gray-700 leading-relaxed">
                                        เช็คที่พักอาจมีการแก้ไขหรือปรับปรุงนโยบายความเป็นส่วนตัวฉบับนี้เป็นครั้งคราว เพื่อให้สอดคล้องกับการเปลี่ยนแปลงของกฎหมาย แนวปฏิบัติ หรือการเปลี่ยนแปลงบริการของเรา เราจะแจ้งให้ท่านทราบถึงการเปลี่ยนแปลงที่สำคัญใดๆ โดยการประกาศบนเว็บไซต์ของเรา หรือผ่านช่องทางการสื่อสารอื่นที่เหมาะสม
                                    </p>
                                </div>
                            </section>

                            {/* Section 8: Contact */}
                            <section id="contact" className="mb-12">
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                        <Mail className="w-5 h-5 text-green-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">8. ช่องทางการติดต่อ</h2>
                                </div>
                                <div className="prose prose-lg max-w-none">
                                    <p className="text-gray-700 leading-relaxed mb-6">
                                        หากท่านมีข้อสงสัยเกี่ยวกับนโยบายความเป็นส่วนตัวฉบับนี้ หรือต้องการใช้สิทธิเกี่ยวกับข้อมูลส่วนบุคคลของท่าน โปรดติดต่อเราได้ที่:
                                    </p>
                                    <div className="bg-green-50 p-8 rounded-xl border border-green-200">
                                        <h3 className="text-xl font-bold text-gray-900 mb-4">เช็คที่พัก</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-start space-x-3">
                                                <MapPin className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <strong className="text-gray-900">ที่อยู่:</strong>
                                                    <p className="text-gray-700">[ระบุที่อยู่ของบริษัท/สำนักงานใหญ่]</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <Mail className="w-5 h-5 text-green-600 flex-shrink-0" />
                                                <div>
                                                    <strong className="text-gray-900">อีเมล:</strong>
                                                    <span className="text-green-600 ml-2">checkteepuk@gmail.com</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <Phone className="w-5 h-5 text-green-600 flex-shrink-0" />
                                                <div>
                                                    <strong className="text-gray-900">โทรศัพท์:</strong>
                                                    <span className="text-gray-700 ml-2">[ระบุเบอร์โทรศัพท์]</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <Clock className="w-5 h-5 text-green-600 flex-shrink-0" />
                                                <div>
                                                    <strong className="text-gray-900">เวลาทำการ:</strong>
                                                    <span className="text-gray-700 ml-2">[ระบุวันและเวลาทำการ]</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                    
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll to Top Button */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 w-12 h-12 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all duration-200 flex items-center justify-center z-50"
                >
                    <ChevronUp className="w-6 h-6" />
                </button>
            )}
        </div>
    );
}

export default App;