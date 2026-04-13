import dotenv from 'dotenv';

dotenv.config();

const KEYWORDS = [
  { topic: 'heating', words: ['heat', 'heating', 'winter', 'cool', 'cooling', 'ac', 'air conditioner', 'summer', 'thermostat'] },
  { topic: 'lighting', words: ['light', 'lights', 'bulb', 'led', 'lamp', 'lighting'] },
  { topic: 'appliances', words: ['appliance', 'fridge', 'refrigerator', 'washer', 'washing', 'dryer', 'oven', 'dishwasher'] },
  { topic: 'savings', words: ['bill', 'save', 'savings', 'cost', 'reduce', 'money', 'budget'] },
  { topic: 'solar', words: ['solar', 'panel', 'renewable', 'battery', 'inverter'] },
  { topic: 'habits', words: ['habit', 'routine', 'usage', 'schedule', 'smart plug', 'standby', 'phantom'] },
];

function withTimeout(timeoutMs = 8000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  return {
    signal: controller.signal,
    clear: () => clearTimeout(timeout),
  };
}

function normalizeText(value) {
  return String(value || '').toLowerCase();
}

function detectTopic(text) {
  const normalized = normalizeText(text);

  for (const entry of KEYWORDS) {
    if (entry.words.some((word) => normalized.includes(word))) {
      return entry.topic;
    }
  }

  return 'general';
}

function isFollowUpMessage(text) {
  const normalized = normalizeText(text);
  return [
    'that', 'this', 'it', 'them', 'those', 'what about', 'how about', 'and then', 'also', 'more', 'tell me more'
  ].some((phrase) => normalized.includes(phrase));
}

function getLastUserMessage(history) {
  const items = Array.isArray(history) ? history : [];
  const lastUser = [...items].reverse().find((item) => normalizeText(item?.sender) === 'user' && normalizeText(item?.content).trim());
  return normalizeText(lastUser?.content);
}

function detectRecentTopic(history) {
  const items = Array.isArray(history) ? history : [];
  for (let index = items.length - 1; index >= 0; index -= 1) {
    const entry = items[index];
    if (normalizeText(entry?.sender) !== 'user') {
      continue;
    }
    const topic = detectTopic(entry?.content);
    if (topic !== 'general') {
      return topic;
    }
  }
  return 'general';
}

function getToneForTopic(topic) {
  const tones = {
    heating: 'Heating and cooling usually give the fastest savings.',
    lighting: 'Lighting is one of the easiest areas to improve quickly.',
    appliances: 'Appliances can quietly waste power all day if they are not tuned well.',
    savings: 'There are a few high-impact changes that usually help most homes right away.',
    solar: 'Solar makes sense when usage, roof space, and payback line up.',
    habits: 'Small habit changes can add up faster than people expect.',
    general: 'I can help with practical energy steps that reduce waste without making the advice complicated.',
  };

  return tones[topic] || tones.general;
}

function buildSuggestions(topic) {
  const suggestions = {
    heating: ['How do I lower AC use at night?', 'What thermostat setting saves the most?', 'Should I seal windows or add curtains first?'],
    lighting: ['Which bulbs should I replace first?', 'How much do LEDs really save?', 'Can smart switches reduce costs?'],
    appliances: ['How do I cut fridge energy use?', 'Which appliance wastes the most power?', 'What is phantom load?'],
    savings: ['What gives the fastest payback?', 'How much can I save this month?', 'What are the top 3 changes for my home?'],
    solar: ['Is solar worth it for my home?', 'How do I estimate payback?', 'Do batteries help save more?'],
    habits: ['How do I reduce standby power?', 'What off-peak schedule should I use?', 'Which smart plug settings help most?'],
    general: ['What should I fix first?', 'Can you make me a simple action plan?', 'How do I lower my bill without buying much?'],
  };

  return suggestions[topic] || suggestions.general;
}

async function fetchDuckDuckGoAnswer(query) {
  const timeout = withTimeout();
  try {
    const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
    const response = await fetch(url, { signal: timeout.signal });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const abstract = normalizeText(data?.AbstractText || '').trim();
    if (abstract) {
      return {
        text: data.AbstractText,
        source: data.AbstractSource || 'DuckDuckGo',
      };
    }

    const related = Array.isArray(data?.RelatedTopics) ? data.RelatedTopics : [];
    for (const topic of related) {
      if (typeof topic?.Text === 'string' && topic.Text.trim()) {
        return {
          text: topic.Text.trim(),
          source: 'DuckDuckGo',
        };
      }
    }

    return null;
  } catch {
    return null;
  } finally {
    timeout.clear();
  }
}

