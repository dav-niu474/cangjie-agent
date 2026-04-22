// 仓颉平台 - 技能数据层
// 包含完整的技能包和技能内容数据

export interface SkillPack {
  id: string;
  name: string;
  description: string;
  icon: string;
  order: number;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  content: string;
  references: string;
  tags: string[];
  category: string;
  packId: string;
  order: number;
}

export interface SkillPackWithSkills extends SkillPack {
  skills: Skill[];
}

export const AVAILABLE_MODELS = [
  { id: 'meta/llama-3.1-8b-instruct', name: 'Llama 3.1 8B Instruct', provider: 'NVIDIA' },
  { id: 'meta/llama-3.1-70b-instruct', name: 'Llama 3.1 70B Instruct', provider: 'NVIDIA' },
  { id: 'mistralai/mixtral-8x22b-instruct-v0.1', name: 'Mixtral 8x22B Instruct', provider: 'NVIDIA' },
  { id: 'google/gemma-2-9b-it', name: 'Gemma 2 9B IT', provider: 'NVIDIA' },
  { id: 'nvidia/nemotron-4-340b-instruct', name: 'Nemotron 4 340B Instruct', provider: 'NVIDIA' },
];

export const DEFAULT_AGENTS = [
  {
    id: 'agent-code-reviewer',
    name: '代码审查助手',
    description: '专业的代码审查AI助手，帮助识别代码中的潜在问题、安全漏洞和性能瓶颈。',
    avatar: '🔍',
    systemPrompt: '你是一个专业的代码审查助手。你需要仔细分析用户提交的代码，从以下维度给出详细的审查意见：\n\n1. **代码质量**：命名规范、代码结构、可读性\n2. **潜在Bug**：逻辑错误、边界条件、空指针风险\n3. **安全漏洞**：注入攻击、XSS、CSRF等安全风险\n4. **性能优化**：算法复杂度、内存使用、数据库查询优化\n5. **最佳实践**：设计模式应用、SOLID原则、代码复用\n\n请用中文回复，并给出具体的代码改进建议。',
    model: 'meta/llama-3.1-8b-instruct',
    order: 0,
  },
  {
    id: 'agent-security-expert',
    name: '安全审计专家',
    description: '专注于应用安全审计的AI专家，帮助发现和修复安全漏洞。',
    avatar: '🛡️',
    systemPrompt: '你是一个应用安全审计专家。你需要从安全角度审查代码和系统架构：\n\n1. **OWASP Top 10**：检查常见Web安全漏洞\n2. **认证与授权**：身份验证、权限控制、会话管理\n3. **数据安全**：加密、敏感数据保护、数据泄露风险\n4. **API安全**：输入验证、速率限制、CORS配置\n5. **依赖安全**：第三方库漏洞扫描、供应链安全\n\n请用中文回复，给出严重等级评估（高/中/低）和修复建议。',
    model: 'meta/llama-3.1-8b-instruct',
    order: 1,
  },
  {
    id: 'agent-architect',
    name: '架构设计顾问',
    description: '系统架构设计AI顾问，提供架构方案和技术选型建议。',
    avatar: '🏗️',
    systemPrompt: '你是一个资深的系统架构设计顾问。你帮助用户设计合理的技术架构：\n\n1. **架构模式**：微服务、单体、事件驱动、CQRS等\n2. **技术选型**：根据需求推荐合适的框架、中间件、数据库\n3. **可扩展性**：水平/垂直扩展方案、负载均衡\n4. **高可用**：容灾、熔断、降级、限流策略\n5. **性能设计**：缓存策略、异步处理、数据库优化\n\n请用中文回复，并给出架构图描述和优缺点对比。',
    model: 'meta/llama-3.1-8b-instruct',
    order: 2,
  },
];

