'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  Briefcase, 
  Code, 
  Award, 
  FileText, 
  Settings, 
  LogOut,
  Plus,
  Edit,
  Trash2,
  Save,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { GlassCard } from '@/components/glass-card'
import { Project, Experience, Skill, Service, BlogPost } from '@/types'

type Tab = 'dashboard' | 'projects' | 'experience' | 'skills' | 'services' | 'blog' | 'config'

export default function AdminPanel() {
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const router = useRouter()

  // Data states
  const [projects, setProjects] = useState<Project[]>([])
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (authenticated) {
      loadData()
    }
  }, [authenticated, activeTab])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/auth')
      const data = await response.json()
      if (data.authenticated) {
        setAuthenticated(true)
      } else {
        router.push('/admin/login')
      }
    } catch (error) {
      router.push('/admin/login')
    } finally {
      setLoading(false)
    }
  }

  const loadData = async () => {
    try {
      const [projectsRes, expRes, skillsRes, servicesRes, blogRes] = await Promise.all([
        fetch('/api/portfolio/projects'),
        fetch('/api/portfolio/experience'),
        fetch('/api/portfolio/skills'),
        fetch('/api/portfolio/services'),
        fetch('/api/portfolio/blog'),
      ])

      const [projectsData, expData, skillsData, servicesData, blogData] = await Promise.all([
        projectsRes.json(),
        expRes.json(),
        skillsRes.json(),
        servicesRes.json(),
        blogRes.json(),
      ])

      setProjects(projectsData.projects || [])
      setExperiences(expData.experiences || [])
      setSkills(skillsData.skills || [])
      setServices(servicesData.services || [])
      setBlogPosts(blogData.blogPosts || [])
    } catch (error) {
      console.error('Failed to load data:', error)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    )
  }

  if (!authenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/90 premium-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <LayoutDashboard className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold gradient-text">Admin Panel</h1>
            </div>
            <Button variant="outline" onClick={handleLogout} size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <GlassCard className="p-4 glow">
              <nav className="space-y-2">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                  { id: 'projects', label: 'Projects', icon: Briefcase },
                  { id: 'experience', label: 'Experience', icon: Award },
                  { id: 'skills', label: 'Skills', icon: Code },
                  { id: 'services', label: 'Services', icon: FileText },
                  { id: 'blog', label: 'Blog', icon: FileText },
                  { id: 'config', label: 'Settings', icon: Settings },
                ].map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as Tab)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        activeTab === tab.id
                          ? 'bg-primary text-primary-foreground shadow-lg'
                          : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  )
                })}
              </nav>
            </GlassCard>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {activeTab === 'dashboard' && (
              <DashboardView 
                projects={projects}
                experiences={experiences}
                skills={skills}
                services={services}
                blogPosts={blogPosts}
              />
            )}
            {activeTab === 'projects' && (
              <ProjectsManager 
                projects={projects}
                onUpdate={loadData}
                editingItem={editingItem}
                setEditingItem={setEditingItem}
              />
            )}
            {activeTab === 'experience' && (
              <ExperienceManager 
                experiences={experiences}
                onUpdate={loadData}
                editingItem={editingItem}
                setEditingItem={setEditingItem}
              />
            )}
            {activeTab === 'skills' && (
              <SkillsManager 
                skills={skills}
                onUpdate={loadData}
                editingItem={editingItem}
                setEditingItem={setEditingItem}
              />
            )}
            {activeTab === 'services' && (
              <ServicesManager 
                services={services}
                onUpdate={loadData}
                editingItem={editingItem}
                setEditingItem={setEditingItem}
              />
            )}
            {activeTab === 'blog' && (
              <BlogManager 
                blogPosts={blogPosts}
                onUpdate={loadData}
                editingItem={editingItem}
                setEditingItem={setEditingItem}
              />
            )}
            {activeTab === 'config' && <ConfigManager />}
          </main>
        </div>
      </div>
    </div>
  )
}