async function fetchWikipediaAnswer(query) {
  const timeout = withTimeout();
  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=1&namespace=0&format=json`;
    const searchResponse = await fetch(searchUrl, { signal: timeout.signal });

    if (!searchResponse.ok) {
      return null;
    }

    const searchData = await searchResponse.json();
    const title = Array.isArray(searchData?.[1]) ? searchData[1][0] : '';
    if (!title) {
      return null;
    }

    const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
    const summaryResponse = await fetch(summaryUrl, { signal: timeout.signal });
    if (!summaryResponse.ok) {
      return null;
    }

    const summaryData = await summaryResponse.json();
    const extract = typeof summaryData?.extract === 'string' ? summaryData.extract.trim() : '';
    if (!extract) {
      return null;
    }

    return {
      text: extract,
      source: 'Wikipedia',
      title,
    };
  } catch {
    return null;
  } finally {
    timeout.clear();
  }
}

function buildReply(message, history) {
  const normalizedMessage = normalizeText(message);
  const topic = isFollowUpMessage(normalizedMessage) ? detectRecentTopic(history) : detectTopic(normalizedMessage);
  const lastUserMessage = getLastUserMessage(history);
  const openingPhrases = [
    'Good question.',
    'That is a practical place to start.',
    'I can help with that.',
    'Here is the most useful way to approach it.',
  ];
  const intro = openingPhrases[(normalizedMessage.length + (lastUserMessage.length || 0)) % openingPhrases.length];
  const supportLine = getToneForTopic(topic);
  const suggestions = buildSuggestions(topic);

  const topicReplies = {
    heating: [
      'Set the thermostat a few degrees higher in summer and use ceiling fans first so the AC runs less.',
      'Seal gaps around windows and use blackout curtains on the sun-facing side of the house.',
      'If you want the fastest win, check thermostat scheduling and air leaks before buying new equipment.',
    ],
    lighting: [
      'Switch the bulbs you use most to LEDs first; that gives the fastest return.',
      'Add motion sensors or smart switches in hallways, bathrooms, and storage rooms.',
      'For a lot of homes, lighting changes are cheap and noticeable on the next bill.',
    ],
    appliances: [
      'Clean refrigerator coils, check seals, and avoid over-cooling the fridge.',
      'Run big appliances during off-peak hours if your plan has time-of-use pricing.',
      'Smart power strips help stop standby waste from TV, console, and desktop setups.',
    ],
    savings: [
      'The biggest savings usually come from heating and cooling, lighting, then standby power.',
      'If you want quick savings this month, start with thermostat settings, LED replacement, and unplugging idle loads.',
      'I can also make you a simple step-by-step plan based on your bill and home size.',
    ],
    solar: [
      'Solar works best when your roof gets strong sun and your daytime usage is high.',
      'A good estimate compares your current monthly bill, available roof area, and local incentives.',
      'If you want, I can help you judge whether solar or efficiency upgrades should come first.',
    ],
    habits: [
      'Standby power is one of the easiest hidden losses to cut.',
      'Use smart plugs, schedule shutoff at night, and avoid leaving chargers or devices on when not needed.',
      'A few habit changes can lower usage without any new appliance purchase.',
    ],
    general: [
      'Start with the biggest loads first: heating and cooling, then lighting, then always-on appliances.',
      'If you want a quick result, focus on one area for a week and track the difference.',
      'I can help break it into small actions so it is easier to follow.',
    ],
  };

  const lines = topicReplies[topic] || topicReplies.general;

  return {
    reply: [
      intro,
      '',
      supportLine,
      ...lines.map((line) => `- ${line}`),
      '',
      `Next step: ${suggestions[0]}`,
    ].join('\n'),
    suggestions,
    topic,
    mode: 'free',
  };
}

async function buildGeneralReply(message) {
  const duck = await fetchDuckDuckGoAnswer(message);
  if (duck) {
    return {
      reply: [
        'Here is what I found:',
        '',
        duck.text,
        '',
        `Source: ${duck.source}`,
      ].join('\n'),
      suggestions: [
        `Explain this in simpler words`,
        `Give me 3 key points about this`,
        `How is this useful in real life?`,
      ],
      topic: 'general',
      mode: 'free',
    };
  }

  const wiki = await fetchWikipediaAnswer(message);
  if (wiki) {
    return {
      reply: [
        'Here is a concise answer:',
        '',
        wiki.text,
        '',
        `Source: ${wiki.source}${wiki.title ? ` (${wiki.title})` : ''}`,
      ].join('\n'),
      suggestions: [
        `Summarize this in 5 bullets`,
        `Give me a beginner explanation`,
        `What should I learn next about this?`,
      ],
      topic: 'general',
      mode: 'free',
    };
  }

  return {
    reply: [
      'I could not fetch a reliable external answer right now, but I can still help.',
      '',
      'Try asking with a bit more detail, for example:',
      '- Who is [person]?',
      '- Explain [topic] in simple terms.',
      '- Compare [A] vs [B].',
    ].join('\n'),
    suggestions: [
      'Explain this like I am a beginner',
      'Give a short and detailed version',
      'Ask me clarifying questions first',
    ],
    topic: 'general',
    mode: 'free',
  };
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Handle chat endpoint (POST request to /api/chat.js or /api/index.js)
  if (req.method === 'POST') {
    try {
      const { message, history } = req.body ?? {};

      if (!message || typeof message !== 'string' || !message.trim()) {
        res.status(400).json({ error: 'Message is required.' });
        return;
      }

      const topic = detectTopic(message);
      const payload = topic === 'general'
        ? await buildGeneralReply(message)
        : buildReply(message, history);

      res.status(200).json({
        ...payload,
        fallback: true,
      });
      return;
    } catch (error) {
      console.error('Chat error:', error);
      res.status(500).json({ error: 'Failed to generate response' });
      return;
    }
  }

  // Handle health check
  if (req.method === 'GET') {
    res.status(200).json({ ok: true, service: 'energy-advisor-api' });
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
