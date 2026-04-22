'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
  Card, CardContent, CardDescription, CardHeader, CardTitle,
  Badge, Button, Input, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
  ScrollArea, Separator, Avatar, AvatarFallback, Tooltip,
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from '@/components/ui'
import {
  Bot, Send, Plus, MessageSquare, Search, Sparkles, BookOpen, Trash2,
  ChevronLeft, ChevronRight, Code, Shield, Lightbulb, Building2, History,
  Copy, Check, RefreshCw, Settings, X, Loader2, ChevronDown, Hash, Link2, Tag, FolderOpen
} from 'lucide-react'
import { Toaster, toast } from 'sonner'

// ==================== Types ====================
interface Skill {
  id: string
  name: string
  description: string
  content: string
  references: string
  tags: string[]
  category: string
  order: number
}

interface SkillPack {
  id: string
  name: string
  description: string
  icon: string
  order: number
  skills: Skill[]
}

interface Agent {
  id: string
  name: string
  description: string
  avatar: string
  systemPrompt: string
  model: string
}

interface Message {
  id: string
  role: string
  content: string
  createdAt: string
}

interface Conversation {
  id: string
  title: string
  model: string
  agentId: string | null
  agent: { id: string; name: string; avatar: string } | null
  _count: { messages: number }
  createdAt: string
  updatedAt: string
}

interface ModelOption {
  id: string
  name: string
  provider: string
}

