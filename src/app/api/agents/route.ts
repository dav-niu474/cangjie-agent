import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/agents - Get all agents
export async function GET() {
  try {
    const agents = await db.agent.findMany({
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(agents);
  } catch (error) {
    console.error('Get agents error:', error);
    return NextResponse.json({ error: '获取Agent数据失败' }, { status: 500 });
  }
}

// POST /api/agents - Create a new agent
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, avatar, systemPrompt, model } = body;

    if (!name || !systemPrompt) {
      return NextResponse.json({ error: '名称和系统提示词为必填项' }, { status: 400 });
    }

    const agent = await db.agent.create({
      data: {
        name,
        description: description || '',
        avatar: avatar || '🤖',
        systemPrompt,
        model: model || 'meta/llama-3.1-8b-instruct',
      },
    });

    return NextResponse.json(agent, { status: 201 });
  } catch (error) {
    console.error('Create agent error:', error);
    return NextResponse.json({ error: '创建Agent失败' }, { status: 500 });
  }
}
