import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/conversations/[id]/messages - Get messages for a conversation
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const messages = await db.message.findMany({
      where: { conversationId: id },
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json({ error: '获取消息列表失败' }, { status: 500 });
  }
}

// POST /api/conversations/[id]/messages - Add a message
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { role, content } = body;

    if (!role || !content) {
      return NextResponse.json({ error: '角色和内容为必填项' }, { status: 400 });
    }

    const message = await db.message.create({
      data: {
        role,
        content,
        conversationId: id,
      },
    });

    // Update conversation timestamp
    await db.conversation.update({
      where: { id },
      data: { updatedAt: new Date() },
    });

    // Auto-generate title from first user message
    if (role === 'user') {
      const msgCount = await db.message.count({ where: { conversationId: id } });
      if (msgCount === 1) {
        const title = content.length > 30 ? content.slice(0, 30) + '...' : content;
        await db.conversation.update({
          where: { id },
          data: { title },
        });
      }
    }

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Create message error:', error);
    return NextResponse.json({ error: '创建消息失败' }, { status: 500 });
  }
}
