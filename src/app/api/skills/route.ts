import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/skills - Get all skill packs with skills
export async function GET() {
  try {
    const packs = await db.skillPack.findMany({
      orderBy: { order: 'asc' },
      include: {
        skills: {
          orderBy: { order: 'asc' },
        },
      },
    });

    const result = packs.map((pack) => ({
      id: pack.id,
      name: pack.name,
      description: pack.description,
      icon: pack.icon,
      order: pack.order,
      skills: pack.skills.map((skill) => ({
        id: skill.id,
        name: skill.name,
        description: skill.description,
        content: skill.content,
        references: skill.references,
        tags: JSON.parse(skill.tags || '[]'),
        category: skill.category,
        order: skill.order,
      })),
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Get skills error:', error);
    return NextResponse.json({ error: '获取技能数据失败' }, { status: 500 });
  }
}
