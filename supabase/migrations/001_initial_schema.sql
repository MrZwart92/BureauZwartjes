-- Bureau Zwartjes Database Schema
-- Multi-tenant structure for future client portal and admin dashboard

-- Organizations (tenants)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('admin', 'client')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- User profiles (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id),
  full_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('admin', 'member')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Intake submissions (from chat)
CREATE TABLE intakes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  business_name TEXT,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  prd_content JSONB,
  conversation_history JSONB,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Projects/Websites
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) NOT NULL,
  intake_id UUID REFERENCES intakes(id),
  name TEXT NOT NULL,
  domain TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'building', 'live', 'paused')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Support tickets (future)
CREATE TABLE tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for common queries
CREATE INDEX idx_profiles_organization ON profiles(organization_id);
CREATE INDEX idx_intakes_organization ON intakes(organization_id);
CREATE INDEX idx_intakes_status ON intakes(status);
CREATE INDEX idx_projects_organization ON projects(organization_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_tickets_project ON tickets(project_id);
CREATE INDEX idx_tickets_status ON tickets(status);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_intakes_updated_at BEFORE UPDATE ON intakes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON tickets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security Policies

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE intakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles p
    JOIN organizations o ON p.organization_id = o.id
    WHERE p.id = auth.uid() AND o.type = 'admin'
  );
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Helper function to get user's organization
CREATE OR REPLACE FUNCTION user_organization_id()
RETURNS UUID AS $$
BEGIN
  RETURN (SELECT organization_id FROM profiles WHERE id = auth.uid());
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Organizations policies
CREATE POLICY "Admins can view all organizations" ON organizations
  FOR SELECT USING (is_admin());

CREATE POLICY "Users can view their own organization" ON organizations
  FOR SELECT USING (id = user_organization_id());

-- Profiles policies
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (is_admin());

CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (id = auth.uid());

-- Intakes policies (public can insert for landing page)
CREATE POLICY "Anyone can create an intake" ON intakes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all intakes" ON intakes
  FOR SELECT USING (is_admin());

CREATE POLICY "Users can view their org intakes" ON intakes
  FOR SELECT USING (organization_id = user_organization_id());

CREATE POLICY "Admins can update intakes" ON intakes
  FOR UPDATE USING (is_admin());

-- Projects policies
CREATE POLICY "Admins can view all projects" ON projects
  FOR SELECT USING (is_admin());

CREATE POLICY "Users can view their org projects" ON projects
  FOR SELECT USING (organization_id = user_organization_id());

CREATE POLICY "Admins can manage projects" ON projects
  FOR ALL USING (is_admin());

-- Tickets policies
CREATE POLICY "Admins can view all tickets" ON tickets
  FOR SELECT USING (is_admin());

CREATE POLICY "Users can view their org tickets" ON tickets
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = tickets.project_id
      AND p.organization_id = user_organization_id()
    )
  );

CREATE POLICY "Users can create tickets for their projects" ON tickets
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = project_id
      AND p.organization_id = user_organization_id()
    )
  );

CREATE POLICY "Admins can manage tickets" ON tickets
  FOR ALL USING (is_admin());

-- Seed the admin organization
INSERT INTO organizations (name, slug, type) VALUES
  ('Bureau Zwartjes', 'bureau-zwartjes', 'admin');