export const DEFAULT_SKILL_PACKS: { pack: SkillPack; skills: Skill[] }[] = [
  {
    pack: {
      id: 'pack-code-review',
      name: '代码审查技能包',
      description: '涵盖代码质量审查、Bug检测、性能分析等全方位代码审查能力',
      icon: '🔍',
      order: 0,
    },
    skills: [
      {
        id: 'skill-code-quality',
        name: '代码质量分析',
        description: '分析代码质量指标，包括可读性、可维护性、复杂度等维度',
        content: '## 代码质量分析技能\n\n### 核心能力\n此技能用于深度分析代码质量，从多个维度评估代码的健康状况。\n\n### 分析维度\n1. **圈复杂度分析**：计算函数/方法的圈复杂度，识别过于复杂的逻辑\n2. **命名规范检查**：验证变量、函数、类名是否符合团队编码规范\n3. **代码重复度检测**：发现重复代码块，建议提取公共方法\n4. **函数长度评估**：识别过长函数，建议合理拆分\n5. **嵌套深度检查**：检测过深的条件嵌套，建议使用卫语句\n6. **注释质量评估**：检查注释的完整性和准确性\n\n### 评分标准\n- **优秀 (90-100)**：代码简洁、命名清晰、结构合理\n- **良好 (70-89)**：整体质量不错，有少量改进空间\n- **一般 (50-69)**：存在明显质量问题，需要重构\n- **较差 (0-49)**：代码质量堪忧，建议全面重写\n\n### 输出格式\n请提供详细的代码质量报告，包含各维度评分和具体改进建议。',
        references: '- Martin Fowler《重构：改善既有代码的设计》\n- Robert C. Martin《代码整洁之道》\n- SonarQube 代码质量规则集\n- Google Java/C++/Python 编码规范\n- 《编写可读代码的艺术》',
        tags: ['代码质量', '静态分析', '重构', '最佳实践'],
        category: 'quality',
        packId: 'pack-code-review',
        order: 0,
      },
      {
        id: 'skill-bug-detection',
        name: 'Bug检测与诊断',
        description: '智能检测代码中的潜在Bug，包括逻辑错误、空指针、边界条件等',
        content: '## Bug检测与诊断技能\n\n### 核心能力\n自动检测代码中的潜在Bug，提供诊断报告和修复方案。\n\n### 检测范围\n1. **空指针/空引用**：未检查null值就直接使用\n2. **数组越界**：未检查数组/列表长度就访问元素\n3. **资源泄漏**：未关闭的文件、数据库连接、网络连接\n4. **并发问题**：竞态条件、死锁、线程安全\n5. **类型错误**：隐式类型转换导致的精度丢失或错误\n6. **逻辑错误**：条件判断反转、循环边界错误\n7. **异常处理**：未捕获的异常、过于宽泛的catch\n8. **内存问题**：内存泄漏、栈溢出\n\n### 诊断流程\n1. 静态代码扫描，识别可疑模式\n2. 数据流分析，追踪变量使用\n3. 控制流分析，检查路径覆盖\n4. 输出详细的Bug报告，包含位置、原因、修复建议',
        references: '- CWE (Common Weakness Enumeration) 漏洞分类\n- OWASP Code Review Guide\n- FindBugs / SpotBugs 检测规则\n- PVS-Studio 静态分析规则\n- Microsoft SDL 代码审查检查表',
        tags: ['Bug检测', '静态分析', '调试', '代码诊断'],
        category: 'detection',
        packId: 'pack-code-review',
        order: 1,
      },
      {
        id: 'skill-performance-analysis',
        name: '性能分析优化',
        description: '分析代码性能瓶颈，提供优化建议和最佳实践方案',
        content: '## 性能分析优化技能\n\n### 核心能力\n深入分析代码性能，识别瓶颈并提供优化方案。\n\n### 分析维度\n1. **时间复杂度**：算法效率分析，Big-O表示\n2. **空间复杂度**：内存使用效率评估\n3. **数据库查询**：N+1查询、缺少索引、全表扫描\n4. **缓存策略**：缓存命中率、缓存穿透/击穿/雪崩\n5. **网络IO**：不必要的网络请求、批量优化\n6. **并发处理**：线程池配置、异步处理、锁竞争\n7. **序列化/反序列化**：JSON处理效率、协议选择\n\n### 优化策略\n- **算法优化**：选择更高效的数据结构和算法\n- **缓存优化**：合理使用多级缓存\n- **数据库优化**：SQL调优、索引优化、分库分表\n- **异步处理**：将同步改为异步，提升吞吐量\n- **懒加载**：延迟初始化和按需加载\n- **连接池**：合理配置数据库和HTTP连接池\n\n### 性能指标\n- 响应时间 (P50, P95, P99)\n- 吞吐量 (QPS/TPS)\n- 资源使用率 (CPU, Memory, IO)\n- 错误率',
        references: '- 《高性能JavaScript》- Nicholas C. Zakas\n- 《Java性能优化权威指南》\n- Brendan Gregg 性能分析方法论\n- Redis 缓存设计模式\n- 数据库索引优化最佳实践',
        tags: ['性能优化', '算法', '缓存', '数据库'],
        category: 'performance',
        packId: 'pack-code-review',
        order: 2,
      },
      {
        id: 'skill-refactoring',
        name: '代码重构建议',
        description: '识别代码异味(Code Smell)，提供具体的重构步骤和方案',
        content: '## 代码重构建议技能\n\n### 核心能力\n识别代码异味并给出具体的重构方案。\n\n### 常见代码异味\n1. **过长方法**：超过30行的方法需要拆分\n2. **过大类**：职责过多，违反单一职责原则\n3. **过长参数列表**：超过3个参数应使用参数对象\n4. **重复代码**：DRY原则违反\n5. **发散式变化**：一个类因多个原因变化\n6. **霰弹式修改**：一个变化导致多个类修改\n7. **依恋情节**：方法对别的类比对自己的类更感兴趣\n8. **数据泥团**：多个参数总是一起出现\n9. **基本类型偏执**：应使用小对象替代基本类型\n10. **Switch语句过多**：应使用多态替代\n\n### 重构手法\n- **提取方法**：将代码片段提取为独立方法\n- **内联方法**：消除不必要的方法间接层\n- **提取类**：将部分职责分离到新类\n- **移动方法**：将方法移到更合适的类\n- **引入参数对象**：用对象替代参数列表\n- **用多态替代条件**：消除重复的switch/if-else\n- **策略模式**：封装可互换的算法族\n\n### 重构原则\n- 小步前进，每步保持可测试\n- 先写测试，再重构\n- 保持行为不变',
        references: '- Martin Fowler《重构：改善既有代码的设计》\n- 23种经典重构手法详解\n- Refactoring.guru 在线重构指南\n- Clean Code 开发原则\n- SOLID 设计原则实践',
        tags: ['重构', '代码异味', '设计模式', 'SOLID'],
        category: 'refactoring',
        packId: 'pack-code-review',
        order: 3,
      },
      {
        id: 'skill-test-review',
        name: '测试覆盖率审查',
        description: '分析测试覆盖情况，建议测试策略和用例补充方案',
        content: '## 测试覆盖率审查技能\n\n### 核心能力\n评估代码测试覆盖率，识别测试盲区，提供测试用例补充建议。\n\n### 审查维度\n1. **行覆盖率**：代码行是否都被测试执行到\n2. **分支覆盖率**：条件分支是否都被覆盖\n3. **函数覆盖率**：所有函数是否都有测试\n4. **路径覆盖率**：主要执行路径是否被覆盖\n5. **边界测试**：边界条件是否被测试\n6. **异常测试**：异常场景是否被覆盖\n\n### 测试类型建议\n- **单元测试**：隔离测试单个函数/方法\n- **集成测试**：测试模块间交互\n- **端到端测试**：测试完整用户流程\n- **性能测试**：负载和压力测试\n- **安全测试**：渗透测试和漏洞扫描\n\n### 测试最佳实践\n- AAA模式 (Arrange-Act-Assert)\n- 测试命名规范：should_[预期结果]_when_[条件]\n- 避免测试间依赖\n- 使用测试替身(Mock/Stub)\n- 持续集成中的自动化测试',
        references: '- Kent Beck《测试驱动开发》\n- Martin Fowler 测试金字塔理论\n- JUnit 5 / Jest / Pytest 最佳实践\n- Mutation Testing 变异测试\n- 测试覆盖率工具：Istanbul, JaCoCo, Coverage.py',
        tags: ['测试', '覆盖率', '单元测试', 'TDD'],
        category: 'testing',
        packId: 'pack-code-review',
        order: 4,
      },
    ],
  },
  {
    pack: {
      id: 'pack-security-audit',
      name: '安全审计技能包',
      description: '全方位安全审计能力，包括漏洞扫描、安全加固、合规检查',
      icon: '🛡️',
      order: 1,
    },
    skills: [
      {
        id: 'skill-vuln-scan',
        name: '漏洞扫描检测',
        description: '扫描常见安全漏洞，包括OWASP Top 10和CWE分类',
        content: '## 漏洞扫描检测技能\n\n### 核心能力\n全面扫描Web应用中的安全漏洞，覆盖OWASP Top 10。\n\n### 扫描范围 - OWASP Top 10 (2021)\n1. **A01 - 失效的访问控制**：越权访问、IDOR、权限提升漏洞\n2. **A02 - 加密机制失败**：明文传输敏感数据、弱加密算法\n3. **A03 - 注入攻击**：SQL注入、NoSQL注入、命令注入、SSTI\n4. **A04 - 不安全的设计**：缺少安全设计模式、威胁建模不足\n5. **A05 - 安全配置错误**：默认配置未修改、错误信息泄露\n6. **A06 - 自带缺陷和过时的组件**：已知漏洞的第三方库\n7. **A07 - 认证和身份识别失败**：弱密码策略、会话管理不当\n8. **A08 - 软件和数据完整性失败**：CI/CD管道安全\n9. **A09 - 安全日志和监控失败**：审计日志缺失\n10. **A10 - 服务端请求伪造(SSRF)**：内部服务探测\n\n### 漏洞等级分类\n- **严重 (Critical)**：可直接被利用，导致系统被完全控制\n- **高危 (High)**：可能导致敏感数据泄露\n- **中危 (Medium)**：需要特定条件才能利用\n- **低危 (Low)**：利用难度大，影响有限\n- **信息 (Info)**：安全加固建议',
        references: '- OWASP Top 10 (2021) 官方文档\n- CWE/SANS Top 25 最危险的软件缺陷\n- NVD 国家漏洞数据库\n- CVE 漏洞编号系统\n- Burp Suite / OWASP ZAP 扫描规则',
        tags: ['OWASP', '漏洞扫描', '安全审计', '渗透测试'],
        category: 'vulnerability',
        packId: 'pack-security-audit',
        order: 0,
      },
      {
        id: 'skill-auth-audit',
        name: '认证授权审计',
        description: '审查身份认证和访问控制机制，检测权限绕过和会话管理问题',
        content: '## 认证授权审计技能\n\n### 核心能力\n深入审查身份认证、会话管理和访问控制机制的安全性。\n\n### 审计范围\n\n#### 1. 身份认证\n- 密码策略（长度、复杂度、过期）\n- 多因素认证(MFA)实现\n- OAuth 2.0 / OIDC 配置\n- JWT实现安全性\n- 社交登录集成安全\n- API密钥管理\n\n#### 2. 会话管理\n- Session ID生成安全性\n- Cookie配置（HttpOnly, Secure, SameSite）\n- 会话超时策略\n- 并发会话控制\n- 登出/会话失效处理\n- 会话固定攻击防护\n\n#### 3. 访问控制\n- RBAC（基于角色的访问控制）\n- ABAC（基于属性的访问控制）\n- 资源级权限检查\n- API端点权限验证\n- CORS策略配置\n- CSRF防护机制\n\n#### 4. 常见问题\n- 硬编码凭证\n- 默认密码未修改\n- 权限提升路径\n- 越权访问漏洞\n- Token泄露风险',
        references: '- OAuth 2.0 RFC 6749 / RFC 6750\n- OWASP Authentication Cheat Sheet\n- NIST SP 800-63B 数字身份认证指南\n- JWT Best Current Practices (RFC 8725)\n- OWASP Session Management Cheat Sheet',
        tags: ['认证', '授权', 'JWT', 'OAuth', '会话管理'],
        category: 'auth',
        packId: 'pack-security-audit',
        order: 1,
      },
      {
        id: 'skill-data-security',
        name: '数据安全保护',
        description: '评估数据保护措施，包括加密、脱敏、隐私合规',
        content: '## 数据安全保护技能\n\n### 核心能力\n评估和加固数据安全保护措施，确保数据全生命周期安全。\n\n### 保护范围\n\n#### 1. 数据加密\n- **传输加密**：TLS/SSL配置，证书管理\n- **存储加密**：AES-256, RSA加密方案\n- **字段级加密**：敏感字段单独加密\n- **端到端加密**：消息和文件传输安全\n\n#### 2. 数据脱敏\n- 静态脱敏：数据库中的敏感数据处理\n- 动态脱敏：API响应中的数据遮蔽\n- 脱敏规则：手机号、身份证、银行卡等\n- 日志脱敏：确保日志不含敏感信息\n\n#### 3. 数据分类分级\n- 公开数据、内部数据、机密数据、绝密数据\n- 不同级别的保护措施\n- 数据生命周期管理\n\n#### 4. 隐私合规\n- GDPR（欧盟通用数据保护条例）\n- 个人信息保护法（中国）\n- 数据跨境传输合规\n- Cookie和追踪合规\n- 用户同意管理\n\n#### 5. 数据备份与恢复\n- 备份策略（全量/增量）\n- 灾难恢复方案\n- RTO/RPO指标\n- 数据销毁安全',
        references: '- GDPR 官方合规指南\n- 《中华人民共和国个人信息保护法》\n- NIST SP 800-111 存储加密指南\n- PCI DSS 支付卡行业数据安全标准\n- ISO 27001 信息安全管理体系',
        tags: ['数据安全', '加密', '脱敏', '隐私合规', 'GDPR'],
        category: 'data-protection',
        packId: 'pack-security-audit',
        order: 2,
      },
      {
        id: 'skill-api-security',
        name: 'API安全加固',
        description: '检查API接口安全配置，防御注入攻击和滥用',
        content: '## API安全加固技能\n\n### 核心能力\n全面检查和加固API接口的安全性。\n\n### 加固措施\n\n#### 1. 输入验证\n- 参数类型和格式验证\n- 白名单输入过滤\n- 文件上传安全检查\n- JSON/XML输入安全\n\n#### 2. 输出编码\n- XSS防护（HTML/JS/CSS编码）\n- JSON输出安全\n- 错误信息不泄露敏感数据\n- 响应头安全配置\n\n#### 3. 速率限制\n- 全局API速率限制\n- 用户级速率限制\n- 端点级速率限制\n- 分布式限流方案\n\n#### 4. API网关安全\n- 认证过滤器\n- 请求日志审计\n- IP白名单/黑名单\n- WAF规则配置\n\n#### 5. GraphQL安全\n- 查询深度限制\n- 查询复杂度限制\n- 字段级权限控制\n- Introspection关闭\n\n#### 6. WebSocket安全\n- 连接认证\n- 消息验证\n- 速率限制\n- Origin检查\n\n### 安全响应头\n- Content-Security-Policy\n- X-Content-Type-Options\n- X-Frame-Options\n- Strict-Transport-Security\n- Access-Control-Allow-Origin',
        references: '- OWASP API Security Top 10\n- RESTful API 安全设计指南\n- API Gateway 安全最佳实践\n- GraphQL 安全最佳实践\n- NIST API 安全标准',
        tags: ['API安全', '输入验证', '速率限制', 'WAF'],
        category: 'api-security',
        packId: 'pack-security-audit',
        order: 3,
      },
      {
        id: 'skill-dependency-security',
        name: '依赖组件安全',
        description: '检查第三方依赖安全漏洞，管理供应链安全风险',
        content: '## 依赖组件安全技能\n\n### 核心能力\n扫描和分析项目依赖中的安全漏洞，管理软件供应链安全。\n\n### 检查范围\n\n#### 1. 依赖漏洞扫描\n- npm/yarn 依赖安全审计\n- Maven/Gradle 依赖检查\n- Pip 依赖安全扫描\n- Go Modules 漏洞检查\n- Docker 镜像漏洞扫描\n\n#### 2. 许可证合规\n- 开源许可证类型识别\n- 传染性许可证风险\n- 商业使用限制\n- 许可证兼容性检查\n\n#### 3. 供应链安全\n- 包劫持防护\n- 锁文件(Lockfile)使用\n- 校验和验证\n- 可信源配置\n- SBOM（软件物料清单）\n\n#### 4. 依赖管理策略\n- 定期更新依赖\n- 最低必要依赖原则\n- Dev/Prod环境依赖分离\n- 安全基线策略\n\n#### 5. 工具链安全\n- CI/CD 管道安全\n- 构建环境安全\n- 签名验证\n- 可重现构建',
        references: '- S2C2O (Secure Supply Chain Consumption Framework)\n- npm audit / yarn audit\n- Snyk / Dependabot / Renovate\n- SPDX 许可证标识\n- CVE 漏洞数据库查询\n- Docker Trivy 扫描工具',
        tags: ['依赖安全', '供应链', '许可证', 'SBOM'],
        category: 'dependency',
        packId: 'pack-security-audit',
        order: 4,
      },
    ],
  },
  {
    pack: {
      id: 'pack-prompt-engineering',
      name: '提示工程技能包',
      description: '掌握AI提示工程核心技术，优化AI交互效率和输出质量',
      icon: '✨',
      order: 2,
    },
    skills: [
      {
        id: 'skill-prompt-design',
        name: '提示词设计模式',
        description: '系统化的提示词设计方法论，包括模板和最佳实践',
        content: '## 提示词设计模式技能\n\n### 核心能力\n掌握结构化的提示词设计方法论，创建高质量的AI交互提示。\n\n### 设计原则\n\n#### 1. CLARITY Framework\n- **C**ontext（上下文）：提供充分的背景信息\n- **L**anguage（语言）：使用精确无歧义的语言\n- **A**ssignment（任务）：明确指定AI的角色和任务\n- **R**estrictions（约束）：设定输出格式和限制\n- **I**nput（输入）：提供清晰的输入数据格式\n- **T**one（语调）：指定回复的语调和风格\n- **Y**ield（产出）：明确期望的输出格式\n\n#### 2. 提示词模板结构\n```\n[角色设定]\n你是一个{专业领域}的专家，拥有{年限}年的{技能}经验。\n\n[任务描述]\n请帮我完成以下任务：{具体任务}\n\n[约束条件]\n- 输出格式：{Markdown/JSON/表格/列表}\n- 语言：{中文/英文}\n- 长度限制：{字数或段落数}\n- 注意事项：{特殊要求}\n\n[示例]（可选）\n输入示例：{示例输入}\n输出示例：{期望输出}\n\n[输入数据]\n{实际需要处理的数据}\n```\n\n#### 3. 高级技巧\n- Chain-of-Thought（思维链）：引导AI逐步推理\n- Few-Shot Learning（少样本学习）：提供示例\n- Role Play（角色扮演）：设定专家身份\n- Self-Consistency（自一致性）：多次采样取最优\n- Tree-of-Thought（思维树）：探索多条推理路径',
        references: '- OpenAI Prompt Engineering Guide\n- Anthropic Prompt Engineering Guide\n- "Prompt Patterns for Generative AI" - OpenAI\n- LangChain 提示模板最佳实践\n- Learn Prompting 社区教程',
        tags: ['提示工程', 'Prompt', '模板设计', 'AI交互'],
        category: 'design',
        packId: 'pack-prompt-engineering',
        order: 0,
      },
      {
        id: 'skill-prompt-optimization',
        name: '提示词优化策略',
        description: '通过迭代优化提升AI输出质量的方法和工具',
        content: '## 提示词优化策略技能\n\n### 核心能力\n系统化地优化提示词，持续提升AI输出的质量和一致性。\n\n### 优化方法论\n\n#### 1. 评估指标\n- **准确性**：输出内容是否正确\n- **完整性**：是否覆盖了所有要求\n- **一致性**：多次输出是否一致\n- **相关性**：是否与任务目标匹配\n- **可读性**：是否易于理解\n\n#### 2. 优化循环\n1. **基线测试**：用初始提示词获取基线输出\n2. **识别问题**：分析输出中的不足之处\n3. **调整策略**：增加上下文信息、细化任务描述、添加约束条件、提供更多示例\n4. **对比评估**：与基线对比，量化改进\n5. **迭代优化**：重复步骤2-4\n\n#### 3. 常见优化手段\n- 分解复杂任务为子任务\n- 使用分隔符划分输入区域\n- 指定输出schema\n- 添加负面示例（不要做什么）\n- 使用系统提示vs用户提示分离关注点\n\n#### 4. 高级优化\n- Temperature和Top-P参数调优\n- 提示词版本管理\n- A/B测试不同提示词\n- 自动化评估流程',
        references: '- OpenAI Cookbook - Prompt Engineering\n- DSPy 提示词自动优化框架\n- "A Survey on Large Language Model based Autonomous Agents"\n- Promptfoo 提示词测试工具\n- HumanEval 代码生成评估基准',
        tags: ['优化', '评估', '迭代', 'A/B测试'],
        category: 'optimization',
        packId: 'pack-prompt-engineering',
        order: 1,
      },
      {
        id: 'skill-few-shot-learning',
        name: '少样本学习能力',
        description: '通过少量示例引导AI理解和执行复杂任务',
        content: '## 少样本学习能力技能\n\n### 核心能力\n通过精心设计的示例，引导AI快速理解并执行新任务。\n\n### 核心概念\n\n#### 1. 零样本 vs 少样本\n- **零样本学习(Zero-Shot)**：不给示例，仅描述任务\n- **单样本学习(One-Shot)**：给一个示例\n- **少样本学习(Few-Shot)**：给2-5个代表性示例\n\n#### 2. 示例设计原则\n- **代表性**：示例应覆盖主要场景\n- **多样性**：包含不同难度和类型\n- **清晰性**：输入输出对应关系明确\n- **一致性**：格式和风格保持一致\n- **顺序性**：从简单到复杂排列\n\n#### 3. 示例模板\n```\n请根据以下示例完成任务：\n\n示例1:\n输入: {input_1}\n输出: {output_1}\n\n示例2:\n输入: {input_2}\n输出: {output_2}\n\n现在请处理：\n输入: {target_input}\n输出:\n```\n\n#### 4. 应用场景\n- 文本分类、信息提取、格式转换\n- 代码生成、翻译任务、摘要生成\n\n#### 5. 注意事项\n- 示例数量不宜过多（2-5个最佳）\n- 确保示例与目标任务高度相关\n- 注意示例的顺序效应\n- 示例间保持独立性',
        references: '- GPT-3 论文 "Language Models are Few-Shot Learners"\n- Brown et al., 2020\n- Meta-Learning 理论基础\n- Prompt Programming 研究\n- FLAN 指令微调数据集',
        tags: ['少样本', '示例学习', 'Zero-Shot', 'Few-Shot'],
        category: 'learning',
        packId: 'pack-prompt-engineering',
        order: 2,
      },
      {
        id: 'skill-chain-of-thought',
        name: '思维链推理',
        description: '引导AI进行逐步推理，提升复杂问题的解决能力',
        content: '## 思维链推理技能\n\n### 核心能力\n通过思维链(Chain-of-Thought)引导AI进行显式的逐步推理。\n\n### 技术原理\n\n#### 1. 什么是思维链\n思维链是一系列中间推理步骤，它能帮助AI模型：\n- 将复杂问题分解为可管理的子步骤\n- 显式展示推理过程\n- 减少推理错误\n- 提高可解释性\n\n#### 2. 触发方式\n\n**方式一：直接要求**\n```\n请一步一步地思考并解决这个问题。\n```\n\n**方式二：示例引导**\n```\n问题: {question}\n让我们一步一步来：\n步骤1: {reasoning_step_1}\n步骤2: {reasoning_step_2}\n...\n所以答案是: {answer}\n```\n\n**方式三：结构化模板**\n```\n请按以下格式分析：\n1. 理解问题: ...\n2. 已知条件: ...\n3. 分析推理: ...\n4. 验证结果: ...\n5. 最终答案: ...\n```\n\n#### 3. 进阶技巧\n- **Self-Ask**：让AI自问自答\n- **Least-to-Most**：从子问题到主问题\n- **Plan-and-Solve**：先规划后执行\n- **Self-Consistency**：多次推理取多数投票\n\n#### 4. 适用场景\n- 数学推理、逻辑分析、代码调试\n- 决策分析、复杂问答',
        references: '- "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models" - Wei et al., 2022\n- "Self-Consistency Improves Chain of Thought Reasoning" - Wang et al., 2022\n- "Least-to-Most Prompting" - Zhou et al., 2022\n- "Plan-and-Solve Prompting" - Wang et al., 2023\n- Tree-of-Thought (ToT) 推理框架',
        tags: ['思维链', 'CoT', '推理', '逐步分析'],
        category: 'reasoning',
        packId: 'pack-prompt-engineering',
        order: 3,
      },
    ],
  },
  {
    pack: {
      id: 'pack-architecture',
      name: '架构设计技能包',
      description: '系统架构设计、技术选型和架构模式的专业技能集合',
      icon: '🏗️',
      order: 3,
    },
    skills: [
      {
        id: 'skill-architecture-patterns',
        name: '架构模式设计',
        description: '掌握常见架构模式，根据业务场景选择最佳架构方案',
        content: '## 架构模式设计技能\n\n### 核心能力\n根据业务需求选择和设计合适的系统架构模式。\n\n### 主流架构模式\n\n#### 1. 单体架构 (Monolithic)\n- **适用场景**：初创项目、小团队、快速验证\n- **优势**：开发简单、部署方便、调试容易\n- **劣势**：扩展困难、技术栈锁定、发布风险大\n- **演进路径**：模块化单体 → 微服务\n\n#### 2. 微服务架构 (Microservices)\n- **适用场景**：大型系统、多团队协作、需要独立扩展\n- **优势**：独立部署、技术栈灵活、故障隔离\n- **劣势**：分布式复杂性、运维成本高、数据一致性挑战\n- **关键组件**：API网关、服务注册发现、配置中心、链路追踪\n\n#### 3. 事件驱动架构 (Event-Driven)\n- **适用场景**：异步处理、实时响应、解耦系统\n- **优势**：松耦合、可扩展、实时性好\n- **劣势**：调试困难、消息顺序、幂等性处理\n- **模式**：发布/订阅、事件溯源、CQRS\n\n#### 4. 分层架构 (Layered)\n- **适用场景**：大多数业务系统\n- **层次**：表现层 → 应用层 → 领域层 → 基础设施层\n- **原则**：依赖倒置、单一方向依赖\n\n#### 5. 六边形架构 (Hexagonal)\n- **核心思想**：业务逻辑不依赖任何外部组件\n- **端口**：定义业务能力接口\n- **适配器**：实现具体技术细节\n\n#### 6. Serverless架构\n- **适用场景**：无状态处理、事件触发、弹性需求\n- **优势**：自动扩缩容、按量付费、降低运维\n- **劣势**：冷启动、执行时间限制、调试困难',
        references: '- Martin Fowler《企业应用架构模式》\n- Sam Newman《微服务设计》\n- Vaughn Vernon《实现领域驱动设计》\n- Microsoft Azure 架构中心\n- AWS 架构良好框架 (Well-Architected Framework)\n- Chris Richardson《微服务架构设计模式》',
        tags: ['架构模式', '微服务', '事件驱动', 'Serverless'],
        category: 'patterns',
        packId: 'pack-architecture',
        order: 0,
      },
      {
        id: 'skill-tech-selection',
        name: '技术选型评估',
        description: '系统化的技术选型方法论，帮助团队做出最优技术决策',
        content: '## 技术选型评估技能\n\n### 核心能力\n提供结构化的技术选型框架，避免技术决策的主观性。\n\n### 选型方法论\n\n#### 1. 评估维度矩阵\n\n| 维度 | 权重 | 评估标准 |\n|------|------|----------|\n| 技术成熟度 | 20% | 社区活跃度、版本稳定性、文档完善度 |\n| 性能表现 | 20% | 基准测试数据、极限场景表现 |\n| 学习成本 | 15% | 团队掌握难度、培训时间 |\n| 生态丰富度 | 15% | 插件、工具、第三方集成 |\n| 运维难度 | 15% | 部署复杂度、监控、故障排查 |\n| 社区支持 | 10% | 问题解答速度、更新频率 |\n| 商业支持 | 5% | 付费支持、SLA保障 |\n\n#### 2. 决策流程\n1. 需求分析：明确业务场景和技术要求\n2. 候选方案：列出2-4个可选方案\n3. PoC验证：核心场景原型验证\n4. 矩阵评分：按维度打分对比\n5. 风险评估：识别潜在风险和应对措施\n6. 最终决策：综合评分和风险评估\n\n#### 3. 常见技术选型\n- **前端框架**：React vs Vue vs Angular vs Svelte\n- **后端语言**：Java vs Go vs Python vs Node.js vs Rust\n- **数据库**：MySQL vs PostgreSQL vs MongoDB vs Redis\n- **消息队列**：Kafka vs RabbitMQ vs RocketMQ vs Pulsar\n- **容器编排**：Kubernetes vs Docker Compose vs Nomad\n- **API网关**：Kong vs Nginx vs Envoy vs APISIX\n\n#### 4. 避坑指南\n- 避免"简历驱动开发"\n- 不盲目追求新技术\n- 考虑团队技术栈一致性\n- 评估长期维护成本',
        references: '- ThoughtWorks 技术雷达\n- Stack Overflow Developer Survey\n- DB-Engines 数据库排名\n- Tiobe 编程语言指数\n- 技术选型案例集',
        tags: ['技术选型', '评估', '决策', 'PoC'],
        category: 'evaluation',
        packId: 'pack-architecture',
        order: 1,
      },
      {
        id: 'skill-scalability',
        name: '可扩展架构设计',
        description: '设计支持水平扩展的高可用系统架构方案',
        content: '## 可扩展架构设计技能\n\n### 核心能力\n设计能够应对业务增长的弹性可扩展系统。\n\n### 扩展策略\n\n#### 1. 水平扩展 (Scale Out)\n- **无状态设计**：将状态外部化（Redis/数据库）\n- **数据分片**：按用户ID/地域等维度分片\n- **读写分离**：主库写、从库读\n- **微服务拆分**：按业务边界拆分服务\n\n#### 2. 缓存策略\n- **多级缓存**：本地缓存 → 分布式缓存 → 数据库\n- **缓存模式**：Cache-Aside、Read-Through、Write-Through、Write-Behind\n- **缓存问题**：穿透(布隆过滤器)、击穿(互斥锁)、雪崩(随机过期)\n\n#### 3. 数据库扩展\n- **分库分表**：水平拆分 vs 垂直拆分\n- **分区表**：按时间/范围分区\n- **连接池**：合理配置连接池参数\n- **索引优化**：覆盖索引、联合索引、索引下推\n\n#### 4. 异步处理\n- **消息队列**：削峰填谷、系统解耦\n- **事件驱动**：异步通知、最终一致性\n- **批处理**：合并请求、定时任务\n\n#### 5. 高可用设计\n- **负载均衡**：轮询、加权、最少连接\n- **熔断降级**：Hystrix/Sentinel模式\n- **限流**：令牌桶、漏桶、滑动窗口\n- **容灾**：多活部署、故障转移\n\n#### 6. 容量规划\n- 压测基准数据\n- 容量计算公式\n- 弹性伸缩策略',
        references: '- 《数据密集型应用系统设计》- Martin Kleppmann (DDIA)\n- Netflix Hystrix 熔断器设计\n- Redis 缓存设计模式\n- Kafka 高吞吐量设计原理\n- Kubernetes 自动伸缩(HPA/VPA)',
        tags: ['扩展性', '高可用', '缓存', '分布式'],
        category: 'scalability',
        packId: 'pack-architecture',
        order: 2,
      },
      {
        id: 'skill-distributed-system',
        name: '分布式系统设计',
        description: '解决分布式环境下的数据一致性、服务治理和通信问题',
        content: '## 分布式系统设计技能\n\n### 核心能力\n处理分布式系统的核心挑战：一致性、容错、通信。\n\n### 核心问题\n\n#### 1. 数据一致性\n- **CAP定理**：一致性(C)、可用性(A)、分区容错(P)不可兼得\n- **BASE理论**：基本可用、软状态、最终一致性\n- **一致性模型**：强一致性、因果一致性、最终一致性\n- **实现方案**：2PC、3PC、TCC、SAGA、分布式事务消息\n\n#### 2. 服务发现与治理\n- **服务注册**：Consul, Eureka, Nacos\n- **健康检查**：主动探测 vs 被动探测\n- **负载均衡**：客户端 LB vs 服务端 LB\n- **流量管理**：灰度发布、金丝雀发布、A/B测试\n- **配置管理**：集中配置、动态刷新、版本管理\n\n#### 3. 分布式通信\n- **同步通信**：REST, gRPC, GraphQL\n- **异步通信**：消息队列, 事件流\n- **通信模式**：请求-响应、发布-订阅、点对点\n\n#### 4. 分布式追踪\n- TraceID + SpanID 链路追踪\n- OpenTelemetry 标准\n- Jaeger / Zipkin 追踪系统\n\n#### 5. 容错机制\n- **超时与重试**：指数退避、抖动\n- **熔断器**：Closed → Open → Half-Open\n- **限流器**：令牌桶、滑动窗口\n- **降级策略**：默认值、缓存数据、写本地\n- **舱壁隔离**：线程池隔离、信号量隔离\n\n#### 6. 时钟与排序\n- 逻辑时钟（Lamport Clock）\n- 向量时钟\n- 混合逻辑时钟 (HLC)\n- 因果一致性保证',
        references: '- Martin Kleppmann《数据密集型应用系统设计》\n- Lamport 时钟论文 (1978)\n- Paxos / Raft 一致性算法\n- Google Chubby / ZooKeeper\n- 《分布式系统：原理与范型》',
        tags: ['分布式', '一致性', '容错', '服务治理'],
        category: 'distributed',
        packId: 'pack-architecture',
        order: 3,
      },
    ],
  },
];