// ==================== App Component ====================
export default function Home() {
  const [initialized, setInitialized] = useState(false)
  const [loading, setLoading] = useState(true)

  // Initialize app - seed data if needed
  useEffect(() => {
    async function init() {
      try {
        const res = await fetch('/api/seed')
        const data = await res.json()
        if (!data.initialized) {
          await fetch('/api/seed', { method: 'POST' })
        }
        setInitialized(true)
      } catch (e) {
        console.error('Init error:', e)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto animate-spin rounded-full border-4 border-slate-200 border-t-slate-800" />
          <p className="text-slate-500 text-lg">仓颉平台加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-slate-800 to-slate-600 flex items-center justify-center text-white font-bold text-lg">
                仓
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">仓颉平台</h1>
                <p className="text-xs text-slate-500 hidden sm:block">知识蒸馏技能管理系统</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="hidden sm:flex gap-1">
                <Sparkles className="w-3 h-3" />
                NVIDIA AI
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Tabs defaultValue="chat" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 h-12">
              <TabsTrigger value="chat" className="gap-2 text-sm sm:text-base">
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline">智能对话</span>
                <span className="sm:hidden">对话</span>
              </TabsTrigger>
              <TabsTrigger value="skills" className="gap-2 text-sm sm:text-base">
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">技能管理</span>
                <span className="sm:hidden">技能</span>
              </TabsTrigger>
              <TabsTrigger value="distill" className="gap-2 text-sm sm:text-base">
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">知识蒸馏</span>
                <span className="sm:hidden">蒸馏</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat">
              <ChatTab />
            </TabsContent>
            <TabsContent value="skills">
              <SkillsTab />
            </TabsContent>
            <TabsContent value="distill">
              <DistillTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/50 backdrop-blur-sm mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-slate-500">
            仓颉平台 · 基于NVIDIA AI的知识蒸馏技能管理系统
          </p>
        </div>
      </footer>

      <Toaster position="top-right" richColors />
    </div>
  )
}

// ==================== Chat Tab ====================
function ChatTab() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState('meta/llama-3.1-8b-instruct')
  const [selectedAgent, setSelectedAgent] = useState<string>('none')
  const [agents, setAgents] = useState<Agent[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [modelsOpen, setModelsOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const models: ModelOption[] = [
    { id: 'meta/llama-3.1-8b-instruct', name: 'Llama 3.1 8B', provider: 'NVIDIA' },
    { id: 'meta/llama-3.1-70b-instruct', name: 'Llama 3.1 70B', provider: 'NVIDIA' },
    { id: 'mistralai/mixtral-8x22b-instruct-v0.1', name: 'Mixtral 8x22B', provider: 'NVIDIA' },
    { id: 'google/gemma-2-9b-it', name: 'Gemma 2 9B', provider: 'NVIDIA' },
    { id: 'nvidia/nemotron-4-340b-instruct', name: 'Nemotron 340B', provider: 'NVIDIA' },
  ]

  // Load agents
  useEffect(() => {
    fetch('/api/agents').then(r => r.json()).then(setAgents).catch(console.error)
  }, [])

  // Load conversations
  const loadConversations = useCallback(async () => {
    try {
      const res = await fetch('/api/conversations')
      const data = await res.json()
      setConversations(data)
    } catch (e) {
      console.error('Load conversations error:', e)
    }
  }, [])

  useEffect(() => {
    loadConversations()
  }, [loadConversations])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Create new conversation
  const createNewConversation = async () => {
    try {
      const agentId = selectedAgent !== 'none' ? selectedAgent : null
      const agent = agents.find(a => a.id === agentId)
      const title = agent ? `与${agent.name}的对话` : '新对话'
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, agentId, model: selectedModel }),
      })
      const conv = await res.json()
      setConversations(prev => [conv, ...prev])
      setCurrentConversation(conv)
      setMessages([])
      setShowHistory(false)
      inputRef.current?.focus()
    } catch (e) {
      toast.error('创建会话失败')
    }
  }

  // Load conversation messages
  const loadConversation = async (conv: Conversation) => {
    try {
      const res = await fetch(`/api/conversations/${conv.id}`)
      const data = await res.json()
      setCurrentConversation(data)
      setMessages(data.messages || [])
      setSelectedModel(data.model || 'meta/llama-3.1-8b-instruct')
      setSelectedAgent(data.agentId || 'none')
      setShowHistory(false)
    } catch (e) {
      toast.error('加载会话失败')
    }
  }

  // Delete conversation
  const deleteConversation = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await fetch(`/api/conversations/${id}`, { method: 'DELETE' })
      setConversations(prev => prev.filter(c => c.id !== id))
      if (currentConversation?.id === id) {
        setCurrentConversation(null)
        setMessages([])
      }
      toast.success('会话已删除')
    } catch (e) {
      toast.error('删除失败')
    }
  }

  // Send message
  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    // Create conversation if none exists
    let convId = currentConversation?.id
    if (!convId) {
      const agentId = selectedAgent !== 'none' ? selectedAgent : null
      const agent = agents.find(a => a.id === agentId)
      const title = agent ? `与${agent.name}的对话` : inputMessage.slice(0, 30)
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title + (inputMessage.length > 30 ? '...' : ''), agentId, model: selectedModel }),
      })
      const conv = await res.json()
      convId = conv.id
      setCurrentConversation(conv)
      setConversations(prev => [conv, ...prev])
    }

    // Add user message to UI immediately
    const userMsg: Message = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: inputMessage.trim(),
      createdAt: new Date().toISOString(),
    }
    setMessages(prev => [...prev, userMsg])
    setInputMessage('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: convId,
          message: userMsg.content,
          model: selectedModel,
          agentId: selectedAgent !== 'none' ? selectedAgent : undefined,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || '发送失败')
      }

      const data = await res.json()
      setMessages(prev => [...prev, data.message])
      // Refresh conversation list to update titles
      loadConversations()
    } catch (e: any) {
      toast.error(e.message || 'AI回复失败，请重试')
      // Remove the user message on error
      setMessages(prev => prev.filter(m => m.id !== userMsg.id))
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const currentModelName = models.find(m => m.id === selectedModel)?.name || selectedModel

  return (
    <div className="flex h-[calc(100vh-13rem)] gap-4">
      {/* Sidebar - Conversation History */}
      <div className={`${showHistory ? 'fixed inset-0 z-50 bg-black/50' : ''} lg:relative lg:bg-transparent lg:z-auto`}>
        <Sheet open={showHistory} onOpenChange={setShowHistory}>
          <SheetContent side="left" className="w-80 p-0">
            <SheetHeader className="p-4 border-b">
              <SheetTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                历史对话
              </SheetTitle>
            </SheetHeader>
            <div className="p-3 border-b">
              <Button onClick={createNewConversation} className="w-full gap-2">
                <Plus className="w-4 h-4" />
                新建会话
              </Button>
            </div>
            <ScrollArea className="h-[calc(100vh-14rem)]">
              <div className="p-2 space-y-1">
                {conversations.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">暂无对话记录</p>
                    <p className="text-xs mt-1">点击上方按钮新建会话</p>
                  </div>
                ) : (
                  conversations.map(conv => (
                    <div
                      key={conv.id}
                      onClick={() => loadConversation(conv)}
                      className={`group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        currentConversation?.id === conv.id
                          ? 'bg-slate-100 text-slate-900'
                          : 'hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback className="text-sm bg-slate-200">
                          {conv.agent?.avatar || '💬'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{conv.title}</p>
                        <p className="text-xs text-slate-400">
                          {conv._count?.messages || 0} 条消息
                        </p>
                      </div>
                      <button
                        onClick={(e) => deleteConversation(conv.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-200 rounded transition-opacity"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border overflow-hidden">
        {/* Chat Header */}
        <div className="border-b p-4 flex items-center gap-3 flex-wrap">
          {/* History Button (mobile) + New Conversation */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHistory(true)}
            className="lg:hidden gap-1"
          >
            <History className="w-4 h-4" />
            历史
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={createNewConversation}
            className="gap-1"
          >
            <Plus className="w-4 h-4" />
            新对话
          </Button>

          <Separator orientation="vertical" className="h-6 hidden sm:block" />

          {/* Agent Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 shrink-0">助手:</span>
            <Select value={selectedAgent} onValueChange={setSelectedAgent}>
              <SelectTrigger className="w-[160px] h-8 text-sm">
                <SelectValue placeholder="选择助手" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">
                  <span className="flex items-center gap-2">🤖 通用助手</span>
                </SelectItem>
                {agents.map(agent => (
                  <SelectItem key={agent.id} value={agent.id}>
                    <span className="flex items-center gap-2">
                      {agent.avatar} {agent.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Model Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 shrink-0">模型:</span>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-[200px] h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {models.map(model => (
                  <SelectItem key={model.id} value={model.id}>
                    <span className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">{model.provider}</span>
                      {model.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4 sm:p-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center mb-6">
                <Bot className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">开始新的对话</h3>
              <p className="text-slate-500 text-sm max-w-md mb-6">
                选择一个AI助手和模型，输入您的问题开始对话。支持代码审查、安全审计、架构设计等专业领域。
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg">
                {[
                  { text: '帮我审查这段代码', icon: <Code className="w-4 h-4" /> },
                  { text: '检查安全漏洞', icon: <Shield className="w-4 h-4" /> },
                  { text: '设计系统架构', icon: <Building2 className="w-4 h-4" /> },
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setInputMessage(item.text)
                      inputRef.current?.focus()
                    }}
                    className="flex items-center gap-2 p-3 text-sm border rounded-lg hover:bg-slate-50 transition-colors text-left text-slate-600"
                  >
                    {item.icon}
                    {item.text}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4 max-w-4xl mx-auto">
              {messages.map((msg, index) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <Avatar className="h-8 w-8 shrink-0 mt-1">
                    <AvatarFallback className={`text-sm ${
                      msg.role === 'user'
                        ? 'bg-slate-800 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {msg.role === 'user' ? '👤' : (currentConversation?.agent?.avatar || '🤖')}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`max-w-[80%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                    <div className={`inline-block rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-slate-800 text-white rounded-tr-sm'
                        : 'bg-slate-100 text-slate-800 rounded-tl-sm'
                    }`}>
                      <div className="whitespace-pre-wrap break-words">{msg.content}</div>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 px-1">
                      {new Date(msg.createdAt).toLocaleTimeString('zh-CN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8 shrink-0 mt-1">
                    <AvatarFallback className="text-sm bg-slate-100 text-slate-600">
                      {currentConversation?.agent?.avatar || '🤖'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t p-4">
          <div className="max-w-4xl mx-auto flex gap-3">
            <Textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入消息... (Shift+Enter换行，Enter发送)"
              className="min-h-[44px] max-h-[120px] resize-none flex-1"
              rows={1}
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              disabled={isLoading || !inputMessage.trim()}
              size="icon"
              className="h-[44px] w-[44px] shrink-0"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
          <p className="text-xs text-slate-400 mt-2 text-center">
            模型: {currentModelName} | 按 Enter 发送，Shift+Enter 换行
          </p>
        </div>
      </div>
    </div>
  )
}

// ==================== Skills Tab ====================
function SkillsTab() {
  const [skillPacks, setSkillPacks] = useState<SkillPack[]>([])
  const [expandedPack, setExpandedPack] = useState<string | null>(null)
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/skills')
      .then(r => r.json())
      .then(data => {
        setSkillPacks(data)
        if (data.length > 0) setExpandedPack(data[0].id)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filteredPacks = skillPacks.map(pack => ({
    ...pack,
    skills: pack.skills.filter(
      skill =>
        skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    ),
  })).filter(pack => pack.skills.length > 0)

  const packIcon = (icon: string) => {
    const map: Record<string, React.ReactNode> = {
      '🔍': <Code className="w-5 h-5" />,
      '🛡️': <Shield className="w-5 h-5" />,
      '✨': <Lightbulb className="w-5 h-5" />,
      '🏗️': <Building2 className="w-5 h-5" />,
    }
    return map[icon] || <BookOpen className="w-5 h-5" />
  }

  const packColor = (icon: string) => {
    const map: Record<string, string> = {
      '🔍': 'from-emerald-500 to-teal-600',
      '🛡️': 'from-red-500 to-rose-600',
      '✨': 'from-amber-500 to-orange-600',
      '🏗️': 'from-violet-500 to-purple-600',
    }
    return map[icon] || 'from-slate-500 to-slate-600'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-13rem)] gap-4">
      {/* Skills List */}
      <div className="w-full lg:w-1/2 flex flex-col gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜索技能名称、描述或标签..."
            className="pl-10"
          />
        </div>

        {/* Skill Packs */}
        <ScrollArea className="flex-1">
          <div className="space-y-3">
            {filteredPacks.map(pack => (
              <Card key={pack.id} className="overflow-hidden">
                <button
                  className="w-full text-left"
                  onClick={() => setExpandedPack(expandedPack === pack.id ? null : pack.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${packColor(pack.icon)} flex items-center justify-center text-white shrink-0`}>
                        {pack.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-base">{pack.name}</CardTitle>
                          <Badge variant="secondary" className="text-xs">
                            {pack.skills.length} 个技能
                          </Badge>
                        </div>
                        <CardDescription className="text-xs mt-1 line-clamp-1">
                          {pack.description}
                        </CardDescription>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${expandedPack === pack.id ? 'rotate-180' : ''}`} />
                    </div>
                  </CardHeader>
                </button>

                {expandedPack === pack.id && (
                  <CardContent className="pt-0 pb-4">
                    <div className="space-y-2">
                      {pack.skills.map(skill => (
                        <button
                          key={skill.id}
                          onClick={() => setSelectedSkill(skill)}
                          className={`w-full text-left p-3 rounded-lg transition-colors flex items-start gap-3 ${
                            selectedSkill?.id === skill.id
                              ? 'bg-slate-100 border border-slate-200'
                              : 'hover:bg-slate-50 border border-transparent'
                          }`}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium text-sm text-slate-800">{skill.name}</span>
                              {skill.tags.slice(0, 3).map(tag => (
                                <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <p className="text-xs text-slate-500 mt-1 line-clamp-1">{skill.description}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                        </button>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}

            {filteredPacks.length === 0 && searchTerm && (
              <div className="text-center py-12 text-slate-400">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">未找到匹配的技能</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Skill Detail Panel */}
      <div className="hidden lg:block w-1/2">
        {selectedSkill ? (
          <Card className="h-full overflow-hidden">
            <CardHeader className="border-b pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{selectedSkill.name}</CardTitle>
                  <CardDescription className="mt-1">{selectedSkill.description}</CardDescription>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                <Badge variant="outline" className="gap-1">
                  <FolderOpen className="w-3 h-3" />
                  {selectedSkill.category}
                </Badge>
                {selectedSkill.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    <Tag className="w-3 h-3" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-20rem)]">
                {/* Content Section */}
                <div className="p-5">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                    <BookOpen className="w-4 h-4" />
                    技能内容
                  </h3>
                  <div className="prose prose-sm prose-slate max-w-none">
                    {selectedSkill.content.split('\n').map((line, i) => {
                      if (line.startsWith('## ')) {
                        return <h2 key={i} className="text-base font-bold text-slate-800 mt-5 mb-2">{line.replace('## ', '')}</h2>
                      }
                      if (line.startsWith('### ')) {
                        return <h3 key={i} className="text-sm font-semibold text-slate-700 mt-4 mb-1.5">{line.replace('### ', '')}</h3>
                      }
                      if (line.startsWith('- **') || line.startsWith('1. **') || line.startsWith('2. **') || line.startsWith('3. **') || line.startsWith('4. **') || line.startsWith('5. **') || line.startsWith('6. **') || line.startsWith('7. **') || line.startsWith('8. **') || line.startsWith('9. **') || line.startsWith('10. **')) {
                        return <p key={i} className="text-sm text-slate-600 ml-2">{line}</p>
                      }
                      if (line.startsWith('```')) return null
                      if (line.startsWith('- ') || line.startsWith('* ')) {
                        return <p key={i} className="text-sm text-slate-600 ml-3">• {line.substring(2)}</p>
                      }
                      if (line.trim() === '') return <div key={i} className="h-2" />
                      return <p key={i} className="text-sm text-slate-600">{line}</p>
                    })}
                  </div>
                </div>

                {/* References Section */}
                <Separator />
                <div className="p-5">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                    <Link2 className="w-4 h-4" />
                    参考资料
                  </h3>
                  <div className="space-y-1.5">
                    {selectedSkill.references.split('\n').filter(Boolean).map((ref, i) => (
                      <p key={i} className="text-sm text-slate-500 flex items-start gap-2">
                        <Hash className="w-3 h-3 mt-1 shrink-0 text-slate-400" />
                        {ref.replace(/^- /, '')}
                      </p>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        ) : (
          <div className="h-full flex items-center justify-center text-center border rounded-xl bg-white">
            <div>
              <BookOpen className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <p className="text-slate-400">选择一个技能查看详细内容</p>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Skill Detail Dialog */}
      {selectedSkill && (
        <Dialog open={!!selectedSkill} onOpenChange={() => setSelectedSkill(null)}>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>{selectedSkill.name}</DialogTitle>
              <DialogDescription>{selectedSkill.description}</DialogDescription>
            </DialogHeader>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {selectedSkill.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="gap-1 text-xs">
                  <Tag className="w-3 h-3" />
                  {tag}
                </Badge>
              ))}
            </div>
            <ScrollArea className="max-h-[50vh]">
              <div className="space-y-4 pr-3">
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1">
                    <BookOpen className="w-4 h-4" /> 技能内容
                  </h4>
                  <div className="text-sm text-slate-600 space-y-1 whitespace-pre-wrap">
                    {selectedSkill.content}
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1">
                    <Link2 className="w-4 h-4" /> 参考资料
                  </h4>
                  <div className="text-sm text-slate-500 space-y-1 whitespace-pre-wrap">
                    {selectedSkill.references}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

// ==================== Distill Tab ====================
function DistillTab() {
  const [skillPacks, setSkillPacks] = useState<SkillPack[]>([])
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [prompt, setPrompt] = useState('')
  const [result, setResult] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState('meta/llama-3.1-8b-instruct')
  const [distillHistory, setDistillHistory] = useState<{ prompt: string; result: string; time: string }[]>([])

  useEffect(() => {
    fetch('/api/skills')
      .then(r => r.json())
      .then(setSkillPacks)
      .catch(console.error)
  }, [])

  const toggleSkill = (skillId: string) => {
    setSelectedSkills(prev =>
      prev.includes(skillId) ? prev.filter(id => id !== skillId) : [...prev, skillId]
    )
  }

  const selectPackSkills = (pack: SkillPack) => {
    const packSkillIds = pack.skills.map(s => s.id)
    const allSelected = packSkillIds.every(id => selectedSkills.includes(id))
    if (allSelected) {
      setSelectedSkills(prev => prev.filter(id => !packSkillIds.includes(id)))
    } else {
      setSelectedSkills(prev => [...new Set([...prev, ...packSkillIds])])
    }
  }

  const startDistill = async () => {
    if (selectedSkills.length === 0) {
      toast.error('请至少选择一个技能')
      return
    }

    setIsLoading(true)
    setResult('')

    try {
      const res = await fetch('/api/distill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skillIds: selectedSkills,
          prompt: prompt || '请基于选中的技能知识，提供一个全面的知识概览和分析报告。包括核心要点、关键技术和实践建议。',
          model: selectedModel,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || '蒸馏失败')
      }

      const data = await res.json()
      setResult(data.result)
      setDistillHistory(prev => [
        { prompt: prompt || '知识概览分析', result: data.result, time: new Date().toLocaleString('zh-CN') },
        ...prev.slice(0, 9),
      ])
      toast.success('知识蒸馏完成')
    } catch (e: any) {
      toast.error(e.message || '知识蒸馏失败')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-[calc(100vh-13rem)] gap-4 flex-col lg:flex-row">
      {/* Left: Skill Selection */}
      <div className="w-full lg:w-[380px] shrink-0 space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              选择知识源
            </CardTitle>
            <CardDescription>
              已选 {selectedSkills.length} 个技能（可多选）
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[280px] pr-2">
              <div className="space-y-3">
                {skillPacks.map(pack => {
                  const packSkillIds = pack.skills.map(s => s.id)
                  const allSelected = packSkillIds.every(id => selectedSkills.includes(id))
                  return (
                    <div key={pack.id}>
                      <button
                        onClick={() => selectPackSkills(pack)}
                        className="flex items-center gap-2 w-full text-left mb-2 group"
                      >
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          allSelected ? 'bg-slate-800 border-slate-800 text-white' : 'border-slate-300 group-hover:border-slate-400'
                        }`}>
                          {allSelected && <Check className="w-3 h-3" />}
                        </div>
                        <span className="text-sm font-medium">{pack.icon} {pack.name}</span>
                      </button>
                      <div className="ml-7 space-y-1">
                        {pack.skills.map(skill => (
                          <button
                            key={skill.id}
                            onClick={() => toggleSkill(skill.id)}
                            className="flex items-center gap-2 w-full text-left p-1.5 rounded hover:bg-slate-50 transition-colors group"
                          >
                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors shrink-0 ${
                              selectedSkills.includes(skill.id)
                                ? 'bg-slate-800 border-slate-800 text-white'
                                : 'border-slate-300 group-hover:border-slate-400'
                            }`}>
                              {selectedSkills.includes(skill.id) && <Check className="w-2.5 h-2.5" />}
                            </div>
                            <span className="text-sm text-slate-600 truncate">{skill.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Model Selection & Prompt */}
        <Card>
          <CardContent className="pt-4 space-y-3">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">蒸馏模型</label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="w-full h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meta/llama-3.1-8b-instruct">Llama 3.1 8B (快速)</SelectItem>
                  <SelectItem value="meta/llama-3.1-70b-instruct">Llama 3.1 70B (高质量)</SelectItem>
                  <SelectItem value="nvidia/nemotron-4-340b-instruct">Nemotron 340B (最强)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">自定义提示词（可选）</label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="留空将自动生成知识概览分析报告..."
                className="min-h-[80px] text-sm"
              />
            </div>
            <Button
              onClick={startDistill}
              disabled={isLoading || selectedSkills.length === 0}
              className="w-full gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  蒸馏中...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  开始知识蒸馏
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Right: Result */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        {/* History Tabs */}
        {distillHistory.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => { setResult(''); setDistillHistory([]); }}
              className="shrink-0 px-3 py-1.5 text-xs rounded-full border hover:bg-slate-50 text-slate-600"
            >
              新蒸馏
            </button>
            {distillHistory.map((h, i) => (
              <button
                key={i}
                onClick={() => setResult(h.result)}
                className="shrink-0 px-3 py-1.5 text-xs rounded-full border hover:bg-slate-50 text-slate-600 max-w-[200px] truncate"
              >
                {h.prompt.slice(0, 15)}...
              </button>
            ))}
          </div>
        )}

        <Card className="flex-1 overflow-hidden">
          {result ? (
            <>
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileOutput className="w-5 h-5" />
                    蒸馏结果
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(result)
                      toast.success('已复制到剪贴板')
                    }}
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    复制
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-23rem)]">
                  <div className="p-5 prose prose-sm prose-slate max-w-none whitespace-pre-wrap">
                    {result}
                  </div>
                </ScrollArea>
              </CardContent>
            </>
          ) : isLoading ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px]">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center mb-4">
                <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700">正在进行知识蒸馏...</h3>
              <p className="text-sm text-slate-500 mt-1">AI正在整合选中的技能知识并生成分析报告</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px]">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700">知识蒸馏引擎</h3>
              <p className="text-sm text-slate-500 mt-1 text-center max-w-sm">
                从左侧选择技能知识源，AI将基于选中的知识进行整合分析和蒸馏，生成结构化的知识报告。
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

// Helper component for distill tab
function FileOutput({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  )
}
