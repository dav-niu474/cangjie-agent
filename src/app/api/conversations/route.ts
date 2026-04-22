import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/conversations - List conversations
export async function GET() {
  try {
    const conversations = await db.conversation.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        agent: {
          select: { id: true, name: true, avatar: true },
        },
        _count: {
          select: { messages: true },
        },
      },
    });

    return NextResponse.json(conversations);
  } catch (error) {
    console.error('Get conversations error:', error);
    return NextResponse.json({ error: '获取会话列表失败' }, { status: 500 });
  }
}

// POST /api/conversations - Create a new conversation
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, agentId, model } = body;

    const conversation = await db.conversation.create({
      data: {
        title: title || '新对话',
        agentId: agentId || null,
        model: model || 'meta/llama-3.1-8b-instruct',
      },
      include: {
        agent: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });

    return NextResponse.json(conversation, { status: 201 });
  } catch (error) {
    console.error('Create conversation error:', error);
    return NextResponse.json({ error: '创建会话失败' }, { status: 500 });
  }
}
