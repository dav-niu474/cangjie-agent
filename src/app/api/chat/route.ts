import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// POST /api/chat - Send message to NVIDIA API and save to database
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { conversationId, message, model, agentId } = body;

    // Validate required fields
    if (!conversationId || !message) {
      return NextResponse.json(
        { error: 'conversationId and message are required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.NVIDIA_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'NVIDIA API Key not configured' }, { status: 500 });
    }

    // Get conversation details with agent info
    const conversation = await db.conversation.findUnique({
      where: { id: conversationId },
      include: {
        agent: true,
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 20, // Last 20 messages for context
        },
      },
    });

    if (!conversation) {
      return NextResponse.json({ error: '会话不存在' }, { status: 404 });
    }

    // Use provided model or conversation's default model
    const selectedModel = model || conversation.model || 'meta/llama-3.1-8b-instruct';

    // Build messages array for NVIDIA API
    const apiMessages: { role: string; content: string }[] = [];

    // Add system prompt (from agent or default)
    const systemPrompt = conversation.agent?.systemPrompt ||
      '你是一个有帮助的AI助手。请用中文回复用户的问题，提供准确、详细的回答。';
    apiMessages.push({ role: 'system', content: systemPrompt });

    // Add conversation history
    for (const msg of conversation.messages) {
      if (msg.role === 'user' || msg.role === 'assistant') {
        apiMessages.push({ role: msg.role, content: msg.content });
      }
    }

    // Add current user message
    apiMessages.push({ role: 'user', content: message });

    // Save user message to database
    await db.message.create({
      data: {
        role: 'user',
        content: message,
        conversationId,
      },
    });

    // Auto-update title on first message
    const userMsgCount = await db.message.count({
      where: { conversationId, role: 'user' },
    });
    if (userMsgCount === 1) {
      const title = message.length > 30 ? message.slice(0, 30) + '...' : message;
      await db.conversation.update({
        where: { id: conversationId },
        data: { title, model: selectedModel },
      });
    }

    // Call NVIDIA API
    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: apiMessages,
        max_tokens: 2048,
        temperature: 0.7,
        top_p: 0.9,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('NVIDIA API error:', response.status, errorText);
      return NextResponse.json(
        { error: `AI服务调用失败 (${response.status}): ${errorText}` },
        { status: 502 }
      );
    }

    const data = await response.json();
    const assistantContent = data.choices?.[0]?.message?.content || '抱歉，无法生成回复。';

    // Save assistant message to database
    const savedAssistantMsg = await db.message.create({
      data: {
        role: 'assistant',
        content: assistantContent,
        conversationId,
      },
    });

    // Update conversation timestamp and model
    await db.conversation.update({
      where: { id: conversationId },
      data: {
        updatedAt: new Date(),
        model: selectedModel,
        agentId: agentId || conversation.agentId,
      },
    });

    return NextResponse.json({
      message: savedAssistantMsg,
      model: selectedModel,
      usage: data.usage,
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: '对话处理失败', detail: String(error) },
      { status: 500 }
    );
  }
}