// Dashboard View Component
function DashboardView({ projects, experiences, skills, services, blogPosts }: any) {
  const stats = [
    { label: 'Projects', value: projects.length, icon: Briefcase, color: 'from-primary to-accent' },
    { label: 'Experience', value: experiences.length, icon: Award, color: 'from-accent to-primary' },
    { label: 'Skills', value: skills.length, icon: Code, color: 'from-primary to-purple-500' },
    { label: 'Services', value: services.length, icon: FileText, color: 'from-purple-500 to-accent' },
    { label: 'Blog Posts', value: blogPosts.length, icon: FileText, color: 'from-accent to-primary' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2 gradient-text">Dashboard</h2>
        <p className="text-muted-foreground">Manage your portfolio content</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="p-6 glow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// Projects Manager Component
function ProjectsManager({ projects, onUpdate, editingItem, setEditingItem }: any) {
  const [formData, setFormData] = useState<Partial<Project>>({})

  const handleCreate = () => {
    setFormData({})
    setEditingItem('new')
  }

  const handleEdit = (project: Project) => {
    setFormData(project)
    setEditingItem(project.id)
  }

  const handleSave = async () => {
    try {
      const url = '/api/portfolio/projects'
      const method = editingItem === 'new' ? 'POST' : 'PUT'
      
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      setEditingItem(null)
      setFormData({})
      onUpdate()
    } catch (error) {
      console.error('Failed to save project:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    try {
      await fetch(`/api/portfolio/projects?id=${id}`, { method: 'DELETE' })
      onUpdate()
    } catch (error) {
      console.error('Failed to delete project:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2 gradient-text">Projects</h2>
          <p className="text-muted-foreground">Manage your portfolio projects</p>
        </div>
        <Button onClick={handleCreate} className="glow-effect-hover">
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </div>

      {(editingItem === 'new' || editingItem) && (
        <GlassCard className="p-6 glow">
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <Label>Image URL</Label>
                <Input
                  value={formData.image || ''}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <Label>Technologies (comma separated)</Label>
              <Input
                value={formData.technologies?.join(', ') || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  technologies: e.target.value.split(',').map(t => t.trim()) 
                })}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>GitHub URL</Label>
                <Input
                  value={formData.githubUrl || ''}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                />
              </div>
              <div>
                <Label>Live URL</Label>
                <Input
                  value={formData.liveUrl || ''}
                  onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured || false}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="featured">Featured</Label>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleSave} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" onClick={() => setEditingItem(null)} className="flex-1">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        </GlassCard>
      )}

      <div className="grid gap-4">
        {projects.map((project: Project) => (
          <GlassCard key={project.id} className="p-6 glow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-muted-foreground mb-3">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies?.map((tech, i) => (
                    <span key={i} className="px-2 py-1 bg-muted rounded text-xs">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <Button variant="outline" size="sm" onClick={() => handleEdit(project)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(project.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}

// Placeholder components for other managers
function ExperienceManager({ experiences, onUpdate, editingItem, setEditingItem }: any) {
  return <div>Experience Manager - Similar structure to Projects Manager</div>
}

function SkillsManager({ skills, onUpdate, editingItem, setEditingItem }: any) {
  return <div>Skills Manager - Similar structure to Projects Manager</div>
}

function ServicesManager({ services, onUpdate, editingItem, setEditingItem }: any) {
  return <div>Services Manager - Similar structure to Projects Manager</div>
}

function BlogManager({ blogPosts, onUpdate, editingItem, setEditingItem }: any) {
  return <div>Blog Manager - Similar structure to Projects Manager</div>
}

function ConfigManager() {
  const [config, setConfig] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/portfolio/config')
      .then(res => res.json())
      .then(data => {
        setConfig(data.config || {})
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch('/api/portfolio/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      })
      alert('Configuration saved successfully!')
    } catch (error) {
      alert('Failed to save configuration')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div>Loading configuration...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2 gradient-text">Site Configuration</h2>
        <p className="text-muted-foreground">Manage your portfolio settings</p>
      </div>

      <GlassCard className="p-6 glow">
        <div className="space-y-6">
          <div>
            <Label>Resume URL</Label>
            <Input
              value={config.resumeUrl || ''}
              onChange={(e) => setConfig({ ...config, resumeUrl: e.target.value })}
              placeholder="/resume.pdf or https://example.com/resume.pdf"
            />
            <p className="text-sm text-muted-foreground mt-2">
              Enter the path to your resume file. Can be a local path (e.g., /resume.pdf) or external URL
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Name</Label>
              <Input
                value={config.name || ''}
                onChange={(e) => setConfig({ ...config, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Title</Label>
              <Input
                value={config.title || ''}
                onChange={(e) => setConfig({ ...config, title: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              value={config.description || ''}
              onChange={(e) => setConfig({ ...config, description: e.target.value })}
              rows={3}
            />
          </div>

          <div>
            <Label>Site URL</Label>
            <Input
              value={config.url || ''}
              onChange={(e) => setConfig({ ...config, url: e.target.value })}
            />
          </div>

          <div className="border-t border-border/50 pt-6">
            <h3 className="text-lg font-semibold mb-4">Social Links</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>GitHub URL</Label>
                <Input
                  value={config.links?.github || ''}
                  onChange={(e) => setConfig({ 
                    ...config, 
                    links: { ...config.links, github: e.target.value }
                  })}
                />
              </div>
              <div>
                <Label>LinkedIn URL</Label>
                <Input
                  value={config.links?.linkedin || ''}
                  onChange={(e) => setConfig({ 
                    ...config, 
                    links: { ...config.links, linkedin: e.target.value }
                  })}
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={config.links?.email || ''}
                  onChange={(e) => setConfig({ 
                    ...config, 
                    links: { ...config.links, email: e.target.value }
                  })}
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  value={config.links?.phone || ''}
                  onChange={(e) => setConfig({ 
                    ...config, 
                    links: { ...config.links, phone: e.target.value }
                  })}
                />
              </div>
            </div>
          </div>

          <Button onClick={handleSave} className="w-full" disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Configuration'}
          </Button>
        </div>
      </GlassCard>
    </div>
  )
}

