import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { DEFAULT_SKILL_PACKS, DEFAULT_AGENTS } from '@/lib/data/skills';

// POST /api/seed - Initialize database with default data
export async function POST() {
  try {
    // Check if data already exists
    const existingPacks = await db.skillPack.count();
    if (existingPacks > 0) {
      return NextResponse.json({ message: '数据已存在，跳过初始化', count: existingPacks });
    }

    // Create skill packs and skills
    for (const { pack, skills } of DEFAULT_SKILL_PACKS) {
      await db.skillPack.create({
        data: {
          id: pack.id,
          name: pack.name,
          description: pack.description,
          icon: pack.icon,
          order: pack.order,
          skills: {
            create: skills.map((skill) => ({
              id: skill.id,
              name: skill.name,
              description: skill.description,
              content: skill.content,
              references: skill.references,
              tags: JSON.stringify(skill.tags),
              category: skill.category,
              order: skill.order,
            })),
          },
        },
      });
    }

    // Create default agents
    for (const agent of DEFAULT_AGENTS) {
      await db.agent.create({
        data: {
          id: agent.id,
          name: agent.name,
          description: agent.description,
          avatar: agent.avatar,
          systemPrompt: agent.systemPrompt,
          model: agent.model,
          order: agent.order,
        },
      });
    }

    return NextResponse.json({
      message: '数据初始化成功',
      skillPacks: DEFAULT_SKILL_PACKS.length,
      skills: DEFAULT_SKILL_PACKS.reduce((acc, p) => acc + p.skills.length, 0),
      agents: DEFAULT_AGENTS.length,
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: '初始化失败', detail: String(error) }, { status: 500 });
  }
}

// GET /api/seed - Check if data exists
export async function GET() {
  try {
    const packCount = await db.skillPack.count();
    const agentCount = await db.agent.count();
    const conversationCount = await db.conversation.count();

    return NextResponse.json({
      skillPacks: packCount,
      agents: agentCount,
      conversations: conversationCount,
      initialized: packCount > 0 && agentCount > 0,
    });
  } catch (error) {
    return NextResponse.json({ error: '查询失败' }, { status: 500 });
  }
}
