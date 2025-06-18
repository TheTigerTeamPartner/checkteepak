-- Mock data for Check Teepak Database
-- Run this in your Supabase SQL Editor to populate test data

-- Create tables first (if not exists)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'agent')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.agents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    image_url TEXT,
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('verified', 'new', 'experienced')),
    rating DECIMAL(2,1) DEFAULT 0.0,
    review_count INTEGER DEFAULT 0,
    phone VARCHAR(20),
    specialties TEXT[], -- Array of specialties
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.accommodations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    image_url TEXT,
    rating DECIMAL(2,1) DEFAULT 0.0,
    review_count INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    agent_id UUID REFERENCES public.agents(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    reporter_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    reported_agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'investigating', 'resolved', 'dismissed')),
    evidence_urls TEXT[], -- Array of evidence file URLs
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    plan_type VARCHAR(20) NOT NULL CHECK (plan_type IN ('basic', 'premium', 'enterprise')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'cancelled')),
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert mock users
INSERT INTO public.users (id, email, name, phone, role, status) VALUES
('11111111-1111-1111-1111-111111111111', 'admin@checkteepak.com', 'ผู้ดูแลระบบ', '02-123-4567', 'admin', 'active'),
('22222222-2222-2222-2222-222222222222', 'user1@example.com', 'สมชาย ใจดี', '081-234-5678', 'user', 'active'),
('33333333-3333-3333-3333-333333333333', 'user2@example.com', 'มาลี สวยงาม', '082-345-6789', 'user', 'active'),
('44444444-4444-4444-4444-444444444444', 'user3@example.com', 'วิชัย ท่องเที่ยว', '083-456-7890', 'user', 'active'),
('55555555-5555-5555-5555-555555555555', 'user4@example.com', 'นภา พาเที่ยว', '084-567-8901', 'user', 'active');

-- Insert mock agents
INSERT INTO public.agents (id, user_id, name, location, image_url, status, rating, review_count, phone, specialties) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'คุณสมชาย ใจดี', 'เชียงใหม่', '/placeholder.svg?height=200&width=200', 'verified', 4.8, 47, '081-234-5678', ARRAY['คอนโด', 'บ้านเดี่ยว']),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', 'คุณมาลี สวยงาม', 'ภูเก็ต', '/placeholder.svg?height=200&width=200', 'experienced', 4.6, 32, '082-345-6789', ARRAY['วิลล่า', 'รีสอร์ท']),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '44444444-4444-4444-4444-444444444444', 'คุณวิชัย ท่องเที่ยว', 'กรุงเทพฯ', '/placeholder.svg?height=200&width=200', 'new', 4.2, 8, '083-456-7890', ARRAY['คอนโด', 'อพาร์ทเมนท์']),
('dddddddd-dddd-dddd-dddd-dddddddddddd', '55555555-5555-5555-5555-555555555555', 'คุณนภา พาเที่ยว', 'กระบี่', '/placeholder.svg?height=200&width=200', 'verified', 4.9, 65, '084-567-8901', ARRAY['วิลล่า', 'บังกะโล']);

-- Insert mock accommodations
INSERT INTO public.accommodations (id, name, location, image_url, rating, review_count, is_verified, agent_id) VALUES
('11111111-aaaa-bbbb-cccc-111111111111', 'เดอะ ริเวอร์ไซด์ รีสอร์ท', 'กาญจนบุรี', '/placeholder.svg?height=200&width=300', 4.8, 124, TRUE, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('22222222-aaaa-bbbb-cccc-222222222222', 'ซีบรีซ โฮเทล', 'ชลบุรี', '/placeholder.svg?height=200&width=300', 4.6, 98, TRUE, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
('33333333-aaaa-bbbb-cccc-333333333333', 'มาวิน เมาน์เทน วิลล่า', 'เชียงราย', '/placeholder.svg?height=200&width=300', 4.9, 87, TRUE, 'cccccccc-cccc-cccc-cccc-cccccccccccc'),
('44444444-aaaa-bbbb-cccc-444444444444', 'ทรอปิคอล บีช รีสอร์ท', 'สมุย', '/placeholder.svg?height=200&width=300', 4.7, 156, TRUE, 'dddddddd-dddd-dddd-dddd-dddddddddddd');

-- Insert mock reports
INSERT INTO public.reports (id, reporter_id, reported_agent_id, title, description, status) VALUES
('rrrrrrrr-1111-1111-1111-rrrrrrrrrrrr', '22222222-2222-2222-2222-222222222222', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'นายหน้าไม่ตอบโทรศัพท์', 'ติดต่อหลายครั้งแต่ไม่ตอบรับสาย และไม่มีการโทรกลับ', 'investigating'),
('rrrrrrrr-2222-2222-2222-rrrrrrrrrrrr', '33333333-3333-3333-3333-333333333333', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'ข้อมูลที่พักไม่ตรงกับความเป็นจริง', 'รูปภาพและข้อมูลที่แสดงไม่ตรงกับสถานที่จริง', 'pending');

-- Insert mock subscriptions
INSERT INTO public.subscriptions (id, user_id, plan_type, status, start_date, end_date) VALUES
('ssssssss-1111-1111-1111-ssssssssssss', '22222222-2222-2222-2222-222222222222', 'premium', 'active', NOW(), NOW() + INTERVAL '1 year'),
('ssssssss-2222-2222-2222-ssssssssssss', '33333333-3333-3333-3333-333333333333', 'basic', 'active', NOW(), NOW() + INTERVAL '1 month');

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accommodations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (basic examples)
CREATE POLICY "Users can view all agents" ON public.agents FOR SELECT USING (true);
CREATE POLICY "Users can view all accommodations" ON public.accommodations FOR SELECT USING (true);
CREATE POLICY "Users can view their own reports" ON public.reports FOR SELECT USING (auth.uid() = reporter_id);
CREATE POLICY "Users can create reports" ON public.reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "Users can view their own subscriptions" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.agents TO anon, authenticated;
GRANT SELECT ON public.accommodations TO anon, authenticated;
GRANT ALL ON public.reports TO authenticated;
GRANT ALL ON public.subscriptions TO authenticated;
GRANT ALL ON public.users TO authenticated;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_agents_status ON public.agents(status);
CREATE INDEX IF NOT EXISTS idx_agents_location ON public.agents(location);
CREATE INDEX IF NOT EXISTS idx_accommodations_verified ON public.accommodations(is_verified);
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
