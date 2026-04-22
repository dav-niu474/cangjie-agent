import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/conversations/[id] - Get conversation with messages
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const conversation = await db.conversation.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
        agent: {
          select: { id: true, name: true, avatar: true, systemPrompt: true },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json({ error: '会话不存在' }, { status: 404 });
    }

    return NextResponse.json(conversation);
  } catch (error) {
    console.error('Get conversation error:', error);
    return NextResponse.json({ error: '获取会话详情失败' }, { status: 500 });
  }
}

// DELETE /api/conversations/[id] - Delete a conversation
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.conversation.delete({ where: { id } });
    return NextResponse.json({ message: '会话已删除' });
  } catch (error) {
    console.error('Delete conversation error:', error);
    return NextResponse.json({ error: '删除会话失败' }, { status: 500 });
  }
}
