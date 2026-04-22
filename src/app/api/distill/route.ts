import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// POST /api/distill - Knowledge distillation via NVIDIA API
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { skillIds, prompt, model } = body;

    if (!skillIds || skillIds.length === 0) {
      return NextResponse.json({ error: '请选择至少一个技能' }, { status: 400 });
    }

    const apiKey = process.env.NVIDIA_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'NVIDIA API Key not configured' }, { status: 500 });
    }

    // Get selected skills from database
    const skills = await db.skill.findMany({
      where: { id: { in: skillIds } },
    });

    if (skills.length === 0) {
      return NextResponse.json({ error: '未找到选中的技能' }, { status: 404 });
    }

    // Build system prompt with skill knowledge
    const skillKnowledge = skills
      .map((s) => `## ${s.name}\n${s.content}\n\n参考资料：${s.references}`)
      .join('\n\n---\n\n');

    const systemPrompt = `你是一个知识蒸馏专家。你拥有以下专业知识库，请基于这些知识来回答用户的问题。

# 知识库内容

${skillKnowledge}

请基于以上知识库内容，对用户的问题进行专业的分析和回答。如果知识库中没有相关信息，请明确说明。`;

    const apiMessages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt || '请基于知识库内容，提供一个全面的知识概览和分析报告。' },
    ];

    const selectedModel = model || 'meta/llama-3.1-8b-instruct';

    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: apiMessages,
        max_tokens: 4096,
        temperature: 0.7,
        top_p: 0.9,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Distill API error:', response.status, errorText);
      return NextResponse.json(
        { error: `知识蒸馏调用失败 (${response.status})` },
        { status: 502 }
      );
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content || '知识蒸馏生成失败。';

    return NextResponse.json({
      result,
      model: selectedModel,
      skillsUsed: skills.map((s) => ({ id: s.id, name: s.name })),
      usage: data.usage,
    });
  } catch (error) {
    console.error('Distill error:', error);
    return NextResponse.json(
      { error: '知识蒸馏处理失败', detail: String(error) },
      { status: 500 }
    );
  }
}
